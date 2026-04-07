'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const packages = [
  {
    id: 'python',
    title: 'Python Programming',
    price: 'Rs 1,999 / lifetime',
    features: ['Python Basics', 'Data Structures', 'OOP', 'Projects'],
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
    cta: 'https://wa.me/9821539140?text=Hi%20!%20Iam%20interested%20in%20Python%20Programming%20course',
  },
  {
    id: 'cpp',
    title: 'C++ Programming',
    price: 'Rs 2,499 / lifetime',
    features: ['C++ Fundamentals', 'STL', 'OOP', 'System Programming'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    cta: 'https://wa.me/9821539140?text=Hi%20!%20Iam%20interested%20in%20C%2B%2B%20Programming%20course',
  },
  {
    id: 'java',
    title: 'Java Programming',
    price: 'Rs 2,999 / lifetime',
    features: ['Java Core', 'Spring Framework', 'Android Development', 'Enterprise Apps'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    cta: 'https://wa.me/9821539140?text=Hi%20!%20Iam%20interested%20in%20Java%20Programming%20course',
  },
  {
    id: 'react',
    title: 'React Development',
    price: 'Rs 3,499 / lifetime',
    features: ['React Fundamentals', 'Hooks', 'Redux', 'Next.js'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    cta: 'https://wa.me/9821539140?text=Hi%20!%20Iam%20interested%20in%20React%20Development%20course',
  },
  {
    id: 'htmlcss',
    title: 'HTML & CSS',
    price: 'Rs 1,499 / lifetime',
    features: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox/Grid'],
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80',
    cta: 'https://wa.me/9821539140?text=Hi%20!%20Iam%20interested%20in%20HTML%20%26%20CSS%20course',
  },
  {
    id: 'fullstack',
    title: 'Full Stack Development',
    price: 'Rs 4,999 / lifetime',
    features: ['Frontend + Backend', 'MERN Stack', 'Database Design', 'Deployment'],
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    cta: 'https://wa.me/9821539140?text=Hi%20!%20Iam%20interested%20in%20Full%20Stack%20Development%20course',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <Header />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center" />
          </div>
          <div className="relative container mx-auto px-4 py-28">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/20 px-4 py-2 text-sm font-semibold text-emerald-200">
                  Learn Code Build
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  NextGen Coders —<br />
                  Programming Courses
                </h1>
                <p className="max-w-2xl text-lg text-slate-200">
                  Master programming languages and frameworks through comprehensive courses — from basics to advanced development.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <a
                    href="#packages"
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Explore Courses
                  </a>
                  <a
                    href="https://wa.me/9821539140?text=Hi%20!%20Iam%20interested%20in%20your%20courses"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:bg-white/20"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="relative h-[380px] md:h-[460px] w-full lg:w-[105%]">
                <div className="rounded-3xl bg-white/10 p-6 md:p-8 backdrop-blur h-full w-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
                    alt="Bright coding workshop with students and modern workstations"
                    fill
                    className="rounded-2xl shadow-2xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="packages" className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Choose Your Programming Course</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Comprehensive courses designed to build your programming career from fundamentals to advanced development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition hover:shadow-lg cursor-pointer"
                >
                  <Link href="/courses">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Link href="/courses">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{pkg.title}</h3>
                      </Link>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{pkg.price}</span>
                    </div>
                    <ul className="space-y-2 mb-6 text-slate-600 dark:text-slate-300">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                            ✓
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={pkg.cta}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Enroll Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  NextGen Coders — Your Programming Learning Partner
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                  We provide comprehensive programming education with courses covering modern languages and frameworks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">6+</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Programming Courses</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">100%</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Hands-on Projects</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">24/7</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Support</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-800 p-8">
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                    alt="Instructor guiding a student"
                    fill
                    className="rounded-2xl shadow object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-600 p-10 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Ready To Work?</h2>
                  <p className="text-lg text-white/90 mb-6">
                    Join thousands of learners who are building careers in digital marketing.
                    Start with a package, and level up with hands-on projects.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://wa.me/9821539140?text=Hi%20!%20Iam%20interested%20in%20your%20courses"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-white/90"
                    >
                      Chat on WhatsApp
                    </a>
                    <a
                      href="#packages"
                      className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20"
                    >
                      View Packages
                    </a>
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-4 text-xl font-semibold">
                    <span>📞</span>
                    <span className="ml-3">9821539140</span>
                  </div>
                  <p className="mt-4 text-sm text-white/80">
                    Need help choosing a package? Message us on WhatsApp and we&apos;ll guide you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
