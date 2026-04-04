import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const ADMIN_PASSWORD = 'nextgen1234567890';

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json(
        { token: Buffer.from(`admin:${Date.now()}`).toString('base64') },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
