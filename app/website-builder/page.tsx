'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Move, Zap, Globe, TrendingUp, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WebsiteBuilderPage() {

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80')"
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-white mb-6">
                Professional <span className="text-blue-500">Website Builder</span>
                <br />
                <span className="text-blue-500">for Your Business</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                We build stunning, high-performance websites for businesses. From corporate sites to e-commerce platforms, we deliver custom solutions that drive results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Learning Now
                </Button>
              </div>
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <span className="text-sm font-medium">Explore Web Development Course</span>
              </button>
            </div>

            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 shadow-2xl backdrop-blur-sm border border-slate-800">
                <div className="bg-slate-900/90 rounded-2xl p-6 shadow-lg border border-slate-700">
                  <div className="space-y-4">
                    <div className="h-3 w-3/4 bg-slate-600 rounded"></div>
                    <div className="h-3 w-1/2 bg-slate-600 rounded"></div>
                    <div className="grid grid-cols-3 gap-2 mt-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-16 bg-slate-700 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80')"
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-semibold mb-2 uppercase text-sm tracking-wider">
              WEB DEVELOPMENT COURSE
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              Learn Modern Web Technologies
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Master the skills needed to build responsive, interactive websites from the ground up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all">
              <CardHeader>
                <div className="mb-3 text-blue-400">
                  <Move className="h-8 w-8" />
                </div>
                <CardTitle className="text-white">HTML & CSS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">
                  Learn semantic HTML and modern CSS techniques for beautiful, responsive layouts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all">
              <CardHeader>
                <div className="mb-3 text-blue-400">
                  <Zap className="h-8 w-8" />
                </div>
                <CardTitle className="text-white">JavaScript</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">
                  Master JavaScript fundamentals and ES6+ features for dynamic web applications.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all">
              <CardHeader>
                <div className="mb-3 text-blue-400">
                  <Globe className="h-8 w-8" />
                </div>
                <CardTitle className="text-white">React Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">
                  Build modern user interfaces with React, the most popular frontend framework.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all">
              <CardHeader>
                <div className="mb-3 text-blue-400">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <CardTitle className="text-white">Full Stack Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">
                  Complete real-world projects combining frontend and backend technologies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-950 relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80')"
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Our Recent Projects</h2>
              <p className="text-slate-300">
                Explore our portfolio of successful client websites built with modern technologies.
              </p>
            </div>
            <Button variant="link" className="text-blue-400 hover:text-blue-300">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: '1',
                slug: 'e-commerce-store',
                title: 'E-Commerce Store',
                description: 'A fully responsive online store with shopping cart and payment integration.',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
                tech: 'React, Node.js, Stripe',
                category: 'E-Commerce'
              },
              {
                id: '2',
                slug: 'portfolio-website',
                title: 'Portfolio Website',
                description: 'Modern portfolio site with smooth animations and contact forms.',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
                tech: 'HTML, CSS, JavaScript',
                category: 'Portfolio'
              },
              {
                id: '3',
                slug: 'task-management-app',
                title: 'Task Management App',
                description: 'Collaborative task manager with real-time updates and team features.',
                image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&q=80',
                tech: 'React, Firebase, Tailwind',
                category: 'Productivity'
              },
              {
                id: '4',
                slug: 'weather-dashboard',
                title: 'Weather Dashboard',
                description: 'Beautiful weather app with location-based forecasts and animations.',
                image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&q=80',
                tech: 'Vue.js, OpenWeather API',
                category: 'Utility'
              },
              {
                id: '5',
                slug: 'blog-platform',
                title: 'Blog Platform',
                description: 'Full-featured blog with CMS, comments, and social sharing.',
                image: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6f44d?w=400&q=80',
                tech: 'Next.js, MongoDB, Auth0',
                category: 'Content Management'
              }
            ].map((project, index) => (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <Card className="bg-slate-800 border-slate-700 overflow-hidden group cursor-pointer hover:border-blue-500 transition-all">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="text-xs text-blue-400 bg-slate-900/80 px-2 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs text-slate-300 bg-slate-900/80 px-2 py-1 rounded-full">
                        {project.tech}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </CardTitle>
                    <p className="text-slate-300 text-sm">{project.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-blue-400 hover:text-blue-300">
                      <span className="text-sm font-medium">View Project</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Website Builder</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Template Library</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Hosting</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Domain Names</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
