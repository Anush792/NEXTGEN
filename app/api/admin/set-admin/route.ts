import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ADMIN_PASSWORD = 'NextGen1234567890';

const ADMIN_FILE = path.join(process.cwd(), 'data', 'admin.json');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password, uid, isAdmin } = body as { password?: string; uid?: string; isAdmin?: boolean };

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!uid) {
      return NextResponse.json({ message: 'Missing uid' }, { status: 400 });
    }

    const data = { adminUid: uid, isAdmin: !!isAdmin };
    await fs.mkdir(path.dirname(ADMIN_FILE), { recursive: true });
    await fs.writeFile(ADMIN_FILE, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ success: true, ...data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to set admin', details: error?.message }, { status: 500 });
  }
}
