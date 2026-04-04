'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LogOut, Check, X, Clock, Plus, Download, Edit2, Trash2, Eye, Search, Filter, Award, FileText, GraduationCap, DollarSign, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';

interface OrderSubmission {
  id: string;
  order_id: string;
  course_id?: string;
  course_name: string;
  user_id_value: string;
  user_password: string;
  user_email?: string;
  screenshot_url: string;
  status: string;
  created_at: string;
  admin_notes?: string;
  amount?: number;
  certificate_url?: string;
  graduated?: boolean;
}

interface Student {
  id: string;
  email: string;
  name?: string;
  status: string;
  created_at: string;
  certificate_url?: string | null;
  graduated?: boolean;
  courses?: string[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: string;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  approvedOrders: number;
  pendingOrders: number;
  totalStudents: number;
  totalCourses: number;
}

interface ProfitStats {
  totalProfit: number;
  monthlyProfit: number;
  dailyProfit: number;
  yearlyProfit: number;
  periodLabel: string;
}

// API functions
const fetchOrders = async (): Promise<OrderSubmission[]> => {
  const response = await fetch('/api/orders');
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

const fetchStudents = async (): Promise<Student[]> => {
  const response = await fetch('/api/students');
  if (!response.ok) throw new Error('Failed to fetch students');
  return response.json();
};

const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch('/api/courses');
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
};

const updateOrderStatus = async (id: string, status: 'approved' | 'declined', adminNotes?: string) => {
  const response = await fetch('/api/orders', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status, admin_notes: adminNotes }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error((data as any).message || 'Failed to update order status');
  }
  return response.json();
};

const approveOrder = async (id: string) => {
  return updateOrderStatus(id, 'approved');
};

const declineOrder = async (id: string) => {
  return updateOrderStatus(id, 'declined');
};

const approveStudent = async (id: string) => {
  try {
    const response = await fetch('/api/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'approve' }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to approve student');
    }
    return data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Failed to approve student');
  }
};

const declineStudent = async (id: string) => {
  try {
    const response = await fetch('/api/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'decline' }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to decline student');
    }
    return data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Failed to decline student');
  }
};

const graduateStudent = async (id: string) => {
  try {
    const response = await fetch('/api/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'graduate' }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to graduate student');
    }
    return data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Failed to graduate student');
  }
};

const removeStudent = async (id: string) => {
  try {
    const response = await fetch('/api/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'remove' }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to remove student');
    }
    return data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Failed to remove student');
  }
};

