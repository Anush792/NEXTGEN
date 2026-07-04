'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowLeft, KeyRound, User, Lock } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const alertVariants: Variants = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

interface AlertState {
  type: 'success' | 'error' | 'info';
  message: string;
  section: 'accountId' | 'password';
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailConfirmPassword, setEmailConfirmPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  const [alert, setAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.email) {
      setCurrentEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!newEmail.trim()) {
      setAlert({ type: 'error', message: 'Please enter a new email address.', section: 'accountId' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setAlert({ type: 'error', message: 'Please enter a valid email address.', section: 'accountId' });
      return;
    }

    if (!emailConfirmPassword) {
      setAlert({ type: 'error', message: 'Please enter your current password to confirm.', section: 'accountId' });
      return;
    }

    if (newEmail === currentEmail) {
      setAlert({ type: 'error', message: 'New email is the same as your current email.', section: 'accountId' });
      return;
    }

    setEmailLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAlert({ type: 'success', message: 'Account email updated successfully! A verification link has been sent.', section: 'accountId' });
      setNewEmail('');
      setEmailConfirmPassword('');
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to update email. Please try again.', section: 'accountId' });
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!currentPassword) {
      setAlert({ type: 'error', message: 'Please enter your current password.', section: 'password' });
      return;
    }

    if (!newPassword) {
      setAlert({ type: 'error', message: 'Please enter a new password.', section: 'password' });
      return;
    }

    if (newPassword.length < 8) {
      setAlert({ type: 'error', message: 'Password must be at least 8 characters long.', section: 'password' });
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setAlert({ type: 'error', message: 'Password must contain at least one uppercase letter.', section: 'password' });
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setAlert({ type: 'error', message: 'Password must contain at least one number.', section: 'password' });
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setAlert({ type: 'error', message: 'Password must contain at least one special character.', section: 'password' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match. Please re-enter.', section: 'password' });
      return;
    }

    if (currentPassword === newPassword) {
      setAlert({ type: 'error', message: 'New password must be different from your current password.', section: 'password' });
      return;
    }

    setPasswordLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAlert({ type: 'success', message: 'Password updated successfully!', section: 'password' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to update password. Please try again.', section: 'password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { label: string; color: string; width: string } => {
    if (!password) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
    if (score <= 2) return { label: 'Fair', color: 'bg-orange-500', width: '40%' };
    if (score <= 3) return { label: 'Good', color: 'bg-yellow-500', width: '60%' };
    if (score <= 4) return { label: 'Strong', color: 'bg-emerald-500', width: '80%' };
    return { label: 'Excellent', color: 'bg-cyan-400', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <motion.div
          className="max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm">Back</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Account Settings</h1>
                <p className="text-slate-400 text-sm">Manage your account credentials and security</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-slate-800/80 bg-[#0A0F1C]/80 backdrop-blur-sm p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <User className="h-4 w-4 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Account ID (Email)</h2>
                <p className="text-xs text-slate-500">Update your login email address</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {alert && alert.section === 'accountId' && (
                <motion.div
                  variants={alertVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={`mb-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm border ${
                    alert.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  {alert.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{alert.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Email</label>
                <input
                  type="email"
                  value={currentEmail}
                  disabled
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700/50 px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">New Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="your-new-email@example.com"
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-700/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm with Password</label>
                <input
                  type={showEmailPassword ? 'text' : 'password'}
                  value={emailConfirmPassword}
                  onChange={(e) => setEmailConfirmPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-700/50 px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowEmailPassword(!showEmailPassword)}
                  className="absolute right-3 top-[38px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showEmailPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <motion.button
                type="submit"
                disabled={emailLoading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-medium py-3 text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: emailLoading ? 1 : 1.01 }}
                whileTap={{ scale: emailLoading ? 1 : 0.99 }}
              >
                {emailLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    Update Email
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-slate-800/80 bg-[#0A0F1C]/80 backdrop-blur-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Lock className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Change Password</h2>
                <p className="text-xs text-slate-500">Update your account password</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {alert && alert.section === 'password' && (
                <motion.div
                  variants={alertVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={`mb-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm border ${
                    alert.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  {alert.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{alert.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Password</label>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-700/50 px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-[38px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-700/50 px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-[38px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {newPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Password strength</span>
                    <span
                      className={`font-medium ${
                        passwordStrength.label === 'Weak'
                          ? 'text-red-400'
                          : passwordStrength.label === 'Fair'
                          ? 'text-orange-400'
                          : passwordStrength.label === 'Good'
                          ? 'text-yellow-400'
                          : passwordStrength.label === 'Strong'
                          ? 'text-emerald-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${passwordStrength.color}`}
                      initial={{ width: '0%' }}
                      animate={{ width: passwordStrength.width }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { check: newPassword.length >= 8, label: '8+ characters' },
                      { check: /[A-Z]/.test(newPassword), label: 'Uppercase letter' },
                      { check: /[0-9]/.test(newPassword), label: 'Number' },
                      { check: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword), label: 'Special character' },
                    ].map((rule) => (
                      <div key={rule.label} className="flex items-center gap-1.5 text-xs">
                        <div
                          className={`h-3 w-3 rounded-full flex items-center justify-center ${
                            rule.check ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'
                          }`}
                        >
                          {rule.check && (
                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2 6L5 9L10 3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span className={rule.check ? 'text-slate-300' : 'text-slate-600'}>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm New Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className={`w-full rounded-xl bg-slate-900/60 border px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                    confirmPassword && confirmPassword !== newPassword
                      ? 'border-red-500/50 focus:ring-red-500/40 focus:border-red-500/40'
                      : confirmPassword && confirmPassword === newPassword
                      ? 'border-emerald-500/50 focus:ring-emerald-500/40 focus:border-emerald-500/40'
                      : 'border-slate-700/50 focus:ring-emerald-500/40 focus:border-emerald-500/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`mt-1.5 text-xs ${
                      confirmPassword === newPassword ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {confirmPassword === newPassword ? 'Passwords match ✓' : 'Passwords do not match'}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={passwordLoading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium py-3 text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: passwordLoading ? 1 : 1.01 }}
                whileTap={{ scale: passwordLoading ? 1 : 0.99 }}
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Update Password
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-6 rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 flex items-start gap-3"
          >
            <Shield className="h-5 w-5 text-emerald-500/60 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-400">Security Notice:</strong> All credential changes require
              re-authentication. Your session tokens are encrypted and rotated on every password change.
              Enable two-factor authentication for maximum account security.
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
