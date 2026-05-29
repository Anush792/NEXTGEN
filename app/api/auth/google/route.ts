import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${request.nextUrl.origin}/api/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        new URL('/signin?error=oauth_error', request.url)
      );
    }

    if (data.url) {
      return NextResponse.redirect(data.url);
    }

    return NextResponse.redirect(
      new URL('/signin?error=oauth_failed', request.url)
    );
  } catch (err) {
    console.error('Google OAuth setup error:', err);
    return NextResponse.redirect(
      new URL('/signin?error=server_error', request.url)
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'initiate') {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Google OAuth POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

