'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github, Globe, Calendar, Users, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const projectsData = {
  'e-commerce-store': {
    title: 'E-Commerce Store',
    description: 'A fully responsive online store with shopping cart and payment integration built for a fashion retailer.',
    longDescription: 'This comprehensive e-commerce solution features a modern, mobile-first design with seamless shopping experience. The platform includes advanced product filtering, secure payment processing through Stripe, inventory management, and real-time order tracking.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    tech: ['React', 'Node.js', 'Stripe', 'MongoDB', 'Tailwind CSS'],
    category: 'E-Commerce',
    client: 'Fashion Forward',
    duration: '3 months',
    team: '4 developers',
    features: [
      'Responsive product catalog',
      'Advanced search and filtering',
      'Secure payment processing',
      'Order tracking system',
      'Admin dashboard',
      'Inventory management',
      'Customer reviews',
      'Email notifications'
    ],
    liveUrl: '#',
    githubUrl: '#',
    screenshots: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
      'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&q=80'
    ]
  },
  'portfolio-website': {
    title: 'Portfolio Website',
    description: 'Modern portfolio site with smooth animations and contact forms for a freelance designer.',
    longDescription: 'A stunning portfolio website that showcases creative work with smooth animations and interactive elements. The site features a custom-built CMS for easy content management and advanced contact forms with validation.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    tech: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'PHP'],
    category: 'Portfolio',
    client: 'Creative Studio',
    duration: '2 months',
    team: '2 developers',
    features: [
      'Smooth scroll animations',
      'Interactive portfolio gallery',
      'Contact form with validation',
      'Custom CMS integration',
      'SEO optimization',
      'Mobile responsive design',
      'Fast loading performance',
      'Social media integration'
    ],
    liveUrl: '#',
    githubUrl: '#',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80',
      'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600&q=80'
    ]
  },
  'task-management-app': {
    title: 'Task Management App',
    description: 'Collaborative task manager with real-time updates and team features for a startup company.',
    longDescription: 'A comprehensive task management solution designed for remote teams. Features real-time collaboration, project tracking, time logging, and advanced reporting capabilities.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    tech: ['React', 'Firebase', 'Tailwind CSS', 'Material-UI'],
    category: 'Productivity',
    client: 'Tech Startup Inc.',
    duration: '4 months',
    team: '3 developers',
    features: [
      'Real-time collaboration',
      'Project management',
      'Time tracking',
      'Team communication',
      'File attachments',
      'Progress analytics',
      'Mobile app',
      'API integration'
    ],
    liveUrl: '#',
    githubUrl: '#',
    screenshots: [
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80'
    ]
  },
  'weather-dashboard': {
    title: 'Weather Dashboard',
    description: 'Beautiful weather app with location-based forecasts and animations for a local news station.',
    longDescription: 'An elegant weather dashboard that provides accurate forecasts with beautiful animations and visualizations. Features location-based weather data, severe weather alerts, and historical weather analysis.',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80',
    tech: ['Vue.js', 'OpenWeather API', 'Chart.js', 'SCSS'],
    category: 'Utility',
    client: 'Metro News Network',
    duration: '2.5 months',
    team: '2 developers',
    features: [
      'Location-based forecasts',
      'Weather animations',
      'Severe weather alerts',
      'Historical data',
      'Interactive charts',
      'Multiple locations',
      'Weather widgets',
      'API integration'
    ],
    liveUrl: '#',
    githubUrl: '#',
    screenshots: [
      'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&q=80',
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600&q=80',
      'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=600&q=80'
    ]
  },
  'blog-platform': {
    title: 'Blog Platform',
    description: 'Full-featured blog with CMS, comments, and social sharing for a content marketing agency.',
    longDescription: 'A robust blogging platform with advanced content management capabilities. Features include multi-author support, SEO optimization, social media integration, and comprehensive analytics.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6f44d?w=800&q=80',
    tech: ['Next.js', 'MongoDB', 'Auth0', 'Vercel'],
    category: 'Content Management',
    client: 'Content Masters',
    duration: '3.5 months',
    team: '3 developers',
    features: [
      'Multi-author support',
      'SEO optimization',
      'Social sharing',
      'Comment system',
      'Content scheduling',
      'Analytics dashboard',
      'Mobile responsive',
      'Performance optimized'
    ],
    liveUrl: '#',
    githubUrl: '#',
    screenshots: [
      'https://images.unsplash.com/photo-1486312338219-ce68e2c6f44d?w=600&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80'
    ]
  }
};

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const project = projectsData[slug as keyof typeof projectsData];

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-slate-300 mb-8">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/website-builder')} className="bg-blue-600 hover:bg-blue-700">
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/website-builder')}
            className="text-slate-300 hover:text-white mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-600/20 text-blue-400 border-blue-600/30">
                {project.category}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {project.title}
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                {project.longDescription}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Site
                </Button>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <Github className="h-4 w-4 mr-2" />
                  View Code
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-400">Duration</p>
                    <p className="text-white font-medium">{project.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-400">Team Size</p>
                    <p className="text-white font-medium">{project.team}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Technologies Used</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {project.tech.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700 px-4 py-2">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {project.features.map((feature, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <p className="text-slate-300">{feature}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Project Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.screenshots.map((screenshot, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={screenshot}
                  alt={`${project.title} screenshot ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-auto hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Website?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your project and create something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/website-builder">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-100">
                View More Projects
              </Button>
            </Link>
            <Button size="lg" className="bg-blue-700 hover:bg-blue-800">
              Get In Touch
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}