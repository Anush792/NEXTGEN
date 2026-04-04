'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type StudentSignInProps = {
  redirectTo?: string;
  title?: string;
  description?: string;
};

export default function StudentSignIn({
  redirectTo = '/courses',
  title = 'Student Sign In',
  description = 'Sign in to submit your course order and upload a payment screenshot.',
}: StudentSignInProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('studentEmail', email);
      localStorage.setItem('studentToken', token);
      localStorage.setItem('studentPassword', password);
      router.push(redirectTo);
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl text-white font-bold">{title}</h1>
        <p className="text-sm text-slate-400">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-white block mb-2">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
            placeholder="Enter a password"
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
    </div>
  );
}
