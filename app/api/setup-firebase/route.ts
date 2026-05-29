import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBtLQE8DjH_m_cEehBFGVoYeeZbAPUL5AA';
const ADMIN_EMAIL = 'anushgiri110@gmail.com';
const ADMIN_PASSWORD = 'Nextgen2624';

/**
 * Auto-setup Firebase Authentication
 * Attempts to create admin user via Firebase REST API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action } = body;

    // Check 1: Test if Firebase Auth REST API is accessible
    const authCheck = await checkFirebaseAuth();
    
    if (!authCheck.enabled) {
      return NextResponse.json({
        success: false,
        error: 'Firebase Auth not enabled',
        details: authCheck.error,
        steps: [
          '1. Go to https://console.firebase.google.com',
          '2. Select project: ngcdo-6b1ce',
          '3. Click "Authentication" in left menu',
          '4. Click "Get Started"',
          '5. Enable "Email/Password" provider',
          '6. Save changes'
        ]
      }, { status: 400 });
    }

    // Check 2: Try to create admin user
    if (action === 'create-admin') {
      const createResult = await createAdminUser();
      
      if (createResult.success) {
        return NextResponse.json({
          success: true,
          message: 'Admin user created successfully',
          email: ADMIN_EMAIL,
          note: 'You can now log in with these credentials'
        });
      } else if (createResult.alreadyExists) {
        // Try to sign in to verify password
        const signInResult = await signInAsAdmin();
        if (signInResult.success) {
          return NextResponse.json({
            success: true,
            message: 'Admin user already exists with correct password',
            email: ADMIN_EMAIL
          });
        } else {
          return NextResponse.json({
            success: false,
            error: 'Admin user exists but password may be different',
            details: 'Please reset password in Firebase Console',
            consoleUrl: 'https://console.firebase.google.com/project/ngcdo-6b1ce/authentication/users'
          }, { status: 400 });
        }
      } else {
        return NextResponse.json({
          success: false,
          error: 'Failed to create admin user',
          details: createResult.error
        }, { status: 500 });
      }
    }

    // Default: just check status
    return NextResponse.json({
      success: true,
      authEnabled: true,
      message: 'Firebase Auth is enabled',
      nextStep: 'Call POST with action: "create-admin" to create admin user'
    });

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Setup failed',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * Check if Firebase Auth REST API is accessible
 */
async function checkFirebaseAuth(): Promise<{ enabled: boolean; error?: string }> {
  try {
    // Try a simple request to check if Auth is enabled
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123456',
          returnSecureToken: true
        })
      }
    );

    const data = await response.json();

    // If we get a configuration error, auth is not enabled
    if (data.error?.message?.includes('CONFIGURATION_NOT_FOUND') || 
        data.error?.message?.includes('configuration-not-found')) {
      return { enabled: false, error: data.error.message };
    }

    // If we get EMAIL_EXISTS or other user-related error, auth IS enabled
    // (we just can't create the test user)
    if (data.error?.message?.includes('EMAIL_EXISTS') || 
        data.error?.message?.includes('WEAK_PASSWORD') ||
        data.error?.message?.includes('INVALID_EMAIL')) {
      return { enabled: true };
    }

    // If successful, auth is definitely enabled
    if (data.idToken) {
      return { enabled: true };
    }

    return { enabled: false, error: data.error?.message || 'Unknown error' };
  } catch (error: any) {
    return { enabled: false, error: error.message };
  }
}

/**
 * Create admin user via REST API
 */
async function createAdminUser(): Promise<{ 
  success: boolean; 
  error?: string; 
  alreadyExists?: boolean;
  uid?: string;
}> {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          returnSecureToken: true
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      if (data.error.message.includes('EMAIL_EXISTS')) {
        return { success: false, alreadyExists: true, error: 'User already exists' };
      }
      return { success: false, error: data.error.message };
    }

    // User created successfully
    if (data.localId) {
      // Also set admin role in Firestore via separate call
      await setAdminRole(data.localId);
      return { success: true, uid: data.localId };
    }

    return { success: false, error: 'No user ID returned' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sign in as admin to verify credentials
 */
async function signInAsAdmin(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          returnSecureToken: true
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return { success: false, error: data.error.message };
    }

    if (data.idToken) {
      return { success: true };
    }

    return { success: false, error: 'Login failed' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Set admin role in Firestore
 */
async function setAdminRole(uid: string): Promise<void> {
  try {
    // Use Firestore REST API to create admin user document
    const projectId = 'ngcdo-6b1ce';
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`;
    
    await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          uid: { stringValue: uid },
          email: { stringValue: ADMIN_EMAIL },
          role: { stringValue: 'admin' },
          displayName: { stringValue: 'Admin' },
          createdAt: { timestampValue: new Date().toISOString() },
          authProvider: { stringValue: 'email' }
        }
      })
    });
  } catch (error) {
    console.error('Failed to set admin role:', error);
  }
}
