'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 px-4">
      <Card className="w-full max-w-md border-red-800 bg-slate-900">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-white">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-slate-300 mb-4">
              There was an error during authentication. This could be due to:
            </p>
            <ul className="text-sm text-slate-400 text-left space-y-2 mb-6">
              <li>• Invalid or expired authorization code</li>
              <li>• OAuth provider configuration issues</li>
              <li>• Network connectivity problems</li>
              <li>• Supabase credentials not properly configured</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = '/signin'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>

          <div className="text-xs text-slate-500 text-center mt-4">
            If this problem persists, please check your Supabase configuration
            and OAuth provider settings.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}