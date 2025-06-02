
import { securityConfig } from "@/config/security";

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Simple rate limiting function
export const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const windowMs = securityConfig.rateLimiting.windowMs;
  const maxRequests = securityConfig.rateLimiting.max;
  
  const current = rateLimitStore.get(identifier);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
};

// Content Security Policy meta tag generator
export const generateCSPContent = (): string => {
  const csp = securityConfig.csp;
  return Object.entries(csp)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// Secure session storage utilities
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      // In production, consider encryption
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to store secure data:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove secure data:', error);
    }
  }
};

// Error logging without sensitive data exposure
export const logSecurityEvent = (event: string, details?: Record<string, any>): void => {
  const sanitizedDetails = details ? 
    Object.fromEntries(
      Object.entries(details).map(([key, value]) => [
        key, 
        typeof value === 'string' ? value.slice(0, 100) : value
      ])
    ) : {};
    
  console.warn(`Security Event: ${event}`, sanitizedDetails);
  
  // In production, send to security monitoring service
  // Example: securityMonitoring.logEvent(event, sanitizedDetails);
};

// Environment validation
export const validateEnvironment = (): void => {
  const requiredEnvVars = ['VITE_APP_NAME', 'VITE_APP_VERSION'];
  
  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      console.warn(`Missing environment variable: ${envVar}`);
    }
  }
};

// Input sanitization for display
export const sanitizeForDisplay = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// URL validation for external links
export const isSecureUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && !urlObj.hostname.includes('localhost');
  } catch {
    return false;
  }
};
