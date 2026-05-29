'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export type StudentSignInProps = {
  redirectTo?: string;
  title?: string;
  description?: string;
  initialError?: string | null;
};

export default function StudentSignIn({
  redirectTo = '/student/dashboard',
  title = 'Student Sign In',
  description = 'Sign in to access your dashboard and courses.',
  initialError,
}: StudentSignInProps) {
  const router = useRouter();
  const { user, isAdmin, signIn, signUp, signInGoogle, signInFacebook } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push(redirectTo);
      }
    }
  }, [user, isAdmin, router, redirectTo]);

  // Handle initial error from URL
  useEffect(() => {
    if (initialError) {
      const errorMessages: Record<string, string> = {
        oauth_error: 'OAuth authentication failed. Please check your provider settings.',
        session_error: 'Failed to create session. Please try again.',
        oauth_failed: 'OAuth sign-in failed. Please try a different method.',
        server_error: 'Server error during authentication. Please try again later.',
      };
      setError(errorMessages[initialError] || 'Authentication failed. Please try again.');
    }
  }, [initialError]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorDetails('');
    setPopupBlocked(false);
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (isSignUp && !displayName) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
        setSuccess('Account created successfully! Please sign in.');
        setIsSignUp(false);
        setPassword('');
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setErrorDetails('');
    setPopupBlocked(false);
    setLoading(true);

    // Check for popup blocker
    const testPopup = window.open('about:blank', '_blank', 'width=1,height=1');
    if (!testPopup || testPopup.closed || typeof testPopup.closed === 'undefined') {
      setPopupBlocked(true);
      setError('Popup blocker detected!');
      setErrorDetails('Please allow popups for this site to use Google/Facebook sign-in. Look for a blocked popup icon in your browser address bar and click "Always allow".\n\nAlternatively, you can sign in with email and password.');
      setLoading(false);
      return;
    }
    testPopup.close();

    try {
      await signInGoogle();
    } catch (err: any) {
      const errorMsg = err?.message || 'Google sign-in failed';
      setError(errorMsg);
      // Show technical details for troubleshooting
      if (errorMsg.includes('not enabled') || errorMsg.includes('unauthorized') || errorMsg.includes('auth/')) {
        setErrorDetails('Firebase Configuration Issue:\n\n1. Go to Firebase Console → Authentication → Sign-in method\n2. Enable "Google" provider\n3. Add your domain to Authorized domains list\n4. Ensure support email is set\n\nError: ' + errorMsg);
      }
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setError('');
    setErrorDetails('');
    setPopupBlocked(false);
    setLoading(true);

    // Check for popup blocker
    const testPopup = window.open('about:blank', '_blank', 'width=1,height=1');
    if (!testPopup || testPopup.closed || typeof testPopup.closed === 'undefined') {
      setPopupBlocked(true);
      setError('Popup blocker detected!');
      setErrorDetails('Please allow popups for this site to use Google/Facebook sign-in. Look for a blocked popup icon in your browser address bar and click "Always allow".\n\nAlternatively, you can sign in with email and password.');
      setLoading(false);
      return;
    }
    testPopup.close();

    try {
      await signInFacebook();
    } catch (err: any) {
      const errorMsg = err?.message || 'Facebook sign-in failed';
      setError(errorMsg);
      // Show technical details for troubleshooting
      if (errorMsg.includes('not enabled') || errorMsg.includes('unauthorized') || errorMsg.includes('auth/')) {
        setErrorDetails('Firebase Configuration Issue:\n\n1. Go to Firebase Console → Authentication → Sign-in method\n2. Enable "Facebook" provider\n3. Add Facebook App ID and App Secret\n4. Configure OAuth redirect URI in Facebook Developer Console\n5. Add your domain to Authorized domains list\n\nError: ' + errorMsg);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl text-white font-bold">{title}</h1>
        <p className="text-sm text-slate-400">{description}</p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium flex items-center justify-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>
        <Button
          onClick={handleFacebookSignIn}
          disabled={loading}
          className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium flex items-center justify-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continue with Facebook
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-2 text-slate-400">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        {isSignUp && (
          <div>
            <label className="text-sm font-medium text-white block mb-2">Full Name</label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
              className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              disabled={loading}
              required
            />
          </div>
        )}
        <div>
          <label className="text-sm font-medium text-white block mb-2">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
            disabled={loading}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-white block mb-2">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
            disabled={loading}
            required
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-900/30 p-3 text-sm text-red-400 border border-red-800 space-y-2">
            <p className="font-semibold">{error}</p>
            {errorDetails && (
              <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono bg-red-950/50 p-2 rounded">
                {errorDetails}
              </pre>
            )}
            {popupBlocked && (
              <div className="text-xs text-yellow-400 mt-2">
                💡 <strong>How to fix:</strong> Click the blocked popup icon (🔒 or 🚫) in your browser's address bar, then select "Always allow popups from this site"
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-900/30 p-3 text-sm text-green-400 border border-green-800">
            {success}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
            setErrorDetails('');
            setSuccess('');
            setPopupBlocked(false);
          }}
          disabled={loading}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

