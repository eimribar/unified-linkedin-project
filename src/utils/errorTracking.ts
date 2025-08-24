// =====================================================
// PRODUCTION ERROR TRACKING AND MONITORING
// Centralized error handling for production environment
// =====================================================

interface ErrorContext {
  userId?: string;
  userEmail?: string;
  clientId?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  context: ErrorContext;
  timestamp: string;
  environment: string;
  userAgent: string;
  url: string;
}

class ErrorTracker {
  private isDevelopment: boolean;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 10;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    
    // Set up global error handler
    if (!this.isDevelopment) {
      window.addEventListener('error', this.handleGlobalError.bind(this));
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }
  }

  /**
   * Track an error with context
   */
  trackError(error: Error | string, context: ErrorContext = {}): void {
    const errorReport: ErrorReport = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString(),
      environment: this.isDevelopment ? 'development' : 'production',
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In development, just log to console
    if (this.isDevelopment) {
      console.error('🚨 Error tracked:', errorReport);
      return;
    }

    // In production, queue for sending
    this.queueError(errorReport);
  }

  /**
   * Track OAuth-specific errors
   */
  trackOAuthError(
    step: 'invitation' | 'provider' | 'callback' | 'linking',
    error: any,
    additionalContext: Record<string, any> = {}
  ): void {
    this.trackError(error, {
      action: `oauth_${step}_error`,
      metadata: {
        ...additionalContext,
        oauthStep: step,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Track successful OAuth completion for metrics
   */
  trackOAuthSuccess(
    provider: string,
    timeToComplete: number,
    context: Record<string, any> = {}
  ): void {
    if (!this.isDevelopment) {
      // Send success metrics (would integrate with analytics service)
      console.log('📊 OAuth success metric:', {
        provider,
        timeToComplete,
        ...context
      });
    }
  }

  /**
   * Queue errors for batch sending
   */
  private queueError(report: ErrorReport): void {
    this.errorQueue.push(report);
    
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.flushErrors();
    }
  }

  /**
   * Send queued errors to monitoring service
   */
  private async flushErrors(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // In production, this would send to Sentry, LogRocket, etc.
      // For now, we'll log them grouped
      console.group('📤 Sending error batch to monitoring service');
      errors.forEach(error => {
        console.error(error);
      });
      console.groupEnd();

      // Example: Send to monitoring endpoint
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ errors })
      // });
    } catch (err) {
      console.error('Failed to send errors to monitoring:', err);
      // Re-queue errors if sending failed
      this.errorQueue = [...errors, ...this.errorQueue].slice(0, this.maxQueueSize * 2);
    }
  }

  /**
   * Handle global window errors
   */
  private handleGlobalError(event: ErrorEvent): void {
    this.trackError(event.error || event.message, {
      action: 'global_error',
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    });
  }

  /**
   * Handle unhandled promise rejections
   */
  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    this.trackError(
      event.reason || 'Unhandled promise rejection',
      {
        action: 'unhandled_rejection',
        metadata: {
          reason: event.reason?.toString()
        }
      }
    );
  }

  /**
   * Manually flush errors (e.g., before page unload)
   */
  flush(): void {
    if (!this.isDevelopment && this.errorQueue.length > 0) {
      this.flushErrors();
    }
  }
}

// Create singleton instance
export const errorTracker = new ErrorTracker();

// Flush errors before page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    errorTracker.flush();
  });
}

/**
 * Production-ready error boundary helper
 */
export function withErrorTracking<T extends (...args: any[]) => any>(
  fn: T,
  context: ErrorContext = {}
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorTracker.trackError(error as Error, context);
      throw error; // Re-throw to maintain error flow
    }
  }) as T;
}

/**
 * OAuth-specific error tracking helper
 */
export function trackOAuthFlow(step: string) {
  const startTime = Date.now();
  
  return {
    success: (provider: string, additionalData?: Record<string, any>) => {
      const duration = Date.now() - startTime;
      errorTracker.trackOAuthSuccess(provider, duration, {
        step,
        ...additionalData
      });
    },
    error: (error: any, additionalData?: Record<string, any>) => {
      errorTracker.trackOAuthError(
        step as any,
        error,
        {
          duration: Date.now() - startTime,
          ...additionalData
        }
      );
    }
  };
}