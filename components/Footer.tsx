import Link from 'next/link';
import { Code as Code2, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-slate-900 dark:text-white">NextGen Coders</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Code, create, innovate</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Comprehensive programming education with hands-on projects, expert mentorship, and modern technologies.
            </p>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/website-builder" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Website Builder
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Packages
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Contact</h3>
            <p className="text-sm leading-relaxed mb-4">
              <span className="font-semibold text-slate-700 dark:text-slate-300">WhatsApp</span>
              <br />
              <a
                href="https://wa.me/9821539140?text=Hi%20!%20Iam%20interested%20in%20your%20courses"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                +98 215 3914 0
              </a>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">Website made by Nextgen</p>
          </div>
        </div>

        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-500">
          <p>© 2026 NextGen Coders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
