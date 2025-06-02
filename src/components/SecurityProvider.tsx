
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { validateEnvironment, logSecurityEvent } from '@/utils/security';

interface SecurityContextType {
  isSecure: boolean;
  reportSecurityEvent: (event: string, details?: Record<string, any>) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecure, setIsSecure] = React.useState(false);

  useEffect(() => {
    // Validate environment on mount
    validateEnvironment();
    
    // Check if running on HTTPS in production
    const isHTTPS = window.location.protocol === 'https:';
    const isDevelopment = import.meta.env.DEV;
    
    setIsSecure(isHTTPS || isDevelopment);
    
    if (!isHTTPS && !isDevelopment) {
      logSecurityEvent('INSECURE_CONNECTION', { protocol: window.location.protocol });
    }
    
    // Set up global error handler for security events
    window.addEventListener('error', (event) => {
      if (event.error?.name === 'SecurityError') {
        logSecurityEvent('SECURITY_ERROR', { message: event.error.message });
      }
    });
    
    // Monitor for potential XSS attempts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-allowed')) {
                logSecurityEvent('POTENTIAL_XSS', { tagName: element.tagName });
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const reportSecurityEvent = (event: string, details?: Record<string, any>) => {
    logSecurityEvent(event, details);
  };

  return (
    <SecurityContext.Provider value={{ isSecure, reportSecurityEvent }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
