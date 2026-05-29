'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<ReactNode>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, isAdmin, signIn, checkAdmin } = useAuth();

  // Entrance animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is already logged in and is admin
  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        const adminStatus = await checkAdmin();
        if (adminStatus) {
          router.push('/admin/dashboard');
        }
      }
    };
    checkAuth();
  }, [user, router, checkAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Admin sign in with email/password using Firebase Auth (secure)
      // Password is verified by Firebase Auth server-side, not stored in frontend
      await signIn('anushgiri110@gmail.com', password);

      // Check if user is admin after sign in
      const adminStatus = await checkAdmin();
      if (adminStatus) {
        router.push('/admin/dashboard');
      } else {
        setError('You do not have admin privileges');
      }
    } catch (err: any) {
      const errorCode = err?.code || '';
      const errorMessage = err?.message || '';

      // Handle specific Firebase Auth errors
      if (errorCode === 'auth/configuration-not-found' || errorMessage.includes('configuration-not-found')) {
        setError(
          <div className="space-y-3">
            <p className="font-semibold text-red-400">Firebase Auth Not Configured</p>
            <p className="text-xs text-red-300">
              The Authentication service is not enabled for this Firebase project.
            </p>
            <a 
              href="/setup" 
              className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              🔧 Run Auto-Setup
            </a>
            <div className="text-xs text-slate-400 mt-2 p-2 bg-slate-800/50 rounded">
              <p className="font-medium text-slate-300 mb-1">Or manually:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Firebase Console</a></li>
                <li>Select project: <strong>ngcdo-6b1ce</strong></li>
                <li>Click &quot;Authentication&quot; → &quot;Get Started&quot;</li>
                <li>Enable &quot;Email/Password&quot; provider</li>
                <li>Create user: <strong>anushgiri110@gmail.com</strong></li>
              </ol>
            </div>
          </div> as any
        );
      } else if (errorCode === 'auth/invalid-api-key') {
        setError('Invalid Firebase API key. Please check your Firebase configuration.');
      } else if (errorCode === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else if (errorCode === 'auth/user-not-found') {
        setError(
          <div className="space-y-2">
            <p className="font-semibold text-red-400">Admin user not found</p>
            <p className="text-xs text-slate-400">
              Please create the admin user in Firebase Console:<br/>
              Email: <strong>anushgiri110@gmail.com</strong><br/>
              Password: <strong>Nextgen2624</strong>
            </p>
          </div> as any
        );
      } else if (errorCode === 'auth/wrong-password') {
        setError('Incorrect password. Please use: Nextgen2624');
      } else {
        setError(err.message || 'Invalid credentials');
      }
      console.error('Login error:', errorCode, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Glassmorphism Card */}
      <AnimatePresence>
        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="w-full max-w-md relative z-10"
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              
              {/* Card */}
              <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
                {/* Inner Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 rounded-2xl pointer-events-none" />
                
                {/* Shine Effect */}
                <motion.div
                  className="absolute -inset-full top-0 block h-full w-1/2 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent to-white/10"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeInOut"
                  }}
                />

                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-center mb-8 relative z-10"
                >
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                    Admin Access
                  </h1>
                  <p className="text-sm text-slate-400">
                    Secure portal for administrators
                  </p>
                </motion.div>

                {/* Form */}
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  onSubmit={handleLogin}
                  className="space-y-5 relative z-10"
                >
                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">
                      Admin Password
                    </label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter secure password"
                        className="pl-10 pr-10 py-6 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </motion.div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 backdrop-blur-sm"
                      >
                        {typeof error === 'string' ? (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                          </div>
                        ) : (
                          error
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Login Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed border-0"
                    >
                      <motion.span
                        className="flex items-center justify-center gap-2"
                        animate={loading ? { opacity: [1, 0.7, 1] } : {}}
                        transition={{ duration: 1.5, repeat: loading ? Infinity : 0 }}
                      >
                        {loading ? (
                          <>
                            <motion.div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Lock className="h-5 w-5" />
                            Secure Login
                          </>
                        )}
                      </motion.span>
                    </Button>
                  </motion.div>
                </motion.form>

                {/* Security Note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mt-6 text-center"
                >
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Secured by Firebase Authentication
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
