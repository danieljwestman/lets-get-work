
import { OpportunityWithTheme } from '@/types/opportunity';

interface RequestQueueItem {
  subdomain: string;
  requestId: string;
  timestamp: number;
  controller: AbortController;
  priority: number;
  requestType: 'direct' | 'subdomain'; // Add request type differentiation
}

interface CacheEntry {
  opportunity: OpportunityWithTheme | null;
  error: string | null;
  timestamp: number;
  sessionId: string;
}

export class OpportunityRequestManager {
  private activeQueue: RequestQueueItem[] = [];
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 30000; // 30 seconds
  private readonly CANCELLATION_GRACE_PERIOD = 1000; // 1 second grace period
  private sessionId = `session-${Date.now()}-${Math.random()}`;

  clearCacheForSubdomain(subdomain: string) {
    this.cache.delete(subdomain);
    console.log('🔧 OPPORTUNITY MANAGER: Cleared cache for subdomain:', subdomain);
  }

  clearAllCache() {
    this.cache.clear();
    console.log('🔧 OPPORTUNITY MANAGER: Cleared all cache');
  }

  enqueueRequest(subdomain: string, requestId: string, priority: number = 0, requestType: 'direct' | 'subdomain' = 'subdomain'): AbortController {
    // For direct requests (main domain routes), be less aggressive about cancellation
    if (requestType === 'direct') {
      // Only cancel existing direct requests for the same subdomain with lower priority
      this.activeQueue = this.activeQueue.filter(item => {
        if (item.subdomain === subdomain && item.requestType === 'direct' && item.priority <= priority) {
          console.log('🔧 OPPORTUNITY MANAGER: Cancelling existing direct request for:', subdomain, 'RequestID:', item.requestId);
          item.controller.abort();
          return false;
        }
        return true;
      });
    } else {
      // For subdomain requests, cancel any existing requests for the same subdomain with lower or equal priority
      // But add a grace period to prevent premature cancellation
      this.activeQueue = this.activeQueue.filter(item => {
        if (item.subdomain === subdomain && item.priority <= priority) {
          const timeSinceRequest = Date.now() - item.timestamp;
          if (timeSinceRequest > this.CANCELLATION_GRACE_PERIOD) {
            console.log('🔧 OPPORTUNITY MANAGER: Cancelling existing request for subdomain:', subdomain, 'RequestID:', item.requestId);
            item.controller.abort();
            return false;
          }
        }
        return true;
      });
    }

    // Create new controller and add to queue
    const controller = new AbortController();
    this.activeQueue.push({
      subdomain,
      requestId,
      timestamp: Date.now(),
      controller,
      priority,
      requestType
    });

    // Sort by priority (higher first) and timestamp (newer first)
    this.activeQueue.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return b.timestamp - a.timestamp;
    });

    console.log('🔧 OPPORTUNITY MANAGER: Enqueued request for subdomain:', subdomain, 'RequestID:', requestId, 'Priority:', priority, 'Type:', requestType);
    return controller;
  }

  dequeueRequest(requestId: string) {
    const initialLength = this.activeQueue.length;
    this.activeQueue = this.activeQueue.filter(item => item.requestId !== requestId);
    if (this.activeQueue.length < initialLength) {
      console.log('🔧 OPPORTUNITY MANAGER: Dequeued request:', requestId);
    }
  }

  isRequestValid(requestId: string): boolean {
    return this.activeQueue.some(item => item.requestId === requestId);
  }

  getCachedResult(subdomain: string) {
    const cached = this.cache.get(subdomain);
    if (cached && 
        (Date.now() - cached.timestamp) < this.CACHE_DURATION &&
        cached.sessionId === this.sessionId) {
      console.log('🔧 OPPORTUNITY MANAGER: Using cached result for:', subdomain);
      return cached;
    }
    
    // Clear stale cache entries
    if (cached && (Date.now() - cached.timestamp) >= this.CACHE_DURATION) {
      console.log('🔧 OPPORTUNITY MANAGER: Clearing stale cache for:', subdomain);
      this.cache.delete(subdomain);
    }
    
    return null;
  }

  setCachedResult(subdomain: string, opportunity: OpportunityWithTheme | null, error: string | null) {
    // Only cache successful results or definitive errors - never cache null/null states
    if (opportunity !== null || (error !== null && error.length > 0 && !error.includes('AbortError'))) {
      this.cache.set(subdomain, { 
        opportunity, 
        error, 
        timestamp: Date.now(),
        sessionId: this.sessionId
      });
      console.log('🔧 OPPORTUNITY MANAGER: Cached result for:', subdomain, 'Success:', !!opportunity, 'Error:', !!error);
    } else {
      console.log('🔧 OPPORTUNITY MANAGER: Skipping cache for incomplete result:', subdomain);
      // Clear any existing cache for this subdomain to prevent contamination
      this.cache.delete(subdomain);
    }
  }

  invalidateCacheOnUrlChange() {
    console.log('🔧 OPPORTUNITY MANAGER: URL changed, clearing all cache');
    this.cache.clear();
    this.sessionId = `session-${Date.now()}-${Math.random()}`;
  }
}