// Certificate generation function
const generateCertificate = (studentName: string, courseName: string, completionDate: string) => {
  const doc = new jsPDF();

  // Set background color
  doc.setFillColor(240, 248, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // Add border
  doc.setDrawColor(0, 123, 255);
  doc.setLineWidth(2);
  doc.rect(10, 10, 190, 277);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(0, 123, 255);
  doc.text('CERTIFICATE OF COMPLETION', 105, 40, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('This is to certify that', 105, 60, { align: 'center' });

  // Student name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(studentName, 105, 80, { align: 'center' });

  // Completion text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('has successfully completed the course', 105, 100, { align: 'center' });

  // Course name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 123, 255);
  doc.text(courseName, 105, 120, { align: 'center' });

  // Completion date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Completed on: ${completionDate}`, 105, 150, { align: 'center' });

  // Signature line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(60, 180, 150, 180);

  // Signature text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Authorized Signature', 105, 190, { align: 'center' });

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('NextGen Coders - Programming Courses Platform', 105, 270, { align: 'center' });

  // Generate filename
  const filename = `Certificate_${studentName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}.pdf`;

  // Save the PDF
  doc.save(filename);
};

const deleteCourse = async (id: string) => {
  const response = await fetch(`/api/courses?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete course');
  return response.json();
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubmission, setSelectedSubmission] = useState<OrderSubmission | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<OrderSubmission | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [videoForm, setVideoForm] = useState({
    course_name: '',
    title: '',
    youtube_url: '',
  });
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Programming',
    difficulty: 'Beginner',
    price: '',
    instructor_name: 'NextGen Team',
    duration_hours: '10',
    image_url: '',
    videoUrl: '',
  });
  const [profitPeriod, setProfitPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const router = useRouter();
  const queryClient = useQueryClient();

  // Queries
  const { data: orders = [], isLoading: ordersLoading } = useQuery<OrderSubmission[], Error>({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const { data: students = [], isLoading: studentsLoading } = useQuery<Student[], Error>({
    queryKey: ['students'],
    queryFn: fetchStudents,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[], Error>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  // Mutations
  const approveOrderMutation = useMutation({
    mutationFn: approveOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Order approved successfully');
    },
    onError: (error) => {
      toast.error('Failed to approve order');
      console.error(error);
    },
  });

  const declineOrderMutation = useMutation({
    mutationFn: declineOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Order declined successfully');
    },
    onError: (error) => {
      toast.error('Failed to decline order');
      console.error(error);
    },
  });

  const approveStudentMutation = useMutation({
    mutationFn: approveStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student approved successfully');
    },
    onError: (error) => {
      toast.error('Failed to approve student');
      console.error(error);
    },
  });

  const declineStudentMutation = useMutation({
    mutationFn: declineStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student declined successfully');
    },
    onError: (error) => {
      toast.error('Failed to decline student');
      console.error(error);
    },
  });

  const graduateMutation = useMutation({
    mutationFn: graduateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student graduated successfully');
    },
    onError: (error) => {
      toast.error('Failed to graduate student');
      console.error(error);
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove student');
      console.error(error);
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (course: {
      title: string;
      description: string;
      category: string;
      difficulty: string;
      price: number;
      instructor_name: string;
      duration_hours: number;
      image_url: string;
      videoUrl: string;
    }) => {
      try {
        const response = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(course),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Server error: ${response.status}`);
        }

        return data;
      } catch (error) {
        if (error instanceof TypeError) {
          throw new Error('Network error: Could not reach server. Please check if the server is running on port 3000 or 3001');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setShowAddCourse(false);
      setCourseForm({
        title: '',
        description: '',
        category: 'Programming',
        difficulty: 'Beginner',
        price: '',
        instructor_name: 'NextGen Team',
        duration_hours: '10',
        image_url: '',
        videoUrl: '',
      });
      toast.success('Course created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create course');
      console.error('Course creation error:', error);
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete course');
      console.error(error);
    },
  });

  // Videos queries and mutations
  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await fetch('/api/videos');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as any).error || 'Failed to fetch videos');
      }
      return response.json();
    },
    refetchInterval: 5000,
  });

  const createVideoMutation = useMutation({
    mutationFn: async (video: { course_name: string; title: string; youtube_url: string }) => {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as any).error || 'Failed to create video');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add video');
      console.error('Video creation error:', error);
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/videos?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete video');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete video');
      console.error(error);
    },
  });

  // Courses from home page (keeping for compatibility)
  const courseOptions = [
    { id: 'python', name: 'Python Programming', price: 1999 },
    { id: 'cpp', name: 'C++ Programming', price: 2499 },
    { id: 'java', name: 'Java Programming', price: 2999 },
    { id: 'react', name: 'React Development', price: 3499 },
    { id: 'htmlcss', name: 'HTML & CSS', price: 1499 },
    { id: 'fullstack', name: 'Full Stack Development', price: 4999 },
  ];

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // Auto-create a token for instant admin access in local/dev mode
      localStorage.setItem('adminToken', 'nextgen-default-token');
    }
  }, []);

  const getCoursePrice = (courseName: string): number => {
    return courseOptions.find(c => c.name === courseName)?.price || 0;
  };

  const calculateStats = (orders: OrderSubmission[]): DashboardStats => {
    // Filter out sample/default data - only count actual user submissions
    const actualOrders = orders.filter(order =>
      !order.id?.startsWith('sample_') &&
      !order.order_id?.startsWith('order_00') &&
      order.user_id_value &&
      order.user_id_value !== 'john_doe' &&
      order.user_id_value !== 'jane_smith'
    );

    const stats: DashboardStats = {
      totalOrders: actualOrders.length,
      totalRevenue: actualOrders
        .filter(o => o.status === 'approved')
        .reduce((sum, o) => sum + (getCoursePrice(o.course_name) || 0), 0),
      approvedOrders: actualOrders.filter(o => o.status === 'approved').length,
      pendingOrders: actualOrders.filter(o => o.status === 'pending').length,
      totalStudents: new Set(actualOrders.map(o => o.user_id_value)).size,
      totalCourses: courses.length || courseOptions.length,
    };
    return stats;
  };

  const calculateProfitStats = (orders: OrderSubmission[], period: 'daily' | 'monthly' | 'yearly'): ProfitStats => {
    // Filter out sample/default data - only count actual user submissions
    const actualOrders = orders.filter(order =>
      !order.id?.startsWith('sample_') &&
      !order.order_id?.startsWith('order_00') &&
      order.user_id_value &&
      order.user_id_value !== 'john_doe' &&
      order.user_id_value !== 'jane_smith'
    );

    const now = new Date();
    const approvedOrders = actualOrders.filter(o => o.status === 'approved');

    let filteredOrders: OrderSubmission[] = [];
    let periodLabel = '';

    switch (period) {
      case 'daily':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filteredOrders = approvedOrders.filter(o => new Date(o.created_at) >= today);
        periodLabel = 'Today';
        break;
      case 'monthly':
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filteredOrders = approvedOrders.filter(o => new Date(o.created_at) >= thisMonth);
        periodLabel = 'This Month';
        break;
      case 'yearly':
        const thisYear = new Date(now.getFullYear(), 0, 1);
        filteredOrders = approvedOrders.filter(o => new Date(o.created_at) >= thisYear);
        periodLabel = 'This Year';
        break;
    }

    const periodProfit = filteredOrders.reduce((sum, o) => sum + (getCoursePrice(o.course_name) || 0), 0);
    const totalProfit = approvedOrders.reduce((sum, o) => sum + (getCoursePrice(o.course_name) || 0), 0);

    // Calculate monthly profit (current month)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyOrders = approvedOrders.filter(o => new Date(o.created_at) >= thisMonth);
    const monthlyProfit = monthlyOrders.reduce((sum, o) => sum + (getCoursePrice(o.course_name) || 0), 0);

    // Calculate daily profit (today)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dailyOrders = approvedOrders.filter(o => new Date(o.created_at) >= today);
    const dailyProfit = dailyOrders.reduce((sum, o) => sum + (getCoursePrice(o.course_name) || 0), 0);

    return {
      totalProfit,
      monthlyProfit,
      dailyProfit,
      yearlyProfit: period === 'yearly' ? periodProfit : totalProfit,
      periodLabel,
    };
  };

  const stats = calculateStats(orders);

  const handleApprove = async (submissionId: string) => {
    const submission = orders.find(s => s.id === submissionId);
    if (submission) {
      // Use the order submission id to update the correct row
      approveOrderMutation.mutate(submission.id);
      setSelectedSubmission(null);
      setShowSubmissionModal(false);
      setAdminNotes('');
    }
  };

  const handleDecline = async (submissionId: string) => {
    const submission = orders.find(s => s.id === submissionId);
    if (submission) {
      // Use the order submission id to update the correct row
      declineOrderMutation.mutate(submission.id);
      setSelectedSubmission(null);
      setShowSubmissionModal(false);
      setAdminNotes('');
    }
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!courseForm.title?.trim()) {
      toast.error('Course title is required');
      return;
    }
    if (!courseForm.description?.trim()) {
      toast.error('Course description is required');
      return;
    }
    if (!courseForm.price || courseForm.price === '' || isNaN(parseFloat(courseForm.price))) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!courseForm.instructor_name?.trim()) {
      toast.error('Instructor name is required');
      return;
    }
    if (!courseForm.image_url?.trim()) {
      toast.error('Course image URL is required');
      return;
    }
    if (courseForm.duration_hours === '' || isNaN(parseInt(courseForm.duration_hours))) {
      toast.error('Please enter valid duration');
      return;
    }

    // All validations passed, create the course
    const price = parseFloat(courseForm.price);
    const duration = parseInt(courseForm.duration_hours);

    if (isNaN(price) || price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (isNaN(duration) || duration <= 0) {
      toast.error('Duration must be greater than 0');
      return;
    }

    createCourseMutation.mutate({
      title: courseForm.title.trim(),
      description: courseForm.description.trim(),
      category: courseForm.category,
      difficulty: courseForm.difficulty,
      price: price,
      instructor_name: courseForm.instructor_name.trim(),
      duration_hours: duration,
      image_url: courseForm.image_url.trim(),
      videoUrl: courseForm.videoUrl.trim(),
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      deleteCourseMutation.mutate(courseId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const getFilteredSubmissions = () => {
    return orders.filter(sub => {
      const matchesSearch = sub.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.user_id_value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.user_email && sub.user_email.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = !filterStatus || sub.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-600';
      case 'approved':
        return 'bg-green-900/30 text-green-400 border-green-600';
      case 'declined':
        return 'bg-red-900/30 text-red-400 border-red-600';
      case 'graduated':
        return 'bg-blue-900/30 text-blue-400 border-blue-600';
      case 'removed':
        return 'bg-rose-900/30 text-rose-400 border-rose-600';
      default:
        return 'bg-slate-800 text-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <Check className="h-4 w-4" />;
      case 'declined':
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const pendingSubmissions = orders.filter(s => s.status === 'pending');
  const approvedSubmissions = orders.filter(s => s.status === 'approved');
  const declinedSubmissions = orders.filter(s => s.status === 'declined');
  const filteredOrders = getFilteredSubmissions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Manage orders, students, and courses</p>
          </div>
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

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
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
              <CardTitle className="text-sm font-medium text-slate-400">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-400">{stats.approvedOrders}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Pending</CardTitle>
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
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-cyan-400">{stats.totalCourses}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-slate-300 data-[state=active]:text-white">
              Orders
            </TabsTrigger>
            <TabsTrigger value="students" className="text-slate-300 data-[state=active]:text-white">
              Students
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-slate-300 data-[state=active]:text-white">
              Courses
            </TabsTrigger>
            <TabsTrigger value="videos" className="text-slate-300 data-[state=active]:text-white">
              Videos
            </TabsTrigger>
            <TabsTrigger value="balance" className="text-slate-300 data-[state=active]:text-white">
              Balance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {orders.slice(0, 5).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{sub.course_name}</p>
                        <p className="text-xs text-slate-400 truncate">ID: {sub.user_id_value.substring(0, 15)}...</p>
                      </div>
                      <Badge className={`${getStatusColor(sub.status)} border`}>
                        {getStatusIcon(sub.status)}
                        <span className="ml-1 capitalize">{sub.status}</span>
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 mt-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <CardTitle className="text-white">Orders Management</CardTitle>
                  <div className="flex gap-2 w-full md:w-auto">
                    <div className="flex-1 md:flex-initial relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-slate-700 rounded bg-slate-800 text-white text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-800/50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Student</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Course</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersLoading ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-400">
                            Loading orders...
                          </td>
                        </tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-400">
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 text-sm text-slate-300 font-mono">{order.order_id.substring(0, 8)}</td>
                            <td className="px-4 py-3 text-sm">
                              <div className="text-slate-200">{order.user_id_value.substring(0, 12)}</div>
                              <div className="text-xs text-slate-400">{order.user_email}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-300">{order.course_name}</td>
                            <td className="px-4 py-3 text-sm text-slate-300 font-semibold">
                              ₹{getCoursePrice(order.course_name)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Badge className={`${getStatusColor(order.status)} border`}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1 capitalize">{order.status}</span>
                                </Badge>
                                {order.graduated && (
                                  <Badge className="bg-green-900/30 text-green-400 border-green-600">
                                    <GraduationCap className="h-3 w-3 mr-1" />
                                    Graduated
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-400">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex gap-2 items-center">
                                {order.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => approveOrderMutation.mutate(order.id)}
                                      disabled={approveOrderMutation.isPending}
                                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => declineOrderMutation.mutate(order.id)}
                                      disabled={declineOrderMutation.isPending}
                                      className="bg-red-600 text-white hover:bg-red-700"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {order.status === 'graduated' && (
                                  <Button
                                    size="sm"
                                    onClick={() => window.open(`/api/certificate?studentId=${order.user_id_value}&courseName=${encodeURIComponent(order.course_name)}`, '_blank')}
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedSubmission(order);
                                    setAdminNotes(order.admin_notes || '');
                                    setShowSubmissionModal(true);
                                  }}
                                  className="text-blue-400 hover:bg-blue-900/30"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4 mt-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Students ({students.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-800/50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Student ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Joined</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsLoading ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-400">
                            Loading students...
                          </td>
                        </tr>
                      ) : students.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-400">
                            No students found
                          </td>
                        </tr>
                      ) : (
                        students.map((student) => {
                          const studentOrders = orders.filter(o => o.user_id_value === student.id);
                          return (
                            <tr key={student.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                              <td className="px-4 py-3 text-sm text-slate-300 font-mono">{student.id.substring(0, 12)}</td>
                              <td className="px-4 py-3 text-sm text-slate-300">{student.email}</td>
                              <td className="px-4 py-3 text-sm">
                                <Badge className={`${getStatusColor(student.status)} border`}>
                                  <span className="capitalize">{student.status}</span>
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-400">
                                {new Date(student.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex flex-wrap gap-2">
                                  {student.status === 'pending' && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => approveStudentMutation.mutate(student.id)}
                                        disabled={approveStudentMutation.isPending}
                                        className="text-green-400 hover:bg-green-900/30"
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => declineStudentMutation.mutate(student.id)}
                                        disabled={declineStudentMutation.isPending}
                                        className="text-red-400 hover:bg-red-900/30"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}

                                  {student.status === 'approved' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => graduateMutation.mutate(student.id)}
                                      disabled={graduateMutation.isPending}
                                      className="text-cyan-400 hover:bg-cyan-900/30"
                                    >
                                      Grad
                                    </Button>
                                  )}

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMutation.mutate(student.id)}
                                    disabled={removeMutation.isPending}
                                    className="text-orange-400 hover:bg-orange-900/30"
                                  >
                                    Remove
                                  </Button>

                                  {student.certificate_url && (
                                    <a
                                      href={student.certificate_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs text-blue-300 underline hover:text-blue-200"
                                    >
                                      Download Cert
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Per-Student Orders Grid */}
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Student Orders Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => {
                    const studentOrders = orders.filter(o => o.user_id_value === student.id);
                    if (studentOrders.length === 0) return null;

                    return (
                      <div key={`orders-${student.id}`} className="border border-slate-700 rounded-lg p-4 bg-slate-800/50">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-white">
                            {student.email} ({studentOrders.length} orders)
                          </h3>
                          {student.graduated && (
                            <Badge className="bg-green-900/30 text-green-400 border-green-600">
                              <GraduationCap className="h-4 w-4 mr-1" />
                              Graduated
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {studentOrders.map((order) => (
                            <div key={order.id} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-200">{order.course_name}</span>
                                <Badge className={`${getStatusColor(order.status)} border text-xs`}>
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-slate-400 space-y-1">
                                <div>Order: {order.order_id.substring(0, 8)}</div>
                                <div>Amount: ₹{getCoursePrice(order.course_name)}</div>
                                <div>Date: {new Date(order.created_at).toLocaleDateString()}</div>
                              </div>
                              {order.status === 'graduated' && (
                                <Button
                                  size="sm"
                                  onClick={() => window.open(`/api/certificate?studentId=${student.id}&courseName=${encodeURIComponent(order.course_name)}`, '_blank')}
                                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download Certificate
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4 mt-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Courses Management</CardTitle>
                  <Button
                    onClick={() => setShowAddCourse(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddCourse && (
                  <Card className="border-slate-700 bg-slate-800 mb-4">
                    <CardHeader>
                      <CardTitle className="text-white">Add New Course</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddCourse} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-white block mb-2">Course Title *</label>
                          <Input
                            type="text"
                            value={courseForm.title}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter course title"
                            className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white block mb-2">Description *</label>
                          <textarea
                            value={courseForm.description}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter course description"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder:text-slate-400"
                            rows={3}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-white block mb-2">Category</label>
                            <select
                              value={courseForm.category}
                              onChange={(e) => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full p-2 border border-slate-600 rounded bg-slate-700 text-white"
                            >
                              <option value="Programming">Programming</option>
                              <option value="Web Development">Web Development</option>
                              <option value="Mobile Development">Mobile Development</option>
                              <option value="Data Science">Data Science</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-white block mb-2">Difficulty</label>
                            <select
                              value={courseForm.difficulty}
                              onChange={(e) => setCourseForm(prev => ({ ...prev, difficulty: e.target.value }))}
                              className="w-full p-2 border border-slate-600 rounded bg-slate-700 text-white"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white block mb-2">Instructor Name</label>
                          <Input
                            type="text"
                            value={courseForm.instructor_name}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, instructor_name: e.target.value }))}
                            placeholder="Enter instructor name"
                            className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-white block mb-2">Duration (hours)</label>
                            <Input
                              type="number"
                              value={courseForm.duration_hours}
                              onChange={(e) => setCourseForm(prev => ({ ...prev, duration_hours: e.target.value }))}
                              placeholder="10"
                              className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-white block mb-2">Price (₹) *</label>
                            <Input
                              type="number"
                              value={courseForm.price}
                              onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                              placeholder="Enter price"
                              className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white block mb-2">Course Image URL *</label>
                          <Input
                            type="url"
                            value={courseForm.image_url}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, image_url: e.target.value }))}
                            placeholder="https://example.com/image.jpg"
                            className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                            required
                          />
                          <p className="text-xs text-slate-400 mt-1">Tip: Use image hosting services like Unsplash, Pexels, or Imgur</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white block mb-2">Intro Video URL (Optional)</label>
                          <Input
                            type="url"
                            value={courseForm.videoUrl}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="https://youtube.com/watch?v=..."
                            className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            disabled={createCourseMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {createCourseMutation.isPending ? 'Creating...' : 'Create Course'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowAddCourse(false)}
                            className="text-slate-400 hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {coursesLoading ? (
                    <p className="text-slate-400 text-center py-8">Loading courses...</p>
                  ) : courses.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No courses added yet.</p>
                  ) : (
                    courses.map((course: any) => (
                      <div key={course.id} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                        <div className="flex-shrink-0">
                          {course.image_url ? (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-slate-700">
                              <Image
                                src={course.image_url}
                                alt={course.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-32 h-32 rounded-lg bg-slate-700 flex items-center justify-center text-slate-500">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-white text-lg">{course.title}</p>
                          <p className="text-sm text-slate-300 mt-1">{course.description}</p>
                          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                            <div>
                              <span className="text-slate-400">Price:</span> <span className="text-white font-semibold">₹{course.price}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Duration:</span> <span className="text-white font-semibold">{course.duration_hours}h</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Category:</span> <span className="text-white font-semibold">{course.category}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Level:</span> <span className="text-white font-semibold">{course.difficulty}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mt-2">
                            Instructor: {course.instructor_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Created: {new Date(course.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 self-start md:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                            disabled={deleteCourseMutation.isPending}
                            className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4 mt-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Course Videos</CardTitle>
                  <Button
                    onClick={() => setShowAddVideo(prev => !prev)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddVideo && (
                  <Card className="border-slate-700 bg-slate-800 mb-4">
                    <CardHeader>
                      <CardTitle className="text-white">Add New Video</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const course = videoForm.course_name.trim();
                          const title = videoForm.title.trim();
                          const url = videoForm.youtube_url.trim();
                          
                          if (!course || !title || !url) {
                            toast.error('Please fill in all fields');
                            return;
                          }
                          
                          if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
                            toast.error('Please enter a valid YouTube URL');
                            return;
                          }
                          
                          createVideoMutation.mutate({
                            course_name: course,
                            title: title,
                            youtube_url: url,
                          });
                          setVideoForm({ course_name: '', title: '', youtube_url: '' });
                          setShowAddVideo(false);
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="text-sm font-medium text-white block mb-2">Course</label>
                          <select
                            value={videoForm.course_name}
                            onChange={(e) => setVideoForm({ ...videoForm, course_name: e.target.value })}
                            className="w-full p-2 border border-slate-600 rounded bg-slate-700 text-white"
                            required
                          >
                            <option value="">Select Course</option>
                            {coursesLoading ? (
                              <option disabled>Loading courses...</option>
                            ) : courses.length === 0 ? (
                              <option disabled>No courses available. Create a course first.</option>
                            ) : (
                              courses.map((course: any) => (
                                <option key={course.id} value={course.title}>
                                  {course.title}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white block mb-2">Video Title</label>
                          <Input
                            type="text"
                            value={videoForm.title}
                            onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter video title"
                            className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white block mb-2">YouTube URL</label>
                          <Input
                            type="url"
                            value={videoForm.youtube_url}
                            onChange={(e) => setVideoForm(prev => ({ ...prev, youtube_url: e.target.value }))}
                            placeholder="https://youtube.com/watch?v=..."
                            className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            disabled={createVideoMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {createVideoMutation.isPending ? 'Adding...' : 'Add Video'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowAddVideo(false)}
                            className="text-slate-400 hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  {videosLoading ? (
                    <p className="text-slate-400 text-center py-8">Loading videos...</p>
                  ) : videos.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No videos added yet.</p>
                  ) : (
                    videos.map((video: any) => (
                      <div key={video.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                        <div>
                          <p className="font-semibold text-white">{video.title}</p>
                          <p className="text-sm text-slate-400">Course: {video.course_name}</p>
                          <p className="text-xs text-slate-500">
                            Added: {new Date(video.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(video.youtube_url, '_blank')}
                            className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                          >
                            Watch
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteVideoMutation.mutate(video.id)}
                            disabled={deleteVideoMutation.isPending}
                            className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Balance Tab */}
          <TabsContent value="balance" className="space-y-4 mt-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Profit & Balance Management</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={profitPeriod === 'daily' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setProfitPeriod('daily')}
                      className={profitPeriod === 'daily' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-600 text-slate-300 hover:bg-slate-800'}
                    >
                      Daily
                    </Button>
                    <Button
                      variant={profitPeriod === 'monthly' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setProfitPeriod('monthly')}
                      className={profitPeriod === 'monthly' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-600 text-slate-300 hover:bg-slate-800'}
                    >
                      Monthly
                    </Button>
                    <Button
                      variant={profitPeriod === 'yearly' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setProfitPeriod('yearly')}
                      className={profitPeriod === 'yearly' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-600 text-slate-300 hover:bg-slate-800'}
                    >
                      Yearly
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const profitStats = calculateProfitStats(orders, profitPeriod);
                  return (
                    <>
                      {/* Main Profit Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-slate-700 bg-slate-800">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Total Profit</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold text-green-400">₹{profitStats.totalProfit.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">All time earnings</p>
                          </CardContent>
                        </Card>

                        <Card className="border-slate-700 bg-slate-800">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Monthly Profit</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold text-blue-400">₹{profitStats.monthlyProfit.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">Current month</p>
                          </CardContent>
                        </Card>

                        <Card className="border-slate-700 bg-slate-800">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Daily Profit</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold text-yellow-400">₹{profitStats.dailyProfit.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">Today</p>
                          </CardContent>
                        </Card>

                        <Card className="border-slate-700 bg-slate-800">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Selected Period</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold text-purple-400">
                              ₹{profitPeriod === 'daily' ? profitStats.dailyProfit.toLocaleString() :
                                 profitPeriod === 'monthly' ? profitStats.monthlyProfit.toLocaleString() :
                                 profitStats.yearlyProfit.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{profitStats.periodLabel}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Profit Breakdown */}
                      <Card className="border-slate-700 bg-slate-800">
                        <CardHeader>
                          <CardTitle className="text-white">Profit Breakdown by Course</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {(() => {
                              const approvedOrders = orders.filter(o => o.status === 'approved');
                              const courseProfits = new Map<string, { count: number; revenue: number }>();

                              approvedOrders.forEach(order => {
                                const courseName = order.course_name;
                                const price = getCoursePrice(courseName);
                                const existing = courseProfits.get(courseName) || { count: 0, revenue: 0 };
                                courseProfits.set(courseName, {
                                  count: existing.count + 1,
                                  revenue: existing.revenue + price
                                });
                              });

                              return Array.from(courseProfits.entries())
                                .sort(([, a], [, b]) => b.revenue - a.revenue)
                                .map(([courseName, data]) => (
                                  <div key={courseName} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                                    <div>
                                      <p className="font-medium text-white">{courseName}</p>
                                      <p className="text-sm text-slate-400">{data.count} enrollments</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold text-green-400">₹{data.revenue.toLocaleString()}</p>
                                      <p className="text-xs text-slate-500">₹{(data.revenue / data.count).toFixed(0)} avg</p>
                                    </div>
                                  </div>
                                ));
                            })()}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Recent Transactions */}
                      <Card className="border-slate-700 bg-slate-800">
                        <CardHeader>
                          <CardTitle className="text-white">Recent Approved Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {orders
                              .filter(o => o.status === 'approved')
                              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                              .slice(0, 10)
                              .map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white truncate">{order.course_name}</p>
                                    <p className="text-sm text-slate-400 truncate">{order.user_id_value}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-green-400">₹{getCoursePrice(order.course_name)}</p>
                                    <p className="text-xs text-slate-500">
                                      {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Submission Modal */}
      <Dialog open={showSubmissionModal} onOpenChange={setShowSubmissionModal}>
        <DialogContent className="max-w-2xl border-slate-700 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Review and manage order submission</DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Order ID</p>
                  <p className="font-mono text-white">{selectedSubmission.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <Badge className={`${getStatusColor(selectedSubmission.status)} border mt-1`}>
                    {getStatusIcon(selectedSubmission.status)}
                    <span className="ml-1 capitalize">{selectedSubmission.status}</span>
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Student ID</p>
                  <p className="text-white">{selectedSubmission.user_id_value}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-white">{selectedSubmission.user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Course</p>
                  <p className="text-white">{selectedSubmission.course_name}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-400">Course ID</p>
                    <p className="text-white">{selectedSubmission.course_id ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Amount</p>
                    <p className="text-white font-semibold">₹{getCoursePrice(selectedSubmission.course_name)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">User Password</p>
                    <p className="font-mono text-white bg-slate-800 p-1 rounded">{selectedSubmission.user_password}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2">Payment Screenshot</p>
                  {selectedSubmission.screenshot_url ? (
                    <div className="border border-slate-700 rounded-lg overflow-hidden">
                      <img
                        src={selectedSubmission.screenshot_url}
                        alt="Payment Screenshot"
                        className="w-full h-auto max-h-64 object-contain bg-slate-800"
                      />
                    </div>
                  ) : (
                    <p className="text-slate-500">No screenshot available</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2">Admin Notes</p>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this order..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder:text-slate-500"
                    rows={3}
                  />
                </div>

                <div>
                  {selectedSubmission.certificate_url ? (
                    <a
                      href={selectedSubmission.certificate_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-300 underline hover:text-blue-200"
                    >
                      View issued certificate
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">No certificate issued yet</span>
                  )}
                </div>

              <DialogFooter className="gap-2">
                {selectedSubmission.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleApprove(selectedSubmission.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleDecline(selectedSubmission.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  onClick={() => setShowSubmissionModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Submission Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md border-slate-700 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Modify order details</DialogDescription>
          </DialogHeader>
          <p className="text-slate-400 text-center py-4">Order editing is currently disabled via API.</p>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowEditModal(false)}
              className="text-slate-400 hover:text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-sm border-slate-700 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Order</DialogTitle>
            <DialogDescription>Are you sure you want to delete this order? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.info('Order deletion is currently managed separately');
                setShowDeleteModal(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
