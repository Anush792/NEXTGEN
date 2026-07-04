'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Move, Zap, Globe, TrendingUp, ArrowRight, Clock, Star, Users, Code, Sparkles, Rocket, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, Variants } from 'framer-motion';

export default function WebsiteBuilderPage() {

  const projects = [
    {
      id: '1',
      slug: 'e-commerce-store',
      title: 'E-Commerce Store',
      description: 'Modern online shopping platform with advanced cart system, secure payments, and inventory management.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
      tech: 'React, Node.js, Stripe',
      category: 'E-Commerce',
      duration: '2.5 weeks',
      rating: 4.9,
      clients: 15,
      features: ['Payment Gateway', 'Inventory System', 'Admin Dashboard', 'Mobile Responsive']
    },
    {
      id: '2',
      slug: 'portfolio-website',
      title: 'Portfolio Website',
      description: 'Stunning personal portfolio with smooth animations, contact forms, and project showcase gallery.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
      tech: 'HTML, CSS, JavaScript',
      category: 'Portfolio',
      duration: '2 weeks',
      rating: 4.8,
      clients: 23,
      features: ['Smooth Animations', 'Contact Forms', 'Gallery', 'SEO Optimized']
    },
    {
      id: '3',
      slug: 'task-management-app',
      title: 'Task Management App',
      description: 'Collaborative project management tool with real-time updates, team collaboration, and analytics.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&q=80',
      tech: 'React, Firebase, Tailwind',
      category: 'Productivity',
      duration: '3 weeks',
      rating: 4.7,
      clients: 8,
      features: ['Real-time Updates', 'Team Collaboration', 'Analytics Dashboard', 'Mobile App']
    },
    {
      id: '4',
      slug: 'weather-dashboard',
      title: 'Weather Dashboard',
      description: 'Beautiful weather application with location-based forecasts, interactive maps, and weather alerts.',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&q=80',
      tech: 'Vue.js, OpenWeather API',
      category: 'Utility',
      duration: '2 weeks',
      rating: 4.6,
      clients: 12,
      features: ['Location-based Forecast', 'Interactive Maps', 'Weather Alerts', 'Dark Mode']
    },
    {
      id: '5',
      slug: 'blog-platform',
      title: 'Blog Platform',
      description: 'Full-featured blogging platform with content management, social sharing, and monetization tools.',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6f44d?w=400&q=80',
      tech: 'Next.js, MongoDB, Auth0',
      category: 'Content Management',
      duration: '2.5 weeks',
      rating: 4.8,
      clients: 6,
      features: ['CMS System', 'Social Sharing', 'Monetization', 'Analytics']
    },
    {
      id: '6',
      slug: 'restaurant-website',
      title: 'Restaurant Website',
      description: 'Elegant restaurant website with online reservations, menu display, and customer reviews.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      tech: 'React, Node.js, MongoDB',
      category: 'Business',
      duration: '2 weeks',
      rating: 4.9,
      clients: 18,
      features: ['Online Reservations', 'Digital Menu', 'Customer Reviews', 'Delivery Integration']
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6
      }
    },
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80')"
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold text-white mb-6">
                Professional <span className="text-blue-500">Website Builder</span>
                <br />
                <span className="text-blue-500">for Your Business</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                We build stunning, high-performance websites for businesses. From corporate sites to e-commerce platforms, we deliver custom solutions that drive results and exceed expectations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white group">
                  Start Learning Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <motion.button 
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                whileHover={{ x: 5 }}
              >
                <span className="text-sm font-medium">Explore Web Development Course</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div 
                className="rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 shadow-2xl backdrop-blur-sm border border-slate-800"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-slate-900/90 rounded-2xl p-6 shadow-lg border border-slate-700">
                  <div className="space-y-4">
                    <motion.div 
                      className="h-3 w-3/4 bg-slate-600 rounded"
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                    <motion.div 
                      className="h-3 w-1/2 bg-slate-600 rounded"
                      initial={{ width: 0 }}
                      animate={{ width: '50%' }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                    <div className="grid grid-cols-3 gap-2 mt-6">
                      {[...Array(6)].map((_, i) => (
                        <motion.div 
                          key={i} 
                          className="h-16 bg-slate-700 rounded"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 relative">
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80')"
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.05 }}
          viewport={{ once: true }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.p 
              className="text-blue-400 font-semibold mb-2 uppercase text-sm tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              WEB DEVELOPMENT COURSE
            </motion.p>
            <h2 className="text-4xl font-bold text-white mb-4">
              Learn Modern Web Technologies
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Master the skills needed to build responsive, interactive websites from the ground up with our comprehensive curriculum.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all group hover:shadow-lg hover:shadow-blue-500/20">
                <CardHeader>
                  <motion.div 
                    className="mb-3 text-blue-400"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Move className="h-8 w-8" />
                  </motion.div>
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors">HTML & CSS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">
                    Learn semantic HTML and modern CSS techniques for beautiful, responsive layouts with animations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all group hover:shadow-lg hover:shadow-blue-500/20">
                <CardHeader>
                  <motion.div 
                    className="mb-3 text-blue-400"
                    whileHover={{ rotate: -15, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Zap className="h-8 w-8" />
                  </motion.div>
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors">JavaScript</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">
                    Master JavaScript fundamentals and ES6+ features for dynamic, interactive web applications.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all group hover:shadow-lg hover:shadow-blue-500/20">
                <CardHeader>
                  <motion.div 
                    className="mb-3 text-blue-400"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Globe className="h-8 w-8" />
                  </motion.div>
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors">React Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">
                    Build modern user interfaces with React, the most popular frontend framework with hooks and state management.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all group hover:shadow-lg hover:shadow-blue-500/20">
                <CardHeader>
                  <motion.div 
                    className="mb-3 text-blue-400"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp className="h-8 w-8" />
                  </motion.div>
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors">Full Stack Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">
                    Complete real-world projects combining frontend and backend technologies with database integration.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-slate-950 relative">
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80')"
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.05 }}
          viewport={{ once: true }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="h-6 w-6 text-blue-400" />
                <h2 className="text-4xl font-bold text-white">Our Recent Projects</h2>
              </motion.div>
              <p className="text-slate-300 max-w-lg">
                Explore our portfolio of successful client websites built with cutting-edge technologies and delivered within 2-3 weeks.
              </p>
              <motion.div 
                className="flex items-center gap-6 mt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-400">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-slate-400">High Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-400">Client Focused</span>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Button variant="link" className="text-blue-400 hover:text-blue-300 group">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {projects.map((project, index) => (
              <motion.div key={project.id} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/projects/${project.slug}`}>
                    <Card className="bg-slate-800 border-slate-700 overflow-hidden group cursor-pointer hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 h-full">
                      <div className="h-48 relative overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
                        
                        {/* Category Badge */}
                        <motion.div 
                          className="absolute top-3 left-3"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          <span className="text-xs text-blue-400 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-500/30">
                            {project.category}
                          </span>
                        </motion.div>
                        
                        {/* Duration Badge */}
                        <motion.div 
                          className="absolute top-3 right-3"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                        >
                          <span className="text-xs text-green-400 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {project.duration}
                          </span>
                        </motion.div>
                        
                        {/* Tech Stack */}
                        <motion.div 
                          className="absolute bottom-3 left-3"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1 + index * 0.1 }}
                        >
                          <span className="text-xs text-slate-300 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-600/30">
                            {project.tech}
                          </span>
                        </motion.div>

                        {/* Rating Badge */}
                        <motion.div 
                          className="absolute bottom-3 right-3"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                        >
                          <span className="text-xs text-yellow-400 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/30 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            {project.rating}
                          </span>
                        </motion.div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white group-hover:text-blue-400 transition-colors text-lg">
                          {project.title}
                        </CardTitle>
                        <p className="text-slate-300 text-sm line-clamp-2">{project.description}</p>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {/* Features */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {project.features.slice(0, 2).map((feature, i) => (
                              <span key={i} className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                            {project.features.length > 2 && (
                              <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                                +{project.features.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{project.clients} clients</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{project.duration}</span>
                          </div>
                        </div>
                        
                        <motion.div 
                          className="flex items-center text-blue-400 hover:text-blue-300"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-sm font-medium">View Project</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700"
              whileHover={{ y: -5, borderColor: '#3b82f6' }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-3xl font-bold text-blue-400 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                82
              </motion.div>
              <p className="text-slate-400 text-sm">Projects Completed</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700"
              whileHover={{ y: -5, borderColor: '#10b981' }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-3xl font-bold text-green-400 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              >
                2.5
              </motion.div>
              <p className="text-slate-400 text-sm">Avg. Weeks Delivery</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700"
              whileHover={{ y: -5, borderColor: '#f59e0b' }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-3xl font-bold text-yellow-400 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                4.8
              </motion.div>
              <p className="text-slate-400 text-sm">Client Rating</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700"
              whileHover={{ y: -5, borderColor: '#8b5cf6' }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-3xl font-bold text-purple-400 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              >
                100%
              </motion.div>
              <p className="text-slate-400 text-sm">On-Time Delivery</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ y: 5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-400" />
                  Platform
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Website Builder</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Template Library</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Hosting</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Domain Names</a></li>
                </ul>
              </motion.div>

              <motion.div 
                whileHover={{ y: 5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-400" />
                  Resources
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
                </ul>
              </motion.div>

              <motion.div 
                whileHover={{ y: 5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Company
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
