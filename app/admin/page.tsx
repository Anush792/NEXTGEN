'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  LogOut, Check, X, Clock, Plus, Edit2, Trash2, Eye, Search,
  Users, BookOpen, CheckCircle, XCircle, Save, Phone, Mail,
  BarChart3, QrCode, AlertCircle, Upload, Video as VideoIcon, Image as ImageIcon,
  TrendingUp, DollarSign, Award, Play, ExternalLink, RefreshCw
} from 'lucide-react';
import {
  onOrdersSnapshot,
  onUsersSnapshot,
  onCoursesSnapshot,
  onAdminSettingsSnapshot,
  onAllVideosSnapshot,
  approveOrder,
  rejectOrder,
  deleteOrder,
  updateAdminSettings,
  initializeAdminSettings,
  createCourse,
  deleteCourse,
  updateCourse,
  createVideo,
  deleteVideo,
  updateVideo,
  type Order,
  type AdminSettings,
  type Course,
  type Video
} from '@/lib/firebase-db';
// Firebase storage import removed

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  approvedOrders: number;
  pendingOrders: number;
  rejectedOrders: number;
  totalStudents: number;
  totalCourses: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboardPage() {
  const router = useRouter();

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);

  // UI states
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCountersModal, setShowCountersModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);

  // Order modal states
  const [adminNotes, setAdminNotes] = useState('');

  // Contact settings
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [savingContact, setSavingContact] = useState(false);

  // Counter settings
  const [counterCourses, setCounterCourses] = useState(0);
  const [counterStudents, setCounterStudents] = useState(0);
  const [counterProjects, setCounterProjects] = useState(0);
  const [counterSatisfaction, setCounterSatisfaction] = useState(0);
  const [savingCounters, setSavingCounters] = useState(false);

  // QR Code settings
  const [qrCodeUrlInput, setQrCodeUrlInput] = useState('');
  const [savingQR, setSavingQR] = useState(false);

  // Hero banner settings
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBgImageUrl, setHeroBgImageUrl] = useState('');
  const [savingHero, setSavingHero] = useState(false);

  // Services stats settings
  const [svWebDev, setSvWebDev] = useState(0);
  const [svAppDev, setSvAppDev] = useState(0);
  const [svDigMarketing, setSvDigMarketing] = useState(0);
  const [svSeo, setSvSeo] = useState(0);
  const [savingServices, setSavingServices] = useState(false);

  // Course form states
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    difficulty: 'Beginner',
    price: 0,
    instructorName: '',
    durationHours: 0,
    imageUrl: ''
  });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [savingCourse, setSavingCourse] = useState(false);

  // Video form states
  const [videoForm, setVideoForm] = useState({
    courseName: '',
    title: '',
    youtubeUrl: '',
    orderIndex: 0
  });
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [savingVideo, setSavingVideo] = useState(false);
  const [videoFilter, setVideoFilter] = useState('');

  // Auth check
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
          router.push('/admin/login');
          return;
        }
        setLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/admin/login');
      }
    };
    verifyAdmin();
  }, [router]);

  // Initialize settings
  useEffect(() => {
    const init = async () => {
      try {
        await initializeAdminSettings();
      } catch (error) {
        console.error('Error initializing settings:', error);
      }
    };
    init();
  }, []);

  // Real-time listeners
  useEffect(() => {
    const unsubscribeOrders = onOrdersSnapshot((newOrders) => {
      setOrders(newOrders);
    });

    const unsubscribeUsers = onUsersSnapshot((newUsers) => {
      setUsers(newUsers);
    });

    const unsubscribeCourses = onCoursesSnapshot((newCourses) => {
      setCourses(newCourses);
    });

    const unsubscribeVideos = onAllVideosSnapshot((newVideos) => {
      setVideos(newVideos);
    });

    const unsubscribeSettings = onAdminSettingsSnapshot((newSettings) => {
      try {
        setSettings(newSettings);
        if (newSettings) {
          setContactWhatsapp(newSettings.whatsappNumber || '');
          setContactEmail(newSettings.contactEmail || '');
          setCounterCourses(newSettings.homepageCounters?.courses || 6);
          setCounterStudents(newSettings.homepageCounters?.students || 500);
          setCounterProjects(newSettings.homepageCounters?.projects || 100);
          setCounterSatisfaction(newSettings.homepageCounters?.satisfaction || 98);
          setHeroTitle(newSettings.heroSettings?.title || '');
          setHeroSubtitle(newSettings.heroSettings?.subtitle || '');
          setHeroBgImageUrl(newSettings.heroSettings?.backgroundImageUrl || '');
          setQrCodeUrlInput(newSettings.qrCodeUrl || '');
          setSvWebDev(newSettings.servicesStats?.webDevelopment || 45);
          setSvAppDev(newSettings.servicesStats?.appDevelopment || 30);
          setSvDigMarketing(newSettings.servicesStats?.digitalMarketing || 15);
          setSvSeo(newSettings.servicesStats?.seoServices || 10);
        }
      } catch (error) {
        console.error('Error updating settings state:', error);
      }
    });

    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
      unsubscribeCourses();
      unsubscribeVideos();
      unsubscribeSettings();
    };
  }, []);

  // Calculate stats
  const calculateStats = useCallback((): DashboardStats => {
    const approvedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = approvedOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    return {
      totalOrders: orders.length,
      totalRevenue,
      approvedOrders: approvedOrders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      rejectedOrders: orders.filter(o => o.status === 'rejected').length,
      totalStudents: users.filter(u => u.role === 'user').length,
      totalCourses: courses.length
    };
  }, [orders, users, courses]);

  const stats = calculateStats();

  // Analytics data helpers
  const getRevenueByDay = () => {
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    });
    return last7.map(day => ({
      day,
      revenue: orders
        .filter(o => {
          const d = new Date(o.createdAt?.toDate?.() || o.createdAt);
          return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) === day && o.status === 'completed';
        })
        .reduce((s, o) => s + (o.amount || 0), 0),
      orders: orders.filter(o => {
        const d = new Date(o.createdAt?.toDate?.() || o.createdAt);
        return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) === day;
      }).length
    }));
  };

  const getCourseEnrollments = () => {
    const courseMap = new Map<string, number>();
    orders.filter(o => o.status === 'completed').forEach(o => {
      courseMap.set(o.courseName, (courseMap.get(o.courseName) || 0) + 1);
    });
    return Array.from(courseMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  };

  const getOrderStatusPie = () => [
    { name: 'Approved', value: stats.approvedOrders },
    { name: 'Pending', value: stats.pendingOrders },
    { name: 'Rejected', value: stats.rejectedOrders },
  ].filter(d => d.value > 0);

  // Handle logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/admin/login');
    }
  };

  // Handle contact settings save
  const handleSaveContact = async () => {
    try {
      if (!contactWhatsapp || !contactEmail) {
        toast.error('Please fill in all contact fields');
        return;
      }
      setSavingContact(true);
      await updateAdminSettings({ whatsappNumber: contactWhatsapp, contactEmail });
      toast.success('Contact settings saved!');
      setShowContactModal(false);
    } catch (error: any) {
      toast.error(`Error: ${error?.message || 'Failed to save contact settings'}`);
    } finally {
      setSavingContact(false);
    }
  };

  // Handle counter settings save
  const handleSaveCounters = async () => {
    try {
      if (counterSatisfaction < 0 || counterSatisfaction > 100) {
        toast.error('Satisfaction must be 0-100');
        return;
      }
      setSavingCounters(true);
      await updateAdminSettings({
        homepageCounters: {
          courses: counterCourses,
          students: counterStudents,
          projects: counterProjects,
          satisfaction: counterSatisfaction
        }
      });
      toast.success('Homepage statistics saved!');
      setShowCountersModal(false);
    } catch (error: any) {
      toast.error(`Error: ${error?.message || 'Failed to save counters'}`);
    } finally {
      setSavingCounters(false);
    }
  };

  // Handle QR code save
  const handleSaveQR = async () => {
    try {
      setSavingQR(true);
      await updateAdminSettings({ qrCodeUrl: qrCodeUrlInput });
      toast.success('QR code updated!');
      setShowQRModal(false);
    } catch (error: any) {
      toast.error(`Error: ${error?.message || 'Failed to save QR code'}`);
    } finally {
      setSavingQR(false);
    }
  };

  // Handle Hero Banner save
  const handleSaveHero = async () => {
    try {
      setSavingHero(true);
      await updateAdminSettings({
        heroSettings: {
          title: heroTitle,
          subtitle: heroSubtitle,
          backgroundImageUrl: heroBgImageUrl
        }
      });
      toast.success('Hero banner settings saved!');
      setShowHeroModal(false);
    } catch (error: any) {
      toast.error(`Error: ${error?.message || 'Failed to save hero settings'}`);
    } finally {
      setSavingHero(false);
    }
  };

  // Handle Services Stats save
  const handleSaveServices = async () => {
    try {
      setSavingServices(true);
      await updateAdminSettings({
        servicesStats: {
          webDevelopment: svWebDev,
          appDevelopment: svAppDev,
          digitalMarketing: svDigMarketing,
          seoServices: svSeo
        }
      });
      toast.success('Services stats saved!');
      setShowServicesModal(false);
    } catch (error: any) {
      toast.error(`Error: ${error?.message || 'Failed to save services stats'}`);
    } finally {
      setSavingServices(false);
    }
  };

  // Handle approve order
  const handleApproveOrder = async (orderId: string) => {
    try {
      await approveOrder(orderId, adminNotes);
      toast.success('✓ Student accepted! They now have access.');
      setShowOrderModal(false);
      setAdminNotes('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve order');
    }
  };

  // Handle reject order
  const handleRejectOrder = async (orderId: string) => {
    try {
      await rejectOrder(orderId, adminNotes);
      toast.success('✗ Student enrollment rejected');
      setShowOrderModal(false);
      setAdminNotes('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject order');
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order permanently?')) {
      try {
        await deleteOrder(orderId);
        toast.success('Order deleted');
        setShowOrderModal(false);
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete order');
      }
    }
  };

  // Handle save course
  const handleSaveCourse = async () => {
    try {
      if (!courseForm.title || !courseForm.instructorName || !courseForm.category) {
        toast.error('Please fill in required fields: Title, Instructor, Category');
        return;
      }
      setSavingCourse(true);
      if (editingCourseId) {
        await updateCourse(editingCourseId, courseForm);
        toast.success('✓ Course updated!');
      } else {
        await createCourse(courseForm);
        toast.success('✓ Course created!');
      }
      setCourseForm({ title: '', description: '', category: 'Web Development', difficulty: 'Beginner', price: 0, instructorName: '', durationHours: 0, imageUrl: '' });
      setEditingCourseId(null);
      setShowCourseModal(false);
    } catch (error: any) {
      toast.error(`Error: ${error?.message || 'Failed to save course'}`);
    } finally {
      setSavingCourse(false);
    }
  };

  // Handle edit course
  const handleEditCourse = (course: Course) => {
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      price: course.price,
      instructorName: course.instructorName,
      durationHours: course.durationHours,
      imageUrl: course.imageUrl
    });
    setEditingCourseId(course.id || null);
    setShowCourseModal(true);
  };

  // Handle delete course
  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
        toast.success('✓ Course deleted');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete course');
      }
    }
  };

  // Handle save video
  const handleSaveVideo = async () => {
    try {
      if (!videoForm.courseName || !videoForm.title || !videoForm.youtubeUrl) {
        toast.error('Please fill in course name, title, and YouTube URL');
        return;
      }
      setSavingVideo(true);
      if (editingVideoId) {
        await updateVideo(editingVideoId, {
          courseName: videoForm.courseName,
          title: videoForm.title,
          youtubeUrl: videoForm.youtubeUrl,
          orderIndex: videoForm.orderIndex
        });
        toast.success('✓ Video updated!');
      } else {
        await createVideo({
          courseName: videoForm.courseName,
          title: videoForm.title,
          youtubeUrl: videoForm.youtubeUrl,
          orderIndex: videoForm.orderIndex
        });
        toast.success('✓ Video added!');
      }
      setVideoForm({ courseName: '', title: '', youtubeUrl: '', orderIndex: 0 });
      setEditingVideoId(null);
      setShowVideoModal(false);
    } catch (error: any) {
      toast.error(`Error: ${error?.message || 'Failed to save video'}`);
    } finally {
      setSavingVideo(false);
    }
  };

  // Handle delete video
  const handleDeleteVideo = async (videoId: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(videoId);
        toast.success('✓ Video deleted');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete video');
      }
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filtered videos
  const filteredVideos = videos.filter(v =>
    !videoFilter || v.courseName?.toLowerCase().includes(videoFilter.toLowerCase()) || v.title?.toLowerCase().includes(videoFilter.toLowerCase())
  );

  // Status helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/30 text-yellow-400 border-yellow-600';
      case 'completed': return 'bg-green-900/30 text-green-400 border-green-600';
      case 'rejected': return 'bg-red-900/30 text-red-400 border-red-600';
      default: return 'bg-slate-800 text-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <Check className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  const getYouTubeId = (url: string) => {
    const match = url?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <RefreshCw className="h-10 w-10 text-blue-400 animate-spin mx-auto" />
          <p className="text-white text-xl">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NextGen Admin</h1>
              <p className="text-xs text-slate-400">Platform Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {stats.pendingOrders > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-900/30 border border-yellow-700 rounded-full">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-yellow-400 text-sm font-medium">{stats.pendingOrders} pending</span>
              </div>
            )}
            <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, color: 'text-green-400', icon: <DollarSign className="h-5 w-5" />, bg: 'bg-green-900/20 border-green-800' },
            { label: 'Total Orders', value: stats.totalOrders, color: 'text-blue-400', icon: <BarChart3 className="h-5 w-5" />, bg: 'bg-blue-900/20 border-blue-800' },
            { label: 'Pending Orders', value: stats.pendingOrders, color: 'text-yellow-400', icon: <Clock className="h-5 w-5" />, bg: 'bg-yellow-900/20 border-yellow-800' },
            { label: 'Total Courses', value: stats.totalCourses, color: 'text-purple-400', icon: <BookOpen className="h-5 w-5" />, bg: 'bg-purple-900/20 border-purple-800' },
            { label: 'Approved', value: stats.approvedOrders, color: 'text-emerald-400', icon: <CheckCircle className="h-5 w-5" />, bg: 'bg-emerald-900/20 border-emerald-800' },
            { label: 'Rejected', value: stats.rejectedOrders, color: 'text-red-400', icon: <XCircle className="h-5 w-5" />, bg: 'bg-red-900/20 border-red-800' },
            { label: 'Active Students', value: stats.totalStudents, color: 'text-cyan-400', icon: <Users className="h-5 w-5" />, bg: 'bg-cyan-900/20 border-cyan-800' },
            { label: 'Total Videos', value: videos.length, color: 'text-pink-400', icon: <VideoIcon className="h-5 w-5" />, bg: 'bg-pink-900/20 border-pink-800' },
          ].map((s, i) => (
            <Card key={i} className={`border ${s.bg}`}>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={s.color}>{s.icon}</span>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/80 border border-slate-700 mb-6">
            {[
              { value: 'overview', label: 'Overview' },
              { value: 'analytics', label: 'Analytics' },
              { value: 'orders', label: `Orders${stats.pendingOrders > 0 ? ` (${stats.pendingOrders})` : ''}` },
              { value: 'courses', label: 'Courses' },
              { value: 'videos', label: 'Videos' },
              { value: 'settings', label: 'Settings' },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700 text-xs sm:text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ===== OVERVIEW TAB ===== */}
          <TabsContent value="overview" className="space-y-4 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader><CardTitle className="text-white">Quick Stats</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: '✓ Approved', value: stats.approvedOrders, color: 'text-green-400' },
                      { label: '⏳ Pending', value: stats.pendingOrders, color: 'text-yellow-400' },
                      { label: '✗ Rejected', value: stats.rejectedOrders, color: 'text-red-400' },
                      { label: '👥 Students', value: stats.totalStudents, color: 'text-purple-400' },
                    ].map((s, i) => (
                      <div key={i} className="p-3 bg-slate-800 rounded-lg">
                        <p className="text-slate-400 text-xs">{s.label}</p>
                        <p className={`${s.color} text-xl font-bold mt-1`}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900">
                <CardHeader><CardTitle className="text-white">Recent Orders</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {orders.slice(0, 6).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm truncate">{order.courseName}</p>
                          <p className="text-xs text-slate-400 truncate">{order.userEmail}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} border ml-2 text-xs`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No orders yet</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Courses */}
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Courses ({courses.length})</CardTitle>
                  <Button size="sm" onClick={() => setActiveTab('courses')} className="bg-blue-600 hover:bg-blue-700 text-xs">
                    Manage All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {courses.slice(0, 6).map(course => (
                    <div key={course.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                      {course.imageUrl ? (
                        <img src={course.imageUrl} alt={course.title} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{course.title}</p>
                        <p className="text-xs text-slate-400">₹{course.price} • {course.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== ANALYTICS TAB ===== */}
          <TabsContent value="analytics" className="space-y-4 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue chart */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <CardTitle className="text-white">Revenue (Last 7 Days)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={getRevenueByDay()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={v => `₹${v}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                        labelStyle={{ color: '#f1f5f9' }}
                        formatter={(v: any) => [`₹${v}`, 'Revenue']}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Orders chart */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-white">Orders (Last 7 Days)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={getRevenueByDay()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                        labelStyle={{ color: '#f1f5f9' }}
                      />
                      <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Order status pie */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">Order Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {getOrderStatusPie().length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={getOrderStatusPie()} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: '#94a3b8' }}>
                          {getOrderStatusPie().map((_, index) => (
                            <Cell key={`cell-${index}`} fill={[COLORS[1], COLORS[2], COLORS[3]][index]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-slate-500 py-8">No order data yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Course enrollments */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">Top Course Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  {getCourseEnrollments().length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={getCourseEnrollments()} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 9 }} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-slate-500 py-8 text-center">No enrollment data yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== ORDERS TAB ===== */}
          <TabsContent value="orders" className="mt-0">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="text-white">All Orders ({filteredOrders.length})</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Input
                      placeholder="Search by course or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-56 border-slate-700 bg-slate-800 text-white text-sm"
                    />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-slate-700 bg-slate-800 text-white rounded-md px-3 text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{order.courseName}</p>
                        <p className="text-sm text-slate-400 truncate">{order.userEmail}</p>
                        <p className="text-xs text-slate-500">₹{order.amount} • {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge className={`${getStatusColor(order.status)} border hidden sm:flex`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedOrder(order); setAdminNotes(order.adminNotes || ''); setShowOrderModal(true); }} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && (
                    <p className="text-slate-400 text-center py-12">No orders found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== COURSES TAB ===== */}
          <TabsContent value="courses" className="mt-0">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Courses ({courses.length})</CardTitle>
                  <Button onClick={() => { setCourseForm({ title: '', description: '', category: 'Web Development', difficulty: 'Beginner', price: 0, instructorName: '', durationHours: 0, imageUrl: '' }); setEditingCourseId(null); setShowCourseModal(true); }} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" /> Add Course
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {course.imageUrl ? (
                          <img src={course.imageUrl} alt={course.title} className="h-12 w-16 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="h-12 w-16 rounded bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">{course.title}</p>
                          <p className="text-sm text-slate-400">₹{course.price} • {course.category}</p>
                          <p className="text-xs text-slate-500">{course.durationHours}h • {course.difficulty} • {course.instructorName}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditCourse(course)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCourse(course.id!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No courses yet. Add your first course!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== VIDEOS TAB ===== */}
          <TabsContent value="videos" className="mt-0">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-white">Course Videos ({videos.length})</CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Filter by course or title..."
                      value={videoFilter}
                      onChange={(e) => setVideoFilter(e.target.value)}
                      className="w-52 border-slate-700 bg-slate-800 text-white text-sm"
                    />
                    <Button onClick={() => { setVideoForm({ courseName: '', title: '', youtubeUrl: '', orderIndex: videos.length }); setEditingVideoId(null); setShowVideoModal(true); }} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" /> Add Video
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredVideos.map((video) => {
                    const ytId = getYouTubeId(video.youtubeUrl);
                    return (
                      <div key={video.id} className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                        {ytId ? (
                          <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={video.title} className="h-14 w-24 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="h-14 w-24 rounded bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <Play className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">{video.title}</p>
                          <p className="text-sm text-blue-400 truncate">{video.courseName}</p>
                          <p className="text-xs text-slate-500 truncate">{video.youtubeUrl}</p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button size="sm" variant="ghost" onClick={() => window.open(video.youtubeUrl, '_blank')} className="text-slate-400 hover:text-white">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setVideoForm({ courseName: video.courseName, title: video.title, youtubeUrl: video.youtubeUrl, orderIndex: video.orderIndex }); setEditingVideoId(video.id || null); setShowVideoModal(true); }} className="border-slate-600 text-slate-300">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteVideo(video.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredVideos.length === 0 && (
                    <div className="text-center py-12">
                      <VideoIcon className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No videos yet. Add course videos for students.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== SETTINGS TAB ===== */}
          <TabsContent value="settings" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Info */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-blue-400" />
                      <CardTitle className="text-white">Contact Information</CardTitle>
                    </div>
                    <Button size="sm" onClick={() => setShowContactModal(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <p className="text-slate-400 text-xs">WhatsApp Number</p>
                    <p className="text-white font-mono mt-0.5">{settings?.whatsappNumber || 'Not set'}</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <p className="text-slate-400 text-xs">Contact Email</p>
                    <p className="text-white font-mono mt-0.5">{settings?.contactEmail || 'Not set'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Homepage Counters */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                      <CardTitle className="text-white">Homepage Statistics</CardTitle>
                    </div>
                    <Button size="sm" onClick={() => setShowCountersModal(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Courses', value: settings?.homepageCounters?.courses || 0 },
                      { label: 'Students', value: settings?.homepageCounters?.students || 0 },
                      { label: 'Projects', value: settings?.homepageCounters?.projects || 0 },
                      { label: 'Satisfaction', value: `${settings?.homepageCounters?.satisfaction || 0}%` },
                    ].map((s, i) => (
                      <div key={i} className="p-3 bg-slate-800 rounded-lg">
                        <p className="text-slate-400 text-xs">{s.label}</p>
                        <p className="text-white text-xl font-bold mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* QR Code */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-purple-400" />
                      <CardTitle className="text-white">Payment QR Code</CardTitle>
                    </div>
                    <Button size="sm" onClick={() => setShowQRModal(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-1" /> Upload
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {settings?.qrCodeUrl ? (
                    <div className="p-4 bg-slate-800 rounded-lg flex items-center gap-4">
                      <img src={settings.qrCodeUrl} alt="QR Code" className="h-24 w-24 object-contain rounded border border-slate-600" />
                      <div>
                        <p className="text-green-400 text-sm font-medium">✓ QR code active</p>
                        <p className="text-slate-400 text-xs mt-1">Shown on checkout page</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-800 rounded-lg flex items-center gap-2 text-slate-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">No QR code uploaded yet</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Hero Banner */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-orange-400" />
                      <CardTitle className="text-white">Hero Banner</CardTitle>
                    </div>
                    <Button size="sm" onClick={() => setShowHeroModal(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <p className="text-slate-400 text-xs">Hero Title</p>
                    <p className="text-white mt-0.5 text-sm">{settings?.heroSettings?.title || 'Using default title'}</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <p className="text-slate-400 text-xs">Hero Subtitle</p>
                    <p className="text-white mt-0.5 text-sm line-clamp-2">{settings?.heroSettings?.subtitle || 'Using default subtitle'}</p>
                  </div>
                  {settings?.heroSettings?.backgroundImageUrl && (
                    <div className="p-3 bg-slate-800 rounded-lg">
                      <p className="text-slate-400 text-xs mb-2">Background Image</p>
                      <img src={settings.heroSettings.backgroundImageUrl} alt="Hero BG" className="h-16 w-full object-cover rounded" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Services Stats */}
              <Card className="border-slate-800 bg-slate-900 md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-cyan-400" />
                      <CardTitle className="text-white">Services Stats</CardTitle>
                    </div>
                    <Button size="sm" onClick={() => setShowServicesModal(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Web Development', value: `${settings?.servicesStats?.webDevelopment || 0}%`, color: 'text-blue-400' },
                      { label: 'App Development', value: `${settings?.servicesStats?.appDevelopment || 0}%`, color: 'text-green-400' },
                      { label: 'Digital Marketing', value: `${settings?.servicesStats?.digitalMarketing || 0}%`, color: 'text-yellow-400' },
                      { label: 'SEO Services', value: `${settings?.servicesStats?.seoServices || 0}%`, color: 'text-purple-400' },
                    ].map((s, i) => (
                      <div key={i} className="p-3 bg-slate-800 rounded-lg">
                        <p className="text-slate-400 text-xs">{s.label}</p>
                        <p className={`${s.color} text-xl font-bold mt-0.5`}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== ORDER DETAIL MODAL ===== */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details & Student Acceptance</DialogTitle>
            <DialogDescription className="sr-only">Details of the selected student course enrollment order</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Course:</span>
                  <span className="text-white font-semibold text-right">{selectedOrder.courseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student:</span>
                  <span className="text-white">{selectedOrder.userDisplayName || selectedOrder.userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white">{selectedOrder.userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="text-white font-semibold">₹{selectedOrder.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status:</span>
                  <Badge className={`${getStatusColor(selectedOrder.status)} border`}>{selectedOrder.status}</Badge>
                </div>
                {selectedOrder.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="text-white text-xs">{new Date(selectedOrder.createdAt?.toDate?.() || selectedOrder.createdAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Payment Screenshot / Transaction ID */}
              {(selectedOrder.screenshotUrl || selectedOrder.paymentProofUrl) && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Payment Verification</p>
                  {((selectedOrder.screenshotUrl || selectedOrder.paymentProofUrl || '').startsWith('http') || 
                    (selectedOrder.screenshotUrl || selectedOrder.paymentProofUrl || '').startsWith('data:image')) ? (
                    <img
                      src={selectedOrder.screenshotUrl || selectedOrder.paymentProofUrl}
                      alt="Payment proof"
                      className="rounded-lg border border-slate-700 max-h-64 w-full object-contain bg-slate-800"
                    />
                  ) : (
                    <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg font-mono text-sm text-white select-all">
                      {selectedOrder.screenshotUrl || selectedOrder.paymentProofUrl}
                    </div>
                  )}
                </div>
              )}

              {selectedOrder.adminNotes && (
                <div className="p-3 bg-slate-800 rounded-lg">
                  <p className="text-slate-400 text-xs mb-1">Admin Notes</p>
                  <p className="text-slate-300 text-sm">{selectedOrder.adminNotes}</p>
                </div>
              )}

              {selectedOrder.status === 'pending' && (
                <>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Add Notes (optional)</label>
                    <Textarea
                      placeholder="Add notes about this student..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="border-slate-700 bg-slate-800 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleApproveOrder(selectedOrder.id!)} className="flex-1 bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" /> Accept Student
                    </Button>
                    <Button onClick={() => handleRejectOrder(selectedOrder.id!)} variant="destructive" className="flex-1">
                      <XCircle className="h-4 w-4 mr-2" /> Decline
                    </Button>
                  </div>
                </>
              )}

              {selectedOrder.status === 'completed' && (
                <div className="p-3 bg-green-900/30 border border-green-600 rounded-lg">
                  <p className="text-green-400 font-semibold">✓ Accepted</p>
                  <p className="text-sm text-green-300">Student has access to this course</p>
                </div>
              )}

              {selectedOrder.status === 'rejected' && (
                <div className="p-3 bg-red-900/30 border border-red-600 rounded-lg">
                  <p className="text-red-400 font-semibold">✗ Declined</p>
                  <p className="text-sm text-red-300">Student enrollment was rejected</p>
                </div>
              )}

              <Button
                onClick={() => handleDeleteOrder(selectedOrder.id!)}
                variant="outline"
                className="w-full border-red-800 text-red-400 hover:bg-red-900/30"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Order
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== COURSE MODAL ===== */}
      <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourseId ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            <DialogDescription className="sr-only">Form to add or edit information for a course</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">Course Title *</label>
              <Input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="e.g., React.js Fundamentals" className="border-slate-700 bg-slate-800 text-white" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">Description</label>
              <Textarea value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} placeholder="Course description..." className="border-slate-700 bg-slate-800 text-white h-24" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Instructor *</label>
                <Input value={courseForm.instructorName} onChange={(e) => setCourseForm({ ...courseForm, instructorName: e.target.value })} placeholder="Instructor name" className="border-slate-700 bg-slate-800 text-white" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Price (₹)</label>
                <Input type="number" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: parseInt(e.target.value) || 0 })} className="border-slate-700 bg-slate-800 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Category *</label>
                <select value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })} className="w-full border border-slate-700 bg-slate-800 text-white rounded px-2 py-2 text-sm">
                  <option>Web Development</option><option>Mobile App</option><option>UI/UX Design</option>
                  <option>Digital Marketing</option><option>Data Science</option><option>Programming</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Difficulty</label>
                <select value={courseForm.difficulty} onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })} className="w-full border border-slate-700 bg-slate-800 text-white rounded px-2 py-2 text-sm">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Duration (hrs)</label>
                <Input type="number" value={courseForm.durationHours} onChange={(e) => setCourseForm({ ...courseForm, durationHours: parseInt(e.target.value) || 0 })} className="border-slate-700 bg-slate-800 text-white" />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">Course Image URL</label>
              <Input type="text" value={courseForm.imageUrl} onChange={(e) => setCourseForm({ ...courseForm, imageUrl: e.target.value })} placeholder="e.g., https://example.com/image.jpg" className="border-slate-700 bg-slate-800 text-white" />
              {courseForm.imageUrl && (
                <img src={courseForm.imageUrl} alt="Current" className="mt-2 h-20 rounded object-cover" />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCourseModal(false)} className="border-slate-600">Cancel</Button>
              <Button onClick={handleSaveCourse} disabled={savingCourse} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" /> {savingCourse ? 'Saving...' : 'Save Course'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== VIDEO MODAL ===== */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingVideoId ? 'Edit Video' : 'Add Course Video'}</DialogTitle>
            <DialogDescription className="sr-only">Form to add or edit videos associated with a course</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">Course Name *</label>
              <select value={videoForm.courseName} onChange={(e) => setVideoForm({ ...videoForm, courseName: e.target.value })} className="w-full border border-slate-700 bg-slate-800 text-white rounded px-2 py-2 text-sm">
                <option value="">-- Select Course --</option>
                {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
              </select>
              {!courses.length && (
                <Input value={videoForm.courseName} onChange={(e) => setVideoForm({ ...videoForm, courseName: e.target.value })} placeholder="Or type course name" className="mt-2 border-slate-700 bg-slate-800 text-white" />
              )}
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">Video Title *</label>
              <Input value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="e.g., Introduction to React" className="border-slate-700 bg-slate-800 text-white" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">YouTube URL *</label>
              <Input value={videoForm.youtubeUrl} onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="border-slate-700 bg-slate-800 text-white" />
              {videoForm.youtubeUrl && getYouTubeId(videoForm.youtubeUrl) && (
                <img src={`https://img.youtube.com/vi/${getYouTubeId(videoForm.youtubeUrl)}/mqdefault.jpg`} alt="Preview" className="mt-2 h-24 w-full object-cover rounded border border-slate-700" />
              )}
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">Order Index</label>
              <Input type="number" value={videoForm.orderIndex} onChange={(e) => setVideoForm({ ...videoForm, orderIndex: parseInt(e.target.value) || 0 })} className="border-slate-700 bg-slate-800 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVideoModal(false)} className="border-slate-600">Cancel</Button>
            <Button onClick={handleSaveVideo} disabled={savingVideo} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" /> {savingVideo ? 'Saving...' : 'Save Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== CONTACT MODAL ===== */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
            <DialogDescription className="sr-only">Form to edit public contact email and WhatsApp number</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">WhatsApp Number</label>
              <Input value={contactWhatsapp} onChange={(e) => setContactWhatsapp(e.target.value)} placeholder="e.g., 9821539140" className="border-slate-700 bg-slate-800 text-white" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-2">Contact Email</label>
              <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="e.g., contact@example.com" className="border-slate-700 bg-slate-800 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactModal(false)} className="border-slate-600">Cancel</Button>
            <Button onClick={handleSaveContact} disabled={savingContact} className="bg-green-600 hover:bg-green-700">
              {savingContact ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== COUNTERS MODAL ===== */}
      <Dialog open={showCountersModal} onOpenChange={setShowCountersModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Homepage Statistics</DialogTitle>
            <DialogDescription className="sr-only">Form to edit total course count, student count, projects and satisfaction rate</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {[
              { label: 'Total Courses', value: counterCourses, setter: setCounterCourses },
              { label: 'Total Students', value: counterStudents, setter: setCounterStudents },
              { label: 'Total Projects', value: counterProjects, setter: setCounterProjects },
              { label: 'Satisfaction Rate (0-100)', value: counterSatisfaction, setter: setCounterSatisfaction },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-sm text-slate-400 block mb-2">{f.label}</label>
                <Input type="number" value={f.value} onChange={(e) => f.setter(parseInt(e.target.value) || 0)} className="border-slate-700 bg-slate-800 text-white" />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCountersModal(false)} className="border-slate-600">Cancel</Button>
            <Button onClick={handleSaveCounters} disabled={savingCounters} className="bg-green-600 hover:bg-green-700">
              {savingCounters ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== QR CODE MODAL ===== */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Set Payment QR Code URL</DialogTitle>
            <DialogDescription className="sr-only">Form to update the QR code image URL shown during checkout</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">QR Code Image URL</label>
              <Input type="text" value={qrCodeUrlInput} onChange={(e) => setQrCodeUrlInput(e.target.value)} placeholder="e.g., https://example.com/qr.jpg" className="border-slate-700 bg-slate-800 text-white" />
            </div>
            {qrCodeUrlInput && (
              <div>
                <p className="text-slate-400 text-sm mb-2">Preview:</p>
                <img src={qrCodeUrlInput} alt="Preview" className="h-32 w-32 object-contain rounded border border-slate-700" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQRModal(false)} className="border-slate-600">Cancel</Button>
            <Button onClick={handleSaveQR} disabled={savingQR} className="bg-green-600 hover:bg-green-700">
              {savingQR ? 'Saving...' : 'Save QR Code'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== HERO BANNER MODAL ===== */}
      <Dialog open={showHeroModal} onOpenChange={setShowHeroModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Hero Banner</DialogTitle>
            <DialogDescription className="sr-only">Form to edit hero banner title, subtitle and background image URL</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">Hero Title</label>
              <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="e.g., NextGen Coders — Programming Courses" className="border-slate-700 bg-slate-800 text-white" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-2">Hero Subtitle</label>
              <Textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="e.g., Master programming from basics to advanced..." className="border-slate-700 bg-slate-800 text-white h-20" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-2">Background Image URL</label>
              <Input type="text" value={heroBgImageUrl} onChange={(e) => setHeroBgImageUrl(e.target.value)} placeholder="e.g., https://example.com/banner.jpg" className="border-slate-700 bg-slate-800 text-white" />
              {heroBgImageUrl && (
                <img src={heroBgImageUrl} alt="Current BG" className="mt-2 h-20 w-full object-cover rounded" />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHeroModal(false)} className="border-slate-600">Cancel</Button>
            <Button onClick={handleSaveHero} disabled={savingHero} className="bg-green-600 hover:bg-green-700">
              {savingHero ? 'Saving...' : 'Save Hero Settings'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== SERVICES STATS MODAL ===== */}
      <Dialog open={showServicesModal} onOpenChange={setShowServicesModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Services Stats (%)</DialogTitle>
            <DialogDescription className="sr-only">Form to adjust percentage sliders for different service areas</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {[
              { label: 'Web Development (%)', value: svWebDev, setter: setSvWebDev },
              { label: 'App Development (%)', value: svAppDev, setter: setSvAppDev },
              { label: 'Digital Marketing (%)', value: svDigMarketing, setter: setSvDigMarketing },
              { label: 'SEO Services (%)', value: svSeo, setter: setSvSeo },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-sm text-slate-400 block mb-2">{f.label}</label>
                <Input type="number" min="0" max="100" value={f.value} onChange={(e) => f.setter(parseInt(e.target.value) || 0)} className="border-slate-700 bg-slate-800 text-white" />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowServicesModal(false)} className="border-slate-600">Cancel</Button>
            <Button onClick={handleSaveServices} disabled={savingServices} className="bg-green-600 hover:bg-green-700">
              {savingServices ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
