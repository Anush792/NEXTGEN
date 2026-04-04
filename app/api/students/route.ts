import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

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

  // Fallback to in-memory storage
  const studentsMap = new Map();
  orderSubmissionsStore.forEach((submission: any) => {
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
        if (action === 'graduate') {
          // First, get all approved courses for this student
          const { data: approvedCourses } = await supabase
            .from('order_submissions')
            .select('course_name')
            .eq('user_id_value', id)
            .eq('status', 'approved');

          if (approvedCourses && approvedCourses.length > 0) {
            // Update all approved courses to graduated and add certificate URLs
            for (const course of approvedCourses) {
              const certificateUrl = `/api/certificate?studentId=${encodeURIComponent(id)}&courseName=${encodeURIComponent(course.course_name)}`;
              await supabase
                .from('order_submissions')
                .update({ status: 'graduated', certificate_url: certificateUrl })
                .eq('user_id_value', id)
                .eq('course_name', course.course_name);
            }

            // Also update user_orders table
            const { error: orderError } = await supabase
              .from('user_orders')
              .update({ status: 'graduated' })
              .eq('user_id', id);

            if (orderError) {
              console.error('Error updating orders:', orderError);
            }

            return NextResponse.json({ message: `Student graduated successfully` });
          } else {
            return NextResponse.json({ error: 'No approved courses found for this student' }, { status: 400 });
          }
        } else if (action === 'remove') {
          // Delete all data for this student from order_submissions and user_orders
          console.log('Removing student:', id);
          let supabaseDeleteSuccess = false;
          try {
            const { data: deletedByUserValue, error: submissionsError1 } = await supabase
              .from('order_submissions')
              .delete()
              .eq('user_id_value', id)
              .select();

            const { data: deletedByEmail, error: submissionsError2 } = await supabase
              .from('order_submissions')
              .delete()
              .eq('user_email', id)
              .select();

            const deletedData = [...(deletedByUserValue || []), ...(deletedByEmail || [])];
            console.log('Deleted order_submissions:', deletedData);

            if ((!submissionsError1 || !submissionsError2) && deletedData.length > 0) {
              supabaseDeleteSuccess = true;
            }
            if (submissionsError1) {
              console.error('Error deleting submissions by user_id_value:', submissionsError1);
            }
            if (submissionsError2) {
              console.error('Error deleting submissions by user_email:', submissionsError2);
            }
          } catch (err) {
            console.error('Supabase delete exception:', err);
          }

          try {
            const { error: userOrdersError1 } = await supabase
              .from('user_orders')
              .delete()
              .eq('user_id', id);

            const { error: userOrdersError2 } = await supabase
              .from('user_orders')
              .delete()
              .eq('user_email', id);

            if (!userOrdersError1 || !userOrdersError2) {
              supabaseDeleteSuccess = true;
            }
            if (userOrdersError1) {
              console.error('Error deleting from user_orders by user_id:', userOrdersError1);
            }
            if (userOrdersError2) {
              console.error('Error deleting from user_orders by user_email:', userOrdersError2);
            }
          } catch (err) {
            console.error('Supabase delete user_orders exception:', err);
          }

          // Always attempt to remove from in-memory storage as well
          console.log('Removing student from in-memory storage:', id);
          const before = orderSubmissionsStore.length;
          for (let i = orderSubmissionsStore.length - 1; i >= 0; i--) {
            if (orderSubmissionsStore[i].user_id_value === id) {
              console.log('Removing submission:', orderSubmissionsStore[i]);
              orderSubmissionsStore.splice(i, 1);
            }
          }
          const after = orderSubmissionsStore.length;
          const inMemoryRemoved = before - after;

          if (supabaseDeleteSuccess || inMemoryRemoved > 0) {
            return NextResponse.json({ 
              message: `Student removal attempted`, 
              supabaseSuccess: supabaseDeleteSuccess,
              inMemoryRemoved: inMemoryRemoved
            });
          } else {
            return NextResponse.json({ error: 'Student not found in any storage' }, { status: 404 });
          }
        } else {
          // Handle other actions (approve, decline)
          const { error: submissionError } = await supabase
            .from('order_submissions')
            .update({ status: newStatus })
            .eq('user_id_value', id);

          if (!submissionError) {
            const { error: orderError } = await supabase
              .from('user_orders')
              .update({ status: newStatus })
              .eq('user_id', id);

            if (orderError) {
              console.error('Error updating orders:', orderError);
            }

            return NextResponse.json({ message: `Student ${action}d successfully` });
          }
          console.error('Supabase student update error:', submissionError.message);
        }
      } catch (supabaseError) {
        console.error('Supabase student update exception:', supabaseError);
      }
    }

    // Fallback to in-memory storage
    let updated = false;
    if (action === 'remove') {
      console.log('Removing student from in-memory storage:', id);
      const before = orderSubmissionsStore.length;
      console.log('Submissions before removal:', before);
      for (let i = orderSubmissionsStore.length - 1; i >= 0; i--) {
        if (orderSubmissionsStore[i].user_id_value === id) {
          console.log('Removing submission:', orderSubmissionsStore[i]);
          orderSubmissionsStore.splice(i, 1);
        }
      }
      const after = orderSubmissionsStore.length;
      console.log('Submissions after removal:', after);
      if (after < before) {
        console.log('Successfully removed', before - after, 'submissions');
        return NextResponse.json({ message: `Student removed successfully (in-memory)`, removedCount: before - after });
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
        return NextResponse.json({ message: `Student ${action}d successfully (in-memory)` });
      }
    }

    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  } catch (error) {
    console.error('Students PATCH endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}