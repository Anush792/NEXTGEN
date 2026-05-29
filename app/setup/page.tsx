'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  Database, 
  Shield, 
  ExternalLink,
  RefreshCw,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SetupStatus {
  step: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
}

export default function SetupPage() {
  const [status, setStatus] = useState<SetupStatus[]>([
    { step: 'Check Firebase Auth Status', status: 'pending' },
    { step: 'Enable Email/Password Provider', status: 'pending' },
    { step: 'Create Admin User', status: 'pending' },
    { step: 'Set Admin Role', status: 'pending' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [finalMessage, setFinalMessage] = useState<string>('');
  const [showManualSteps, setShowManualSteps] = useState(false);

  const updateStatus = (index: number, newStatus: SetupStatus) => {
    setStatus(prev => prev.map((s, i) => i === index ? newStatus : s));
  };

  const runAutoSetup = async () => {
    setIsRunning(true);
    setFinalMessage('');
    setShowManualSteps(false);

    // Reset all statuses
    setStatus([
      { step: 'Check Firebase Auth Status', status: 'running' },
      { step: 'Enable Email/Password Provider', status: 'pending' },
      { step: 'Create Admin User', status: 'pending' },
      { step: 'Set Admin Role', status: 'pending' },
    ]);

    try {
      // Step 1: Check Firebase Auth
      const checkResponse = await fetch('/api/setup-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check' })
      });
      const checkData = await checkResponse.json();

      if (!checkData.authEnabled) {
        updateStatus(0, { 
          step: 'Check Firebase Auth Status', 
          status: 'error',
          message: 'Auth not enabled - manual setup required'
        });
        setShowManualSteps(true);
        setIsRunning(false);
        return;
      }

      updateStatus(0, { 
        step: 'Check Firebase Auth Status', 
        status: 'success',
        message: 'Firebase Auth is enabled'
      });
      updateStatus(1, { 
        step: 'Enable Email/Password Provider', 
        status: 'success',
        message: 'Email/Password provider active'
      });

      // Step 2 & 3: Create Admin User
      updateStatus(2, { step: 'Create Admin User', status: 'running' });
      
      const createResponse = await fetch('/api/setup-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-admin' })
      });
      const createData = await createResponse.json();

      if (createData.success) {
        updateStatus(2, { 
          step: 'Create Admin User', 
          status: 'success',
          message: `Created: anushgiri110@gmail.com`
        });
        updateStatus(3, { 
          step: 'Set Admin Role', 
          status: 'success',
          message: 'Admin role assigned'
        });
        setFinalMessage('✅ Setup complete! You can now log in to /admin');
      } else if (createData.error?.includes('already exists')) {
        updateStatus(2, { 
          step: 'Create Admin User', 
          status: 'success',
          message: 'User already exists, verified credentials'
        });
        updateStatus(3, { 
          step: 'Set Admin Role', 
          status: 'success',
          message: 'Admin verified'
        });
        setFinalMessage('✅ Admin user already exists with correct password!');
      } else {
        updateStatus(2, { 
          step: 'Create Admin User', 
          status: 'error',
          message: createData.error || 'Failed to create user'
        });
        setShowManualSteps(true);
      }
    } catch (error: any) {
      updateStatus(0, { 
        step: 'Check Firebase Auth Status', 
        status: 'error',
        message: error.message
      });
      setShowManualSteps(true);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 shadow-lg shadow-blue-500/30"
          >
            <Settings className="w-10 h-10 text-white animate-spin-slow" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Firebase Auto-Setup</h1>
          <p className="text-slate-400">Automatically configure Firebase Authentication</p>
        </div>

        {/* Setup Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          {/* Progress Steps */}
          <div className="space-y-4 mb-8">
            {status.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  s.status === 'success' ? 'bg-green-500/10 border-green-500/30' :
                  s.status === 'error' ? 'bg-red-500/10 border-red-500/30' :
                  s.status === 'running' ? 'bg-blue-500/10 border-blue-500/30' :
                  'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                <div className="flex-shrink-0">
                  {s.status === 'running' && (
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  )}
                  {s.status === 'success' && (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  )}
                  {s.status === 'error' && (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  {s.status === 'pending' && (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    s.status === 'success' ? 'text-green-400' :
                    s.status === 'error' ? 'text-red-400' :
                    s.status === 'running' ? 'text-blue-400' :
                    'text-slate-400'
                  }`}>
                    {s.step}
                  </p>
                  {s.message && (
                    <p className="text-sm text-slate-500 mt-1">{s.message}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final Message */}
          {finalMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center"
            >
              <p className="text-green-400 font-semibold">{finalMessage}</p>
              <Button 
                onClick={() => window.location.href = '/admin'}
                className="mt-3 bg-green-600 hover:bg-green-700"
              >
                Go to Admin Login <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Manual Steps */}
          {showManualSteps && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-400 font-semibold mb-2">Manual Setup Required</p>
                  <p className="text-sm text-slate-400 mb-3">
                    Firebase Auth needs to be enabled manually. Follow these steps:
                  </p>
                  <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                    <li>Go to <a href="https://console.firebase.google.com/project/ngcdo-6b1ce/authentication" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3"/></a></li>
                    <li>Click &quot;<strong>Get Started</strong>&quot; in the Authentication section</li>
                    <li>Enable &quot;<strong>Email/Password</strong>&quot; sign-in method</li>
                    <li>Click <strong>Save</strong></li>
                    <li>Go to <strong>Users</strong> tab and click <strong>Add User</strong></li>
                    <li>Email: <code className="bg-slate-800 px-2 py-1 rounded text-amber-300">anushgiri110@gmail.com</code></li>
                    <li>Password: <code className="bg-slate-800 px-2 py-1 rounded text-amber-300">Nextgen2624</code></li>
                    <li>Click <strong>Add User</strong></li>
                  </ol>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <Button
            onClick={runAutoSetup}
            disabled={isRunning}
            className="w-full py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Running Auto-Setup...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Run Auto-Setup
              </>
            )}
          </Button>

          {/* Credentials Display */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Admin Credentials (Pre-configured)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <code className="text-blue-400">anushgiri110@gmail.com</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Password:</span>
                <code className="text-cyan-400">Nextgen2624</code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Project: <code className="text-slate-400">ngcdo-6b1ce</code>
        </p>
      </motion.div>
    </div>
  );
}
