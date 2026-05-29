'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
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
  LogOut, Check, X, Clock, Plus, Download, Edit2, Trash2, Eye, Search, Filter,
  Award, FileText, GraduationCap, DollarSign, TrendingUp, Settings, Phone, QrCode,
  Users, BookOpen, Video, ImageIcon, Upload, CheckCircle, XCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';
import {
  onOrdersSnapshot,
  onUsersSnapshot,
  onCoursesSnapshot,
  onAdminSettingsSnapshot,
  approveOrder,
  rejectOrder,
  deleteOrder,
  updateAdminSettings,
  initializeAdminSettings,
  createCourse,
  deleteCourse,
  type Order,
  type AdminSettings,
  type Course
} from '@/lib/firebase-db';
import { storage, ref, uploadBytes, getDownloadURL } from '@/lib/firebase';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  approvedOrders: number;
  pendingOrders: number;
  rejectedOrders: number;
  totalStudents: number;
  totalCourses: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, signOut, checkAdmin } = useAuth();

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);

  // UI states
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [showContextModal, setShowContextModal] = useState(false);
  const [contextPreview, setContextPreview] = useState('');

  // Form states
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [coursesCount, setCoursesCount] = useState(6);
  const [studentsCount, setStudentsCount] = useState(500);
  const [projectsCount, setProjectsCount] = useState(100);
  const [satisfactionRate, setSatisfactionRate] = useState(98);
  const [qrFile, setQrFile] = useState<File | null>(null);

  // Auth check
  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user) {
        router.push('/signin');
        return;
      }
      const adminStatus = await checkAdmin();
      if (!adminStatus) {
        toast.error('Access denied. Admin privileges required.');
        router.push('/');
        return;
      }
      setLoading(false);
    };
    verifyAdmin();
  }, [user, router, checkAdmin]);

  // Initialize settings
  useEffect(() => {
    initializeAdminSettings();
  }, []);

  // Real-time listeners
  useEffect(() => {
    if (!user || !isAdmin) return;

    const unsubscribeOrders = onOrdersSnapshot((newOrders) => {
      setOrders(newOrders);
    });

    const unsubscribeUsers = onUsersSnapshot((newUsers) => {
      setUsers(newUsers);
    });

    const unsubscribeCourses = onCoursesSnapshot((newCourses) => {
      setCourses(newCourses);
    });

    const unsubscribeSettings = onAdminSettingsSnapshot((newSettings) => {
      setSettings(newSettings);
      if (newSettings) {
        setWhatsappNumber(newSettings.whatsappNumber || '');
        setContactEmail(newSettings.contactEmail || '');
        setCoursesCount(newSettings.homepageCounters?.courses || 6);
        setStudentsCount(newSettings.homepageCounters?.students || 500);
        setProjectsCount(newSettings.homepageCounters?.projects || 100);
        setSatisfactionRate(newSettings.homepageCounters?.satisfaction || 98);
      }
    });

    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
      unsubscribeCourses();
      unsubscribeSettings();
    };
  }, [user, isAdmin]);

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

  // Handle logout
  const handleLogout = async () => {
    await signOut();
  };

  // Handle order approval
  const handleApproveOrder = async (orderId: string) => {
    try {
      await approveOrder(orderId, adminNotes);
      toast.success('Order approved successfully');
      setShowOrderModal(false);
      setAdminNotes('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve order');
    }
  };

  // Handle order rejection
  const handleRejectOrder = async (orderId: string) => {
    try {
      await rejectOrder(orderId, adminNotes);
      toast.success('Order rejected');
      setShowOrderModal(false);
      setAdminNotes('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject order');
    }
  };

  // Handle settings save
  const handleSaveSettings = async () => {
    try {
      let qrCodeUrl = settings?.qrCodeUrl;

      // Upload QR code if file selected
      if (qrFile) {
        const storageRef = ref(storage, `qr-codes/${Date.now()}_${qrFile.name}`);
        await uploadBytes(storageRef, qrFile);
        qrCodeUrl = await getDownloadURL(storageRef);
      }

      await updateAdminSettings({
        whatsappNumber,
        contactEmail,
        homepageCounters: {
          courses: coursesCount,
          students: studentsCount,
          projects: projectsCount,
          satisfaction: satisfactionRate
        },
        qrCodeUrl
      });

      toast.success('Settings saved successfully');
      setShowSettingsModal(false);
      setQrFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Status colors
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Manage orders, users, and website settings</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettingsModal(true)}
              className="text-slate-300 border-slate-600 hover:bg-slate-800"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                setShowContextModal(true);
                try {
                  const res = await fetch('/api/nextgen/context');
                  const data = await res.json();
                  setContextPreview(data?.context || 'No context available');
                } catch (e) {
                  setContextPreview('Failed to load site context');
                }
              }}
              className="text-slate-300 border-slate-600 hover:bg-slate-800"
            >
              <FileText className="h-4 w-4 mr-2" />
              Preview Model Context
            </Button>
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-400">{stats.totalOrders}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">₹{stats.totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">{stats.pendingOrders}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-400">{stats.totalStudents}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="text-slate-300 data-[state=active]:text-white">Orders</TabsTrigger>
            <TabsTrigger value="users" className="text-slate-300 data-[state=active]:text-white">Users</TabsTrigger>
            <TabsTrigger value="courses" className="text-slate-300 data-[state=active]:text-white">Courses</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">{order.courseName}</p>
                          <p className="text-xs text-slate-400 truncate">{order.userEmail}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} border`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-slate-400 text-center py-4">No orders yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Website Settings Preview */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">Website Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-blue-400" />
                        <span className="text-slate-300">WhatsApp Number</span>
                      </div>
                      <span className="text-white font-medium">{settings?.whatsappNumber || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-green-400" />
                        <span className="text-slate-300">Total Courses</span>
                      </div>
                      <span className="text-white font-medium">{settings?.homepageCounters?.courses || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-slate-300">Total Students</span>
                      </div>
                      <span className="text-white font-medium">{settings?.homepageCounters?.students || 0}</span>
                    </div>
                    {settings?.qrCodeUrl && (
                      <div className="p-3 bg-slate-800 rounded-lg">
                        <p className="text-slate-300 mb-2">QR Code</p>
                        <img src={settings.qrCodeUrl} alt="QR Code" className="h-20 w-20 object-contain" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="text-white">All Orders</CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 border-slate-700 bg-slate-800 text-white"
                    />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border-slate-700 bg-slate-800 text-white rounded-md px-3"
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
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white">{order.courseName}</p>
                        <p className="text-sm text-slate-400">{order.userEmail}</p>
                        <p className="text-xs text-slate-500">₹{order.amount} • {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(order.status)} border`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && (
                    <p className="text-slate-400 text-center py-8">No orders found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-4">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="h-10 w-10 rounded-full" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {user.displayName?.[0] || user.email?.[0] || '?'}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-white">{user.displayName || 'Unknown'}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                          <p className="text-xs text-slate-500 capitalize">{user.provider || 'email'} • {user.role}</p>
                        </div>
                      </div>
                      <Badge className={user.role === 'admin' ? 'bg-red-900/30 text-red-400 border-red-600' : 'bg-blue-900/30 text-blue-400 border-blue-600'}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-slate-400 text-center py-8">No users yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="mt-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Courses</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-4">
                        {course.imageUrl ? (
                          <img src={course.imageUrl} alt={course.title} className="h-12 w-12 rounded object-cover" />
                        ) : (
                          <div className="h-12 w-12 rounded bg-slate-700 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-white">{course.title}</p>
                          <p className="text-sm text-slate-400">₹{course.price} • {course.category}</p>
                          <p className="text-xs text-slate-500">{course.durationHours} hours • {course.difficulty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <p className="text-slate-400 text-center py-8">No courses yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription className="text-slate-400">
              Review and manage this order
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-lg space-y-2">
                <p><span className="text-slate-400">Course:</span> <span className="text-white">{selectedOrder.courseName}</span></p>
                <p><span className="text-slate-400">User:</span> <span className="text-white">{selectedOrder.userEmail}</span></p>
                <p><span className="text-slate-400">Amount:</span> <span className="text-white">₹{selectedOrder.amount}</span></p>
                <p><span className="text-slate-400">Status:</span> <Badge className={`${getStatusColor(selectedOrder.status)} border ml-2`}>{selectedOrder.status}</Badge></p>
                {selectedOrder.screenshotUrl && (
                  <div className="mt-4">
                    <p className="text-slate-400 mb-2">Payment Proof:</p>
                    <img src={selectedOrder.screenshotUrl} alt="Payment Proof" className="max-h-40 rounded border border-slate-700" />
                  </div>
                )}
              </div>

              <Textarea
                placeholder="Add admin notes (optional)..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="border-slate-700 bg-slate-800 text-white"
              />

              {selectedOrder.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApproveOrder(selectedOrder.id!)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleRejectOrder(selectedOrder.id!)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Website Settings</DialogTitle>
            <DialogDescription className="text-slate-400">
              Manage website content and configuration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Contact Settings */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
              <div>
                <label className="text-sm text-slate-400 block mb-1">WhatsApp Number</label>
                <Input
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="9821539140"
                  className="border-slate-700 bg-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Contact Email</label>
                <Input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@nextgencoders.com"
                  className="border-slate-700 bg-slate-800 text-white"
                />
              </div>
            </div>

            {/* Homepage Counters */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Homepage Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Courses</label>
                  <Input
                    type="number"
                    value={coursesCount}
                    onChange={(e) => setCoursesCount(parseInt(e.target.value) || 0)}
                    className="border-slate-700 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Students</label>
                  <Input
                    type="number"
                    value={studentsCount}
                    onChange={(e) => setStudentsCount(parseInt(e.target.value) || 0)}
                    className="border-slate-700 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Projects</label>
                  <Input
                    type="number"
                    value={projectsCount}
                    onChange={(e) => setProjectsCount(parseInt(e.target.value) || 0)}
                    className="border-slate-700 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Satisfaction %</label>
                  <Input
                    type="number"
                    value={satisfactionRate}
                    onChange={(e) => setSatisfactionRate(parseInt(e.target.value) || 0)}
                    className="border-slate-700 bg-slate-800 text-white"
                  />
                </div>
              </div>
            </div>

            {/* QR Code Upload */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Payment QR Code</h3>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setQrFile(e.target.files?.[0] || null)}
                  className="border-slate-700 bg-slate-800 text-white file:bg-blue-600 file:text-white file:border-0"
                />
              </div>
              {settings?.qrCodeUrl && !qrFile && (
                <div className="p-2 bg-slate-800 rounded">
                  <p className="text-sm text-slate-400 mb-2">Current QR Code:</p>
                  <img src={settings.qrCodeUrl} alt="Current QR" className="h-24 w-24 object-contain" />
                </div>
              )}
            </div>

            <Button
              onClick={handleSaveSettings}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Context Preview Modal */}
      <Dialog open={showContextModal} onOpenChange={setShowContextModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Model Context Preview</DialogTitle>
            <DialogDescription className="text-slate-400">This shows the snippets sent to the model (truncated).</DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-slate-800 rounded">
            <pre className="whitespace-pre-wrap text-sm text-slate-200">{contextPreview || 'No context loaded'}</pre>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowContextModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
