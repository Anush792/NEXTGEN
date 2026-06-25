'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, BookOpen, Eye, LogOut } from 'lucide-react';

interface Order {
  id: string;
  courseName: string;
  amount: number;
  status: string;
  studentStatus?: string;
  createdAt: any;
  adminNotes?: string;
}

export default function StudentEnrollmentsPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [studentNotes, setStudentNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        // Get current user ID from localStorage or auth context
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          // For now, show a message that user needs to log in
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/students/enrollment?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
          setEnrollments(data.enrollments || []);
        }
      } catch (error) {
        console.error('Error loading enrollments:', error);
        toast.error('Failed to load enrollments');
      } finally {
        setLoading(false);
      }
    };

    loadEnrollments();
  }, []);

  const handleAcceptEnrollment = async () => {
    if (!selectedEnrollment) return;

    try {
      setSubmitting(true);
      const userId = localStorage.getItem('userId');

      const response = await fetch('/api/students/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedEnrollment.id,
          userId,
          action: 'accept',
          notes: studentNotes
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Course enrollment accepted!');
        setShowDetailModal(false);
        setStudentNotes('');
        
        // Update the enrollment in the list
        setEnrollments(enrollments.map(e =>
          e.id === selectedEnrollment.id
            ? { ...e, studentStatus: 'accepted' }
            : e
        ));
      } else {
        toast.error(data.error || 'Failed to accept enrollment');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept enrollment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeclineEnrollment = async () => {
    if (!selectedEnrollment) return;

    try {
      setSubmitting(true);
      const userId = localStorage.getItem('userId');

      const response = await fetch('/api/students/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedEnrollment.id,
          userId,
          action: 'decline',
          notes: studentNotes
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Enrollment declined');
        setShowDetailModal(false);
        setStudentNotes('');
        
        // Update the enrollment in the list
        setEnrollments(enrollments.map(e =>
          e.id === selectedEnrollment.id
            ? { ...e, studentStatus: 'declined' }
            : e
        ));
      } else {
        toast.error(data.error || 'Failed to decline enrollment');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to decline enrollment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-600';
      case 'completed':
        return 'bg-green-900/30 text-green-400 border-green-600';
      case 'rejected':
        return 'bg-red-900/30 text-red-400 border-red-600';
      case 'accepted':
        return 'bg-green-900/30 text-green-400 border-green-600';
      case 'declined':
        return 'bg-red-900/30 text-red-400 border-red-600';
      default:
        return 'bg-slate-800 text-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPendingEnrollments = () => {
    return enrollments.filter(e => e.status === 'completed' && !e.studentStatus);
  };

  const getAcceptedEnrollments = () => {
    return enrollments.filter(e => e.studentStatus === 'accepted');
  };

  const getDeclinedEnrollments = () => {
    return enrollments.filter(e => e.studentStatus === 'declined');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading enrollments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Course Enrollments</h1>
            <p className="text-sm text-slate-400">Manage your course enrollments and acceptances</p>
          </div>
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white"
            onClick={() => router.push('/student/dashboard')}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">{getPendingEnrollments().length}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">{getAcceptedEnrollments().length}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Declined</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-400">{getDeclinedEnrollments().length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Enrollments */}
        {getPendingEnrollments().length > 0 && (
          <Card className="border-slate-800 bg-slate-900 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getPendingEnrollments().map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-blue-400" />
                      <div>
                        <p className="font-semibold text-white">{enrollment.courseName}</p>
                        <p className="text-sm text-slate-400">₹{enrollment.amount}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedEnrollment(enrollment);
                        setShowDetailModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accepted Enrollments */}
        {getAcceptedEnrollments().length > 0 && (
          <Card className="border-slate-800 bg-slate-900 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Accepted Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getAcceptedEnrollments().map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-green-600/30"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                      <div>
                        <p className="font-semibold text-white">{enrollment.courseName}</p>
                        <p className="text-sm text-slate-400">✓ Accepted • ₹{enrollment.amount}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-900/30 text-green-400 border-green-600">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Declined Enrollments */}
        {getDeclinedEnrollments().length > 0 && (
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white">Declined Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getDeclinedEnrollments().map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-red-600/30"
                  >
                    <div className="flex items-center gap-3">
                      <XCircle className="h-6 w-6 text-red-400" />
                      <div>
                        <p className="font-semibold text-white">{enrollment.courseName}</p>
                        <p className="text-sm text-slate-400">✗ Declined • ₹{enrollment.amount}</p>
                      </div>
                    </div>
                    <Badge className="bg-red-900/30 text-red-400 border-red-600">
                      Declined
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {enrollments.length === 0 && (
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="py-12">
              <p className="text-slate-400 text-center">No enrollments yet. Purchase a course to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Enrollment Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Course Enrollment Details</DialogTitle>
            <DialogDescription className="text-slate-400">
              Accept or decline this course enrollment
            </DialogDescription>
          </DialogHeader>
          {selectedEnrollment && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-lg space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">Course</p>
                  <p className="text-white font-semibold">{selectedEnrollment.courseName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Price</p>
                  <p className="text-white font-semibold">₹{selectedEnrollment.amount}</p>
                </div>
                {selectedEnrollment.adminNotes && (
                  <div>
                    <p className="text-slate-400 text-sm">Admin Notes</p>
                    <p className="text-white text-sm">{selectedEnrollment.adminNotes}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Your Response (optional)</label>
                <Textarea
                  placeholder="Add any notes or questions..."
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  className="border-slate-700 bg-slate-800 text-white"
                />
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  onClick={() => handleDeclineEnrollment()}
                  disabled={submitting}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </Button>
                <Button
                  onClick={() => handleAcceptEnrollment()}
                  disabled={submitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {submitting ? 'Processing...' : 'Accept'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
