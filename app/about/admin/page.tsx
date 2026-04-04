'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StudentSignIn from '@/components/StudentSignIn';

export default function AboutAdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <StudentSignIn
            title="Student Login"
            description="Use your student sign-in to submit orders and upload payment screenshots."
            redirectTo="/courses"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
