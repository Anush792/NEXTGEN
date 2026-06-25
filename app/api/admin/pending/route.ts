import { NextRequest, NextResponse } from 'next/server';
import {
  db,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  type DocumentData
} from '@/lib/firebase';

// GET: Get students pending acceptance
// Returns all students whose orders have been approved but not yet accepted/declined by student
export async function GET(request: NextRequest) {
  try {
    const ordersRef = collection(db, 'orders');
    
    // Get all orders that are:
    // - Status: completed (approved by admin)
    // - studentStatus: undefined or null (student hasn't responded)
    const q = query(
      ordersRef,
      where('status', '==', 'completed'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const pendingAcceptances = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter((order: DocumentData) => !order.studentStatus) as DocumentData[];

    return NextResponse.json(
      {
        success: true,
        pendingAcceptances,
        count: pendingAcceptances.length
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching pending acceptances:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pending acceptances' },
      { status: 500 }
    );
  }
}

// POST: Get summary stats for admin dashboard
export async function POST(request: NextRequest) {
  try {
    const ordersRef = collection(db, 'orders');
    
    // Get pending completions
    const pendingQ = query(
      ordersRef,
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    // Get pending acceptances (approved by admin but not by student)
    const acceptanceQ = query(
      ordersRef,
      where('status', '==', 'completed'),
      orderBy('createdAt', 'desc')
    );

    const [pendingSnapshot, acceptanceSnapshot] = await Promise.all([
      getDocs(pendingQ),
      getDocs(acceptanceQ)
    ]);

    const pendingOrders = pendingSnapshot.size;
    const pendingAcceptances = acceptanceSnapshot.docs
      .filter(doc => !doc.data().studentStatus)
      .length;

    return NextResponse.json(
      {
        success: true,
        stats: {
          pendingApproval: pendingOrders,
          pendingStudentAcceptance: pendingAcceptances,
          totalAwaitingAction: pendingOrders + pendingAcceptances
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get stats' },
      { status: 500 }
    );
  }
}
