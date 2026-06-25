import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ADMIN_EMAIL = 'anushgiri110@gmail.com';
const ADMIN_PASSWORD = 'NextGen1234567890';

async function readAdminFile() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'admin.json');
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { adminUid: null, isAdmin: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, uid, googleEmail } = body as { email?: string; password?: string; uid?: string; googleEmail?: string };

    const adminData = await readAdminFile();

    // 1) UID-based admin check (e.g., after sign-in elsewhere)
    if (uid && adminData.isAdmin && uid === adminData.adminUid) {
      return NextResponse.json(
        { token: Buffer.from(`admin:${uid}:${Date.now()}`).toString('base64'), isAdmin: true, adminUid: adminData.adminUid },
        { status: 200 }
      );
    }

    // 2) Email + password sign-in (simple server-side check)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json(
        { token: Buffer.from(`admin:${email}:${Date.now()}`).toString('base64'), isAdmin: true, adminUid: adminData.adminUid },
        { status: 200 }
      );
    }

    // 3) Google auth sign-in (email matches and password is correct)
    if (googleEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json(
        { token: Buffer.from(`admin:${googleEmail}:${Date.now()}`).toString('base64'), isAdmin: true, adminUid: adminData.adminUid, method: 'google' },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ message: 'An error occurred', details: error?.message }, { status: 500 });
  }
}
