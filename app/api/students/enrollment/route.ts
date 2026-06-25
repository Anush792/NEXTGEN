import { NextRequest, NextResponse } from 'next/server';
import {
  db,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  type DocumentData
} from '@/lib/firebase';

// GET: Get student's pending enrollments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get orders for this user
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const enrollments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DocumentData[];

    return NextResponse.json(
      {
        success: true,
        enrollments,
        count: enrollments.length
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

// POST: Student accepts enrollment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, userId, action, notes } = body as {
      orderId: string;
      userId: string;
      action: 'accept' | 'decline';
      notes?: string;
    };

    if (!orderId || !userId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Use "accept" or "decline"' },
        { status: 400 }
      );
    }

    // Verify the order belongs to this user
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();
    if (orderData.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update enrollment status
    if (action === 'accept') {
      await updateDoc(orderRef, {
        studentStatus: 'accepted',
        studentAcceptedAt: serverTimestamp(),
        studentNotes: notes || '',
        updatedAt: serverTimestamp()
      });

      return NextResponse.json(
        {
          success: true,
          message: 'You have accepted this course enrollment!',
          enrollment: {
            id: orderId,
            studentStatus: 'accepted'
          }
        },
        { status: 200 }
      );
    } else {
      // decline
      await updateDoc(orderRef, {
        studentStatus: 'declined',
        studentDeclinedAt: serverTimestamp(),
        studentNotes: notes || '',
        updatedAt: serverTimestamp()
      });

      return NextResponse.json(
        {
          success: true,
          message: 'You have declined this course enrollment.',
          enrollment: {
            id: orderId,
            studentStatus: 'declined'
          }
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update enrollment' },
      { status: 500 }
    );
  }
}
