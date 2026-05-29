import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const ordersFilePath = path.join(process.cwd(), 'data', 'order_submissions.json');

const loadOrdersFromFile = () => {
  try {
    if (!fs.existsSync(ordersFilePath)) return;
    const raw = fs.readFileSync(ordersFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Clear existing and load from file
      orderSubmissionsStore.splice(0, orderSubmissionsStore.length);
      parsed.forEach((item) => {
        orderSubmissionsStore.push(item);
      });
    }
  } catch (error) {
    console.error('Failed to load orders from file:', error);
  }
};

const saveOrdersToFile = () => {
  try {
    const dir = path.dirname(ordersFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ordersFilePath, JSON.stringify(orderSubmissionsStore, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save orders to file:', error);
  }
};

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key exists:', Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
console.log('hasSupabaseConfig:', hasSupabaseConfig);

declare global {
  // eslint-disable-next-line no-var
  var __nextgenOrderSubmissions: any[] | undefined;
}

const orderSubmissionsStore = globalThis.__nextgenOrderSubmissions ||= [];

// Add some default submissions if the store is empty
if (orderSubmissionsStore.length === 0) {
  orderSubmissionsStore.push(
    {
      id: 'sample_1',
      order_id: 'order_001',
      user_id: 'user_001',
      course_name: 'Python Programming',
      user_id_value: 'john_doe',
      user_password: 'pass123',
      user_email: 'john@example.com',
      screenshot_url: 'https://via.placeholder.com/640x360?text=Sample+Screenshot+1',
      status: 'pending',
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      amount: 1999,
    },
    {
      id: 'sample_2',
      order_id: 'order_002',
      user_id: 'user_002',
      course_name: 'React Development',
      user_id_value: 'jane_smith',
      user_password: 'react456',
      user_email: 'jane@example.com',
      screenshot_url: 'https://via.placeholder.com/640x360?text=Sample+Screenshot+2',
      status: 'approved',
      created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      amount: 3499,
    }
  );
}

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const { data, error } = await supabase
        .from('order_submissions')
        .select('user_id_value, user_email, created_at, status, certificate_url, course_name')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Group by user_id_value to get unique students with their courses
        const studentsMap = new Map();
        data.forEach((submission: any) => {
          if (!studentsMap.has(submission.user_id_value)) {
            // Skip students with 'removed' status
            if (submission.status === 'removed') return;

            studentsMap.set(submission.user_id_value, {
              id: submission.user_id_value,
              email: submission.user_email || 'N/A',
              status: submission.status,
              created_at: submission.created_at,
              certificate_url: submission.certificate_url || null,
              graduated: submission.status === 'graduated',
              courses: [submission.course_name]
            });
          } else {
            const student = studentsMap.get(submission.user_id_value);
            // Skip if this student was already marked as removed
            if (student.status === 'removed') return;

            if (!student.courses.includes(submission.course_name)) {
              student.courses.push(submission.course_name);
            }
            // Update status: if any course is approved, status is approved
            // if all courses are graduated, status is graduated
            // Skip removed status updates
            if (submission.status === 'approved') {
              student.status = 'approved';
              student.graduated = false;
            } else if (submission.status === 'graduated') {
              // Only set to graduated if previously not approved
              if (student.status !== 'approved') {
                student.status = 'graduated';
                student.graduated = true;
              }
            }
            // Update certificate_url if available
            if (submission.certificate_url) {
              student.certificate_url = submission.certificate_url;
            }
          }
        });
        return NextResponse.json(Array.from(studentsMap.values()));
      }
      if (error) {
        console.error('Supabase GET /api/students error:', error.message);
      }
    } catch (error) {
      console.error('Supabase GET /api/students exception:', error);
    }
  }

  // Fallback to file storage
  loadOrdersFromFile();
  const studentsMap = new Map();
  orderSubmissionsStore.forEach((submission: any) => {
    // Skip removed students
    if (submission.status === 'removed') return;

    if (!studentsMap.has(submission.user_id_value)) {
      studentsMap.set(submission.user_id_value, {
        id: submission.user_id_value,
        email: submission.user_email || 'N/A',
        status: submission.status,
        created_at: submission.created_at,
        certificate_url: submission.certificate_url || null,
        graduated: submission.status === 'graduated',
        courses: [submission.course_name]
      });
    } else {
      const student = studentsMap.get(submission.user_id_value);
      if (!student.courses.includes(submission.course_name)) {
        student.courses.push(submission.course_name);
      }
      // Update status: if any course is approved, status is approved
      // if all courses are graduated, status is graduated
      if (submission.status === 'approved') {
        student.status = 'approved';
        student.graduated = false;
      } else if (submission.status === 'graduated') {
        // Only set to graduated if previously not approved
        if (student.status !== 'approved') {
          student.status = 'graduated';
          student.graduated = true;
        }
      }
      if (submission.certificate_url) {
        student.certificate_url = submission.certificate_url;
      }
    }
  });

  return NextResponse.json(Array.from(studentsMap.values()));
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, action } = await request.json(); // action: 'approve', 'decline', 'graduate', 'remove'

    console.log('Students API PATCH - id:', id, 'action:', action);

    if (!id || !action) {
      return NextResponse.json({ error: 'Student ID and action required' }, { status: 400 });
    }

    let newStatus: 'approved' | 'declined' | 'graduated' | 'removed';
    if (action === 'approve') newStatus = 'approved';
    else if (action === 'decline') newStatus = 'declined';
    else if (action === 'graduate') newStatus = 'graduated';
    else if (action === 'remove') newStatus = 'removed';
    else {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    }

    if (hasSupabaseConfig) {
      console.log('Using Supabase config:', hasSupabaseConfig);
      try {
        if (action === 'remove') {
          // Delete all data for this student from both tables
          console.log('Removing student:', id);
          
          // Delete from order_submissions
          const { error: submissionsError } = await supabase
            .from('order_submissions')
            .delete()
            .eq('user_id_value', id);

          if (submissionsError) {
            console.error('Error deleting from order_submissions:', submissionsError);
          }

          // Delete from user_orders
          const { error: ordersError } = await supabase
            .from('user_orders')
            .delete()
            .eq('user_id', id);

          if (ordersError) {
            console.error('Error deleting from user_orders:', ordersError);
          }

          // Also try deleting by email if user_id didn't work
          const { error: submissionsEmailError } = await supabase
            .from('order_submissions')
            .delete()
            .eq('user_email', id);

          const { error: ordersEmailError } = await supabase
            .from('user_orders')
            .delete()
            .eq('user_email', id);

          if (!submissionsError || !submissionsEmailError || !ordersError || !ordersEmailError) {
            console.log('Student removed from Supabase successfully');
          } else {
            console.log('Supabase removal failed, continuing to file storage');
          }
          // Always continue to file storage fallback
        } else {
          // Handle other actions (approve, decline, graduate)
          const { error } = await supabase
            .from('order_submissions')
            .update({ status: newStatus })
            .eq('user_id_value', id);

          if (!error) {
            // Also update user_orders
            const { error: orderError } = await supabase
              .from('user_orders')
              .update({ status: newStatus })
              .eq('user_id', id);

            if (orderError) {
              console.error('Error updating user_orders:', orderError);
            }

            // If graduating, add certificate URLs
            if (action === 'graduate') {
              const { data: studentCourses } = await supabase
                .from('order_submissions')
                .select('course_name')
                .eq('user_id_value', id)
                .eq('status', 'graduated');

              if (studentCourses) {
                for (const course of studentCourses) {
                  const certificateUrl = `/api/certificate?studentId=${encodeURIComponent(id)}&courseName=${encodeURIComponent(course.course_name)}`;
                  await supabase
                    .from('order_submissions')
                    .update({ certificate_url: certificateUrl })
                    .eq('user_id_value', id)
                    .eq('course_name', course.course_name);
                }
              }
            }

            return NextResponse.json({ message: `Student ${action}d successfully` });
          }
          console.log('Supabase update failed, continuing to file storage');
        }
      } catch (supabaseError) {
        console.error('Supabase student update exception:', supabaseError);
      }
    }

    // Fallback to file storage
    loadOrdersFromFile();
    let updated = false;
    if (action === 'remove') {
      console.log('Removing student from file storage:', id);
      const before = orderSubmissionsStore.length;
      console.log('Submissions before removal:', before);
      
      // Filter out the student instead of splice
      const filtered = orderSubmissionsStore.filter((item: any) => item.user_id_value !== id);
      const removedCount = before - filtered.length;
      
      if (removedCount > 0) {
        // Clear the original array and replace with filtered data
        orderSubmissionsStore.splice(0, orderSubmissionsStore.length);
        filtered.forEach((item: any) => {
          orderSubmissionsStore.push(item);
        });
        
        console.log('Spliced array count:', orderSubmissionsStore.length);
        saveOrdersToFile();
        
        // Verify file was written
        try {
          const verify = JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
          console.log('File verification - students count:', Array.isArray(verify) ? verify.length : 'not an array');
          const hasRemoved = Array.isArray(verify) && verify.some((s: any) => s.user_id_value === id);
          console.log('File still has removed student:', hasRemoved);
        } catch (e) {
          console.error('Failed to verify file:', e);
        }
        
        return NextResponse.json({ message: `Student removed successfully (file storage)`, removedCount });
      } else {
        console.log('No submissions found to remove');
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }
    } else {
      orderSubmissionsStore.forEach((submission: any) => {
        if (submission.user_id_value === id) {
          submission.status = newStatus;
          if (action === 'graduate') {
            submission.certificate_url = `/api/certificate?studentId=${encodeURIComponent(id)}&courseName=${encodeURIComponent(submission.course_name)}`;
          }
          updated = true;
        }
      });

      if (updated) {
        saveOrdersToFile();
        return NextResponse.json({ message: `Student ${action}d successfully (file storage)` });
      }
    }

    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  } catch (error) {
    console.error('Students PATCH endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}