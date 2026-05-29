'use client';

import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StudentSignIn from '@/components/StudentSignIn';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <StudentSignIn initialError={error} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
