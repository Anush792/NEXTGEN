'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, User, Clock, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  price: number;
  instructor_name: string;
  duration_hours: number;
  num_classes?: number;
  num_videos?: number;
  rating: number;
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Web Development']);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedPriceFilters, setSelectedPriceFilters] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  const openCourseDetails = (course: Course) => {
    setSelectedCourse(course);
  };

  const closeCourseDetails = () => {
    setSelectedCourse(null);
  };

  const handleBuyCourse = (course: Course) => {
    // Extract numeric price from formatted string (e.g., "Rs 1,999 / lifetime" -> "1999")
    const numericPrice = course.price.toString().match(/(\d+(?:,\d+)*)/)?.[1]?.replace(/,/g, '') || '0';
    router.push(
      `/checkout?courseId=${course.id}&courseName=${encodeURIComponent(course.title)}&price=${numericPrice}`
    );
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error(`Failed to fetch courses (status ${response.status})`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('fetchCourses error:', error);
      setCourses([]);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...courses];

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [courses, searchQuery, selectedCategories, selectedDifficulties, selectedPriceFilters, applyFilters]);

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

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">
              Explore Our <span className="text-blue-500">Courses</span>
            </h1>
            <p className="text-slate-300 text-lg">
              Master the latest technologies with industry experts. From web development to AI, we have you covered.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search for courses, skills, or mentors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Find Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <Card className="bg-slate-900 border-slate-800 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-blue-500">⚙️</span> Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Web Development', 'Mobile Apps'].map(category => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <span className="text-slate-300 text-sm">{category}</span>
                    </label>
                  ))}
                </CardContent>

                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-blue-500">📊</span> Difficulty
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map(difficulty => (
                    <label key={difficulty} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedDifficulties.includes(difficulty)}
                        onCheckedChange={() => handleDifficultyChange(difficulty)}
                      />
                      <span className="text-slate-300 text-sm">{difficulty}</span>
                    </label>
                  ))}
                </CardContent>

                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-blue-500">💰</span> Price
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['All Prices', 'Free', 'Paid'].map(filter => (
                    <label key={filter} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedPriceFilters.includes(filter)}
                        onCheckedChange={() => handlePriceFilterChange(filter)}
                      />
                      <span className="text-slate-300 text-sm">{filter}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>
            </aside>

            <Dialog open={Boolean(selectedCourse)} onOpenChange={(open) => { if (!open) closeCourseDetails(); }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedCourse?.title}</DialogTitle>
                  <DialogDescription>{selectedCourse?.description}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="rounded-lg bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Price</p>
                    <p className="text-lg font-semibold text-white">
                      {selectedCourse?.price === 0 ? 'Free' : `$${selectedCourse?.price}`}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Duration</p>
                    <p className="text-lg font-semibold text-white">
                      {selectedCourse?.duration_hours} Hours
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Classes</p>
                    <p className="text-lg font-semibold text-white">
                      {selectedCourse
                        ? selectedCourse.num_classes ?? selectedCourse.duration_hours * 2
                        : 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Videos</p>
                    <p className="text-lg font-semibold text-white">
                      {selectedCourse
                        ? selectedCourse.num_videos ?? selectedCourse.duration_hours * 3
                        : 0}
                    </p>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => selectedCourse && handleBuyCourse(selectedCourse)}
                  >
                    Enroll Now
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-slate-400">Showing <span className="text-white font-semibold">{filteredCourses.length} courses</span></p>
                <select className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 text-sm">
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                  <option>Newest</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentCourses.map((course) => (
                  <Card
                    key={course.id}
                    onClick={() => openCourseDetails(course)}
                    className="cursor-pointer bg-slate-900 border-slate-800 overflow-hidden hover:border-blue-500 transition-all"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                      {course.category === 'Web Development' && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                          Web Dev
                        </div>
                      )}
                      {course.category === 'Data Science' && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-green-600 text-white text-xs rounded">
                          Python
                        </div>
                      )}
                      {course.category === 'Mobile Apps' && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-purple-600 text-white text-xs rounded">
                          Mobile
                        </div>
                      )}
                      <div className="text-6xl">💻</div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(course.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                            }`}
                          />
                        ))}
                        <span className="text-slate-400 text-sm ml-1">({course.rating})</span>
                      </div>
                      <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                      <p className="text-slate-400 text-sm mt-2">{course.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{course.instructor_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration_hours} Hours</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">
                          {course.price === 0 ? (
                            <span className="text-green-500">Free</span>
                          ) : (
                            `$${course.price}`
                          )}
                        </span>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyCourse(course);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

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
                      className={
                        currentPage === i + 1
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'border-slate-700 text-white hover:bg-slate-800'
                      }
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

      <Footer />
    </div>
  );
}
