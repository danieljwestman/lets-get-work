
import { DEBUG_CONFIG } from './config';

// Text utilities
export const truncateText = (text: string, maxLength: number = DEBUG_CONFIG.UI.TRUNCATE_LENGTH) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const obfuscateText = (text: string, showLength: number = 4) => {
  if (text.length <= showLength * 2) return '***';
  return `${text.substring(0, showLength)}...${text.substring(text.length - showLength)}`;
};

// Performance utilities - proper throttle with cancel
export const createThrottledFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void } => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  const throttledFunc = ((...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T & { cancel: () => void };

  throttledFunc.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttledFunc;
};

// Memory utilities
export const measureMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100,
      total: Math.round((memory.totalJSHeapSize / 1024 / 1024) * 100) / 100,
      limit: Math.round((memory.jsHeapSizeLimit / 1024 / 1024) * 100) / 100,
    };
  }
  return null;
};

// Client identifier generation
export const generateClientId = (): string => {
  const factors = [
    navigator.userAgent.substring(0, 50),
    navigator.language,
    screen.width,
    screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    window.location.hostname
  ];
  
  const hash = factors.join('|').split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return `client_${Math.abs(hash)}`;
};

// Copy to clipboard utility
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      textArea.remove();
      return success;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Format debug data for copying
export const formatDebugDataForCopy = (data: any): string => {
  const formatValue = (value: any, indent = 0): string => {
    const spaces = '  '.repeat(indent);
    
    if (value === null || value === undefined) {
      return 'null';
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      const entries = Object.entries(value)
        .map(([key, val]) => `${spaces}  ${key}: ${formatValue(val, indent + 1)}`)
        .join('\n');
      return `{\n${entries}\n${spaces}}`;
    }
    
    if (Array.isArray(value)) {
      const items = value
        .map(item => `${spaces}  ${formatValue(item, indent + 1)}`)
        .join('\n');
      return `[\n${items}\n${spaces}]`;
    }
    
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    
    return String(value);
  };
  
  return formatValue(data);
};
