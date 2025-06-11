
import { domainConfig } from '@/services/domainConfig';

interface CookieStorageAdapter {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

class CrossDomainCookieStorage implements CookieStorageAdapter {
  private domain: string;

  constructor() {
    // Use the centralized domain configuration
    this.domain = domainConfig.getRootDomain();
  }

  private setCookie(name: string, value: string, days: number = 30): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    
    // Only add domain if we have a valid root domain
    if (this.domain) {
      cookieString += `; domain=${this.domain}`;
    }
    
    // Add Secure flag for HTTPS
    if (window.location.protocol === 'https:') {
      cookieString += '; Secure';
    }
    
    document.cookie = cookieString;
    console.log('CrossDomainStorage: Set cookie', name, 'for domain', this.domain || 'current domain');
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
        console.log('CrossDomainStorage: Retrieved cookie', name, 'value length:', value.length);
        return value;
      }
    }
    
    console.log('CrossDomainStorage: Cookie not found', name);
    return null;
  }

  private deleteCookie(name: string): void {
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    if (this.domain) {
      cookieString += ` domain=${this.domain};`;
    }
    
    document.cookie = cookieString;
    console.log('CrossDomainStorage: Deleted cookie', name, 'from domain', this.domain || 'current domain');
  }

  getItem(key: string): string | null {
    return this.getCookie(`supabase_${key}`);
  }

  setItem(key: string, value: string): void {
    this.setCookie(`supabase_${key}`, value);
  }

  removeItem(key: string): void {
    this.deleteCookie(`supabase_${key}`);
  }
}

export const crossDomainStorage = new CrossDomainCookieStorage();
