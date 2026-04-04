'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  order_index: number;
}

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .order('order_index', { ascending: true });
    if (data) setTeamMembers(data);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-full mb-6">
              OUR MISSION
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Empowering the Next<br />
              Generation of <span className="text-emerald-300">Programmers</span>
            </h1>
            <p className="text-lg text-slate-200 leading-relaxed mb-8">
              We make comprehensive programming education accessible, affordable, and practical. Learn modern languages and frameworks that you can apply to build your career in tech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => window.location.assign('https://wa.me/9705726179?text=Hi%20!%20Iam%20interested%20in%20learning%20more')}
              >
                Chat on WhatsApp
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                View Packages
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  NextGen Coders started with a simple mission: to close the gap between theoretical programming knowledge and real-world development skills. We built a platform designed to help learners gain practical experience through coding projects, expert guidance, and community support.
                </p>
                <p>
                  Today, we serve thousands of aspiring programmers with comprehensive courses in modern languages and frameworks, hands-on exercises, and mentorship from industry professionals.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">10k+</div>
                  <div className="text-slate-600 mt-2 font-medium">Coders Trained</div>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">50+</div>
                  <div className="text-slate-600 mt-2 font-medium">Expert Instructors</div>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">100%</div>
                  <div className="text-slate-600 mt-2 font-medium">Project-Based Learning</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden bg-white p-8 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-3184298341704-3c19c3fe7e5f?auto=format&fit=crop&w=1200&q=80"
                  alt="Team collaboration"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we build and every student we support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-emerald-600 text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Innovation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We constantly evolve our curriculum to match the fast-paced digital landscape, ensuring students learn the most relevant skills.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-emerald-600 text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Community</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We empower learners through community-driven mentorship, peer support, and shared success.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-emerald-600 text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Results</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We focus on tangible outcomes — real projects, real code, and real career progress in tech.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet the Visionaries</h2>
            <p className="text-slate-600">The leadership team behind the platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member.id} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="relative mx-auto mb-4 w-28 h-28 rounded-full overflow-hidden bg-slate-100">
                  <Image
                    src={`https://images.pexels.com/photos/${
                      member.id.slice(0, 6)
                    }/pexels-photo-${member.id.slice(0, 6)}.jpeg?auto=compress&cs=tinysrgb&w=300`}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{member.name}</h3>
                <p className="text-sm font-semibold text-emerald-600 mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div>
                <h3 className="text-slate-900 font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>
                    <a href="/" className="hover:text-slate-900 transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/website-builder" className="hover:text-slate-900 transition-colors">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="hover:text-slate-900 transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/courses" className="hover:text-slate-900 transition-colors">
                      Packages
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-slate-900 font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>
                    <a href="#" className="hover:text-slate-900 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-slate-900 transition-colors">
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-slate-900 transition-colors">
                      Disclaimer
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-slate-900 font-semibold mb-4">Connect</h3>
                <div className="space-y-4 text-slate-600">
                  <div>
                    <div className="font-semibold text-slate-900">WhatsApp</div>
                    <a
                      href="https://wa.me/9705726179?text=Hi%20!%20Iam%20interested%20in%20your%20courses"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 hover:underline"
                    >
                      +970 5726 179
                    </a>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Newsletter</div>
                    <p className="text-sm text-slate-600">Join our newsletter for weekly tips.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
