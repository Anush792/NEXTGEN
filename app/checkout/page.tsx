'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CircleAlert as AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { onAdminSettingsSnapshot, createOrder, type AdminSettings } from '@/lib/firebase-db';
// Firebase storage import removed

interface Course {
  id: string;
  title: string;
  price: number;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');
  const courseName = searchParams.get('courseName');
  const coursePrice = searchParams.get('price');

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<AdminSettings | null>(null);

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    email: '',
    screenshotUrl: '',
  });

  useEffect(() => {
    // Subscribe to real-time settings for QR Code
    const unsubscribeSettings = onAdminSettingsSnapshot((newSettings) => {
      setSettings(newSettings);
    });

    return () => {
      unsubscribeSettings();
    };
  }, []);

  useEffect(() => {
    if (!courseId || !courseName) {
      router.push('/courses');
      return;
    }

    const signedInEmail = localStorage.getItem('studentEmail');
    const signedInPassword = localStorage.getItem('studentPassword');
    if (!signedInEmail) {
      router.push('/signin');
      return;
    }

    setCourse({
      id: courseId,
      title: courseName,
      price: parseFloat(coursePrice || '0'),
    });

    setFormData(prev => ({
      ...prev,
      userId: signedInEmail,
      password: signedInPassword || prev.password,
      email: signedInEmail,
    }));
  }, [courseId, courseName, coursePrice, router]);

  // File change handler removed since we are no longer uploading screenshots

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.userId || !formData.password || !formData.email || !formData.screenshotUrl) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // 2. Submit order to Firestore
      const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      await createOrder({
        orderId,
        courseId: course?.id || '',
        courseName: course?.title || '',
        userId: formData.userId,
        userEmail: formData.email,
        userPassword: formData.password,
        screenshotUrl: formData.screenshotUrl,
        status: 'pending',
        amount: course?.price || 0,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/courses');
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Order submission error:', err);
      setError(`An error occurred: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-slate-400">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {success ? (
            <Card className="border-green-800 bg-green-900/30">
              <CardContent className="pt-6 text-center">
                <div className="text-green-400 text-5xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-white mb-2">Order Submitted Successfully!</h2>
                <p className="text-slate-300 mb-4">
                  Your order has been submitted for verification. The admin will review your submission and approve or decline it.
                </p>
                <p className="text-sm text-slate-400">Redirecting to courses page...</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Complete Your Purchase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Course</p>
                    <p className="text-lg font-semibold text-white mt-1">{course.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Total Price</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">Rs {course.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* QR Code section */}
                {settings?.qrCodeUrl && (
                  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg text-center space-y-4">
                    <p className="text-sm font-semibold text-slate-200">Scan QR Code to Pay</p>
                    <div className="inline-block bg-white p-3 rounded-2xl shadow-inner">
                      <img
                        src={settings.qrCodeUrl}
                        alt="Payment QR Code"
                        className="h-44 w-44 object-contain mx-auto"
                      />
                    </div>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Scan this QR code using any payment app (e.g. eSewa, Khalti, Fonepay, Mobile Banking) to pay Rs {course.price.toLocaleString('en-IN')}. Once the payment is complete, upload the screenshot/receipt below.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Your User ID / Email</label>
                    <Input
                      type="text"
                      value={formData.userId}
                      onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                      placeholder="Enter your user ID or email"
                      className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Your Password</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Confirm Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                      className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Transaction ID / Payment Reference *</label>
                    <Input
                      type="text"
                      value={formData.screenshotUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, screenshotUrl: e.target.value }))}
                      placeholder="Enter eSewa / Khalti / Fonepay Transaction ID or Reference Number"
                      className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                      required
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Please copy the Transaction ID or Reference Number from your payment app receipt and paste it here.
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-900/30 p-3 text-sm text-red-400 border border-red-800 flex gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      {error}
                    </div>
                  )}

                  <div className="bg-blue-900/20 border border-blue-800 rounded-md p-3">
                    <p className="text-sm text-blue-300">
                      After submitting, your payment screenshot and account information will be verified by our admin. You will gain full access to the course once approved!
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
                  >
                    {loading ? 'Submitting Order & Uploading Receipt...' : 'Submit Order'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
