'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CircleAlert as AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    email: '',
    screenshot: null as File | null,
  });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, screenshot: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.userId || !formData.password || !formData.email || !formData.screenshot) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Convert screenshot to base64
      const screenshotBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        if (formData.screenshot) {
          reader.readAsDataURL(formData.screenshot);
        } else {
          reject(new Error('No screenshot provided'));
        }
      });

      const formDataPayload = new FormData();
      formDataPayload.append('courseId', courseId || '');
      formDataPayload.append('courseName', courseName || '');
      formDataPayload.append('price', coursePrice || '0');
      formDataPayload.append('userIdValue', formData.userId);
      formDataPayload.append('userPassword', formData.password);
      formDataPayload.append('userEmail', formData.email);
      formDataPayload.append('screenshotBase64', screenshotBase64);

      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formDataPayload,
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data?.message || 'Failed to submit order';
        const errorDetail = data?.error ? ` (${data.error})` : '';
        const fullError = `${message}${errorDetail}`;
        setError(fullError);
        console.error('Order submission error:', {
          status: response.status,
          statusText: response.statusText,
          data,
          fullError
        });
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/courses');
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Order submission catch error:', err);
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
                <div className="bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-slate-400">Course</p>
                  <p className="text-lg font-semibold text-white mt-1">{course.title}</p>
                  <p className="text-2xl font-bold text-blue-400 mt-2">${course.price.toFixed(2)}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Your User ID</label>
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
                    <label className="text-sm font-medium text-white block mb-2">Your Email</label>
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
                    <label className="text-sm font-medium text-white block mb-2">Payment Screenshot</label>
                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="screenshot"
                        required
                      />
                      <label htmlFor="screenshot" className="cursor-pointer block">
                        <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-white font-medium">
                          {formData.screenshot ? formData.screenshot.name : 'Click to upload payment screenshot'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </label>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-900/30 p-3 text-sm text-red-400 border border-red-800 flex gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      {error}
                    </div>
                  )}

                  <div className="bg-blue-900/20 border border-blue-800 rounded-md p-3">
                    <p className="text-sm text-blue-300">
                      After submitting, your order will be reviewed by our admin team. You will receive approval or feedback shortly.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    {loading ? 'Submitting...' : 'Submit Order'}
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
