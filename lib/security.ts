import validator from 'validator';

// Input validation and sanitization utilities
export class SecurityUtils {
  // Sanitize HTML input (simple version without external libraries)
  static sanitizeHtml(input: string): string {
    if (typeof input !== 'string') return '';
    // Remove HTML tags and encode special characters
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  }

  // Validate email
  static isValidEmail(email: string): boolean {
    return validator.isEmail(email, {
      allow_utf8_local_part: false,
      require_tld: true,
    });
  }

  // Validate password strength
  static isStrongPassword(password: string): boolean {
    return validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });
  }

  // Sanitize filename
  static sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  // Validate URL
  static isValidUrl(url: string): boolean {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    });
  }

  // Escape SQL-like strings (additional layer)
  static escapeString(input: string): string {
    return input.replace(/['"\\]/g, '\\$&');
  }

  // Generate secure random string
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Validate file upload
  static validateFileUpload(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {}): { valid: boolean; error?: string } {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;

    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit` };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}` };
    }

    return { valid: true };
  }

  // Rate limiting helper (client-side)
  static checkRateLimit(action: string, limit: number = 5, windowMs: number = 60000): boolean {
    const key = `rate_limit_${action}`;
    const now = Date.now();
    const storageKey = `rate_limit_${action}`;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        if (now - data.resetTime < windowMs) {
          if (data.requests >= limit) {
            return false; // Rate limited
          }
          data.requests++;
        } else {
          data.requests = 1;
          data.resetTime = now;
        }
        localStorage.setItem(storageKey, JSON.stringify(data));
      } else {
        localStorage.setItem(storageKey, JSON.stringify({ requests: 1, resetTime: now }));
      }
      return true;
    } catch {
      return true; // Allow if localStorage fails
    }
  }

  // CSRF token generation
  static generateCSRFToken(): string {
    return this.generateSecureToken(64);
  }

  // Validate CSRF token
  static validateCSRFToken(sessionToken: string, providedToken: string): boolean {
    if (!sessionToken || !providedToken) return false;
    return sessionToken === providedToken;
  }
}

// Security middleware for API routes
export function withSecurity(handler: any) {
  return async (req: Request, context: any) => {
    try {
      // Check for suspicious patterns
      const suspiciousPatterns = [
        /\.\./,  // Directory traversal
        /<script/i,  // XSS attempts
        /javascript:/i,  // JavaScript injection
        /on\w+\s*=/i,  // Event handlers
      ];

      const url = new URL(req.url);
      const searchParams = url.searchParams.toString();

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(searchParams) || pattern.test(url.pathname)) {
          return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      // Add security headers to response
      const response = await handler(req, context);

      if (response instanceof Response) {
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
      }

      return response;
    } catch (error) {
      console.error('Security middleware error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}