import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const ordersFilePath = path.join(process.cwd(), 'data', 'order_submissions.json');

declare global {
  // eslint-disable-next-line no-var
  var __nextgenOrderSubmissions: any[] | undefined;
}

const orderSubmissionsStore = globalThis.__nextgenOrderSubmissions ||= [];

const loadOrdersFromFile = () => {
  try {
    if (!fs.existsSync(ordersFilePath)) return;
    const raw = fs.readFileSync(ordersFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      globalThis.__nextgenOrderSubmissions = parsed;
      (globalThis.__nextgenOrderSubmissions as any[]).forEach((item) => orderSubmissionsStore.push(item));
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

loadOrdersFromFile();

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
  console.log('hasSupabaseConfig:', hasSupabaseConfig);

  if (hasSupabaseConfig) {
    try {
      console.log('Fetching orders from Supabase...');
      const { data, error, count } = await supabase
        .from('order_submissions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('Supabase query result - count:', count, 'error:', error);

      if (!error && data) {
        console.log('Retrieved orders from Supabase:', data.length);
        return NextResponse.json(data);
      }
      if (error) {
        console.error('Supabase GET /api/orders error:', error);
        console.error('Error details:', error.message, error.details);
      }
    } catch (error) {
      console.error('Supabase GET /api/orders exception:', error);
    }
  }

  console.log('Using in-memory storage, orders count:', orderSubmissionsStore.length);
  saveOrdersToFile();
  // Fallback to in-memory storage
  return NextResponse.json(orderSubmissionsStore.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));

}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: any;

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = {
        courseId: formData.get('courseId'),
        courseName: formData.get('courseName'),
        price: formData.get('price'),
        userIdValue: formData.get('userIdValue'),
        userPassword: formData.get('userPassword'),
        userEmail: formData.get('userEmail') || null,
        screenshotBase64: formData.get('screenshotBase64') ?? null,
        screenshotUrl: formData.get('screenshotUrl') ?? null,
      };
    }

    const { courseId, courseName, price, userIdValue, userPassword, screenshotBase64, screenshotUrl } = body;

    if (!courseId || !courseName || !price || !userIdValue || !userPassword) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const submissionId = `submission_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const finalScreenshotUrl = screenshotBase64 || screenshotUrl || 'https://via.placeholder.com/640x360?text=Screenshot+Not+Uploaded';

    const fallbackOrder = {
      id: orderId,
      order_id: orderId,
      user_id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      course_name: courseName,
      user_id_value: userIdValue,
      user_password: userPassword,
      user_email: body.userEmail || 'N/A',
      screenshot_url: finalScreenshotUrl,
      status: 'pending',
      created_at: new Date().toISOString(),
      amount: Number(price),
    };

    orderSubmissionsStore.unshift(fallbackOrder);
    saveOrdersToFile();

    let supabaseInsertSuccess = false;
    if (hasSupabaseConfig) {
      try {
        console.log('Inserting order into Supabase...');
        const { data, error } = await supabase
          .from('order_submissions')
          .insert([
            {
              order_id: orderId,
              user_id: fallbackOrder.user_id,
              course_name: courseName,
              user_id_value: userIdValue,
              user_password: userPassword,
              user_email: body.userEmail || 'N/A',
              screenshot_url: finalScreenshotUrl,
              status: 'pending',
            },
          ])
          .select();

        if (error) {
          console.error('Supabase POST /api/orders error:', error);
          console.error('Error details:', error.message, error.details, error.hint);
        } else if (data) {
          supabaseInsertSuccess = true;
          console.log('Successfully inserted order:', data);
        }
      } catch (err) {
        console.error('Supabase POST /api/orders exception:', err);
      }
    } else {
      console.log('No Supabase config, using in-memory storage');
    }

    return NextResponse.json({
      message: 'Order submitted',
      order: fallbackOrder,
      supabaseInsertSuccess,
      inMemorySave: true,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders exception:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, admin_notes } = body;
    if (!id || !status) {
      return NextResponse.json({ message: 'Order ID and status are required' }, { status: 400 });
    }

    const allowedStatuses = ['pending', 'approved', 'declined'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
    }

    let updatedOrder: any = null;

    if (hasSupabaseConfig) {
      try {
        const updateData: any = { status };
        if (admin_notes !== undefined) updateData.admin_notes = admin_notes;

        const { data, error } = await supabase
          .from('order_submissions')
          .update(updateData)
          .eq('id', id);

        const supabaseData = data as any;

        if (error) {
          console.error('Supabase PATCH /api/orders error:', error);
        } else if (Array.isArray(supabaseData) && supabaseData.length > 0) {
          updatedOrder = supabaseData[0];
        }
      } catch (err) {
        console.error('Supabase PATCH /api/orders exception:', err);
      }
    }

    // Fallback in-memory
    const item = orderSubmissionsStore.find((order: any) => order.id === id);
    if (item) {
      item.status = status;
      if (admin_notes !== undefined) {
        item.admin_notes = admin_notes;
      }
      updatedOrder = item;
      saveOrdersToFile();
    }

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('PATCH /api/orders exception:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}