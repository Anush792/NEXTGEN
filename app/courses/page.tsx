'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, User, Clock, Star, ShoppingCart, ChevronLeft, ChevronRight, BookOpen, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { onCoursesSnapshot, onAdminSettingsSnapshot, type Course } from '@/lib/firebase-db';

const CATEGORIES = ['Web Development', 'Mobile App', 'UI/UX Design', 'Digital Marketing', 'Data Science', 'Programming'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const CATEGORY_COLORS: Record<string, string> = {
  'Web Development': 'bg-blue-600',
  'Mobile App': 'bg-purple-600',
  'UI/UX Design': 'bg-pink-600',
  'Digital Marketing': 'bg-orange-600',
  'Data Science': 'bg-green-600',
  'Programming': 'bg-cyan-600',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  'Beginner': 'bg-green-900/50 text-green-400 border-green-700',
  'Intermediate': 'bg-yellow-900/50 text-yellow-400 border-yellow-700',
  'Advanced': 'bg-red-900/50 text-red-400 border-red-700',
};

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('9821539140');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedPriceFilters, setSelectedPriceFilters] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // Real-time Firebase listeners
  useEffect(() => {
    const unsubscribeCourses = onCoursesSnapshot((newCourses) => {
      setCourses(newCourses);
      setLoading(false);
    });

    const unsubscribeSettings = onAdminSettingsSnapshot((settings) => {
      if (settings?.whatsappNumber) setWhatsappNumber(settings.whatsappNumber);
    });

    return () => {
      unsubscribeCourses();
      unsubscribeSettings();
    };
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...courses];

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructorName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(course => selectedCategories.includes(course.category));
    }

    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter(course => selectedDifficulties.includes(course.difficulty));
    }

    if (selectedPriceFilters.length > 0) {
      filtered = filtered.filter(course => {
        if (selectedPriceFilters.includes('Free') && course.price === 0) return true;
        if (selectedPriceFilters.includes('Paid') && course.price > 0) return true;
        return false;
      });
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [courses, searchQuery, selectedCategories, selectedDifficulties, selectedPriceFilters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]
    );
  };

  const handlePriceFilterChange = (filter: string) => {
    setSelectedPriceFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleEnrollNow = (course: Course) => {
    const signedInEmail = localStorage.getItem('studentEmail');
    if (signedInEmail) {
      router.push(`/checkout?courseId=${course.id}&courseName=${encodeURIComponent(course.title)}&price=${course.price}`);
    } else {
      // Go to WhatsApp for enrollment
      const msg = `Hi! I am interested in the *${course.title}* course (₹${course.price}). Please guide me on enrollment.`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-slate-800 rounded w-20" />
          <div className="h-8 bg-slate-800 rounded w-24" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=2000')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-4">
              <Zap className="h-4 w-4" /> Live Courses from Firebase
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Explore Our <span className="text-blue-500">Courses</span>
            </h1>
            <p className="text-slate-300 text-lg">
              Master the latest technologies with industry experts. New courses added in real-time by our admin.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search for courses, skills, or instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 h-12 rounded-xl"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6 rounded-xl">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <Card className="bg-slate-900 border-slate-800 sticky top-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <span className="text-blue-400">⚙</span> Filters
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Categories */}
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Category</p>
                    <div className="space-y-2">
                      {CATEGORIES.map(category => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer group">
                          <Checkbox
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryChange(category)}
                          />
                          <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Difficulty</p>
                    <div className="space-y-2">
                      {DIFFICULTIES.map(difficulty => (
                        <label key={difficulty} className="flex items-center gap-2 cursor-pointer group">
                          <Checkbox
                            checked={selectedDifficulties.includes(difficulty)}
                            onCheckedChange={() => handleDifficultyChange(difficulty)}
                          />
                          <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{difficulty}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Price</p>
                    <div className="space-y-2">
                      {['Free', 'Paid'].map(filter => (
                        <label key={filter} className="flex items-center gap-2 cursor-pointer group">
                          <Checkbox
                            checked={selectedPriceFilters.includes(filter)}
                            onCheckedChange={() => handlePriceFilterChange(filter)}
                          />
                          <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{filter}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {(selectedCategories.length > 0 || selectedDifficulties.length > 0 || selectedPriceFilters.length > 0 || searchQuery) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
                      onClick={() => { setSelectedCategories([]); setSelectedDifficulties([]); setSelectedPriceFilters([]); setSearchQuery(''); }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            </aside>

            {/* Course Grid */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-slate-400 text-sm">
                  Showing <span className="text-white font-semibold">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''}
                  {loading && <span className="text-blue-400 ml-2">(Loading...)</span>}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : currentCourses.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
                  <p className="text-slate-400 mb-4">
                    {courses.length === 0
                      ? 'No courses have been added yet. Check back soon!'
                      : 'Try adjusting your filters or search term.'}
                  </p>
                  {courses.length > 0 && (
                    <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800" onClick={() => { setSelectedCategories([]); setSelectedDifficulties([]); setSelectedPriceFilters([]); setSearchQuery(''); }}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="group cursor-pointer bg-slate-900 border-slate-800 overflow-hidden hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
                      onClick={() => setSelectedCourse(course)}
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-slate-800">
                        {course.imageUrl ? (
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${CATEGORY_COLORS[course.category] || 'bg-slate-700'}`}>
                            <BookOpen className="h-16 w-16 text-white/60" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className={`${CATEGORY_COLORS[course.category] || 'bg-slate-600'} text-white border-0 text-xs`}>
                            {course.category}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge className={`${DIFFICULTY_COLORS[course.difficulty] || 'bg-slate-800 text-slate-300 border-slate-600'} border text-xs`}>
                            {course.difficulty}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-base leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {course.title}
                        </CardTitle>
                        {course.description && (
                          <p className="text-slate-400 text-sm mt-1 line-clamp-2">{course.description}</p>
                        )}
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[100px]">{course.instructorName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{course.durationHours}h</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-white">
                            {course.price === 0 ? (
                              <span className="text-green-400">Free</span>
                            ) : (
                              `₹${course.price.toLocaleString('en-IN')}`
                            )}
                          </span>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnrollNow(course);
                            }}
                          >
                            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Enroll
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-slate-700 text-white hover:bg-slate-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className={currentPage === i + 1 ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-700 text-white hover:bg-slate-800'}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-slate-700 text-white hover:bg-slate-800"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Detail Dialog */}
      <Dialog open={Boolean(selectedCourse)} onOpenChange={(open) => { if (!open) setSelectedCourse(null); }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedCourse?.title}</DialogTitle>
            <DialogDescription className="text-slate-400">{selectedCourse?.description}</DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <>
              {selectedCourse.imageUrl && (
                <img src={selectedCourse.imageUrl} alt={selectedCourse.title} className="w-full h-48 object-cover rounded-lg" />
              )}

              <div className="flex flex-wrap gap-2">
                <Badge className={`${CATEGORY_COLORS[selectedCourse.category] || 'bg-slate-600'} text-white border-0`}>
                  {selectedCourse.category}
                </Badge>
                <Badge className={`${DIFFICULTY_COLORS[selectedCourse.difficulty] || 'bg-slate-800 text-slate-300 border-slate-600'} border`}>
                  {selectedCourse.difficulty}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-800 p-4">
                  <p className="text-xs text-slate-400">Price</p>
                  <p className="text-lg font-semibold text-white mt-1">
                    {selectedCourse.price === 0 ? <span className="text-green-400">Free</span> : `₹${selectedCourse.price.toLocaleString('en-IN')}`}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800 p-4">
                  <p className="text-xs text-slate-400">Duration</p>
                  <p className="text-lg font-semibold text-white mt-1">{selectedCourse.durationHours} Hours</p>
                </div>
                <div className="rounded-lg bg-slate-800 p-4">
                  <p className="text-xs text-slate-400">Instructor</p>
                  <p className="text-sm font-semibold text-white mt-1">{selectedCourse.instructorName}</p>
                </div>
                <div className="rounded-lg bg-slate-800 p-4">
                  <p className="text-xs text-slate-400">Level</p>
                  <p className="text-sm font-semibold text-white mt-1">{selectedCourse.difficulty}</p>
                </div>
              </div>
            </>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedCourse(null)} className="border-slate-600">
              Close
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => selectedCourse && handleEnrollNow(selectedCourse)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> Enroll Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
