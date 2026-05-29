'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { SecurityUtils } from '@/lib/security';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // No external auth provider: stay on this page until manual login using admin password
    return () => {};
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Security validations
    if (!SecurityUtils.isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // For admin login, allow simpler passwords but still require minimum length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Rate limiting for admin login
    if (!SecurityUtils.checkRateLimit('admin_auth_attempt', 3, 300000)) { // 5 minutes for admin
      setError('Too many login attempts. Please wait 5 minutes before trying again.');
      return;
    }

    setLoading(true);

    try {
      // Call local admin login API which accepts the fixed password
      const resp = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await resp.json();
      if (resp.ok && data?.token) {
        localStorage.setItem('adminToken', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data?.message || 'Invalid password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 px-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-white">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white block mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white block mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                required
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-900/30 p-3 text-sm text-red-400 border border-red-800">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
