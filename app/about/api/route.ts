import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

declare global {
  // eslint-disable-next-line no-var
  var __nextgenUserOrders: any[] | undefined;
  // eslint-disable-next-line no-var
  var __nextgenOrderSubmissions: any[] | undefined;
}

const userOrdersStore = globalThis.__nextgenUserOrders ||= [];
const orderSubmissionsStore = globalThis.__nextgenOrderSubmissions ||= [];

export async function GET() {
  return NextResponse.json({ message: 'About API is working' });
}

export async function POST(request: NextRequest) {
  try {
    // Note: Ensure 'order_screenshots' bucket exists in Supabase Storage and is public with upload permissions.

    const contentType = request.headers.get('content-type') || '';

    let courseId: string | null = null;
    let courseName: string | null = null;
    let price: string | null = null;
    let userIdValue: string | null = null;
    let userPassword: string | null = null;
    let screenshotFile: File | null = null;
    let screenshotBase64: string | null = null;
    let screenshotFilename: string | null = null;

    if (contentType.includes('application/json')) {
      const body = await request.json();
      courseId = body.courseId;
      courseName = body.courseName;
      price = body.price;
      userIdValue = body.userIdValue;
      userPassword = body.userPassword;
      screenshotBase64 = body.screenshotBase64;
      screenshotFilename = body.screenshotFilename;
    } else {
      const formData = await request.formData();
      courseId = formData.get('courseId') as string | null;
      courseName = formData.get('courseName') as string | null;
      price = formData.get('price') as string | null;
      userIdValue = formData.get('userIdValue') as string | null;
      userPassword = formData.get('userPassword') as string | null;
      screenshotFile = formData.get('screenshot') as File | null;
      screenshotBase64 = formData.get('screenshotBase64') as string | null;
      screenshotFilename = formData.get('screenshotFilename') as string | null;
    }

    if (!courseId || !courseName || !price || !userIdValue || !userPassword) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    let finalScreenshotUrl = '';
    const uniqueId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = screenshotFilename || (screenshotFile?.name ?? `screenshot-${Date.now()}.png`);
    const screenshotPath = `${uniqueId}_${fileName}`;

    const uploadToStorage = async (file: File | Blob, contentType?: string) => {
      if (!hasSupabaseConfig) {
        console.warn('Supabase not configured: skipping screenshot upload and using placeholder URL');
        return 'https://via.placeholder.com/640x360?text=Screenshot+Not+Uploaded';
      }

      const bucketName = 'order_screenshots';

      try {
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(screenshotPath, file, {
            contentType: contentType || 'image/png',
            upsert: true,
          });

        if (uploadError) {
          console.warn('Supabase screenshot upload error:', uploadError.message);
          if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
            console.log('Bucket not found, attempting to create...');
            const { error: createError } = await supabase.storage.createBucket(bucketName, {
              public: true,
              allowedMimeTypes: ['image/*'],
              fileSizeLimit: 5242880,
            });

            if (createError) {
              console.error('Failed to create bucket:', createError);
              return 'https://via.placeholder.com/640x360?text=Screenshot+Store+Failure';
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
            const { error: retryError } = await supabase.storage
              .from(bucketName)
              .upload(screenshotPath, file, {
                contentType: contentType || 'image/png',
                upsert: true,
              });

            if (retryError) {
              console.error('Retry upload error:', retryError.message);
              return 'https://via.placeholder.com/640x360?text=Screenshot+Store+Failure';
            }
          } else {
            return 'https://via.placeholder.com/640x360?text=Screenshot+Store+Failure';
          }
        }

        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(screenshotPath);
        if (urlData?.publicUrl) {
          return urlData.publicUrl;
        }

        return 'https://via.placeholder.com/640x360?text=Screenshot+URL+Error';
      } catch (error) {
        console.error('Storage upload error:', error);
        return 'https://via.placeholder.com/640x360?text=Screenshot+Error';
      }
    };

    if (screenshotFile) {
      finalScreenshotUrl = await uploadToStorage(screenshotFile, screenshotFile.type);
    } else if (screenshotBase64) {
      const match = screenshotBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
      const base64Data = match ? match[2] : screenshotBase64;
      const buffer = Buffer.from(base64Data, 'base64');
      const contentType = match ? match[1] : 'image/png';

      // Convert Buffer to Blob for upload
      const blob = new Blob([buffer], { type: contentType });
      finalScreenshotUrl = await uploadToStorage(blob, contentType);
    } else {
      return NextResponse.json(
        { message: 'No screenshot provided' },
        { status: 400 }
      );
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let submissionId = `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (hasSupabaseConfig) {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('user_orders')
          .insert([
            {
              user_id: userId,
              course_id: courseId,
              course_name: courseName,
              price: parseFloat(price),
              status: 'pending',
            },
          ])
          .select();

        if (orderError || !orderData?.[0]?.id) {
          console.error('Order creation error:', orderError);
          throw new Error(orderError?.message || 'Unknown order creation error');
        }

        orderId = String(orderData[0].id);

        const { data: submissionData, error: submissionError } = await supabase
          .from('order_submissions')
          .insert([
            {
              order_id: orderId,
              user_id: userId,
              course_name: courseName,
              user_id_value: userIdValue,
              user_password: userPassword,
              screenshot_url: finalScreenshotUrl,
              status: 'pending',
            },
          ])
          .select();

        if (submissionError || !submissionData?.[0]?.id) {
          console.error('Submission creation error:', submissionError);
          await supabase.from('user_orders').delete().eq('id', orderId);
          throw new Error(submissionError?.message || 'Unknown submission error');
        }

        submissionId = String(submissionData[0].id);
      } catch (dbError) {
        console.warn('Supabase order path failed, using local fallback (non-breaking):', dbError);

        // Fallback to in-memory store
        const fallbackOrder = {
          id: orderId,
          user_id: userId,
          course_id: courseId,
          course_name: courseName,
          price: parseFloat(price),
          status: 'pending',
          created_at: new Date().toISOString(),
        };
        userOrdersStore.push(fallbackOrder);

        const fallbackSubmission = {
          id: submissionId,
          order_id: orderId,
          user_id: userId,
          course_name: courseName,
          user_id_value: userIdValue,
          user_password: userPassword,
          screenshot_url: finalScreenshotUrl,
          status: 'pending',
          created_at: new Date().toISOString(),
        };
        orderSubmissionsStore.push(fallbackSubmission);
      }
    } else {
      const fallbackOrder = {
        id: orderId,
        user_id: userId,
        course_id: courseId,
        course_name: courseName,
        price: parseFloat(price),
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      userOrdersStore.push(fallbackOrder);

      const fallbackSubmission = {
        id: submissionId,
        order_id: orderId,
        user_id: userId,
        course_name: courseName,
        user_id_value: userIdValue,
        user_password: userPassword,
        screenshot_url: finalScreenshotUrl,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      orderSubmissionsStore.push(fallbackSubmission);
    }

    return NextResponse.json({
      message: 'Order submitted successfully',
      orderId,
      submissionId,
      screenshotUrl: finalScreenshotUrl,
    });
  } catch (error) {
    console.error('Error in /about/api', error);
    return NextResponse.json(
      { message: 'An error occurred', error: (error as any).message || error },
      { status: 500 }
    );
  }
}
