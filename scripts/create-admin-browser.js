/**
 * FIREBASE ADMIN USER CREATOR
 * Run this in your browser console after enabling Firebase Auth
 * 
 * How to use:
 * 1. First enable Firebase Auth in console: https://console.firebase.google.com/project/ngcdo-6b1ce/authentication
 * 2. Open your website (localhost or deployed)
 * 3. Open browser console (F12 → Console tab)
 * 4. Copy and paste this entire script
 * 5. Press Enter
 * 6. The admin user will be created automatically
 */

(async function createAdmin() {
  const ADMIN_EMAIL = 'anushgiri110@gmail.com';
  const ADMIN_PASSWORD = 'Nextgen2624';
  
  console.log('%c🔥 Creating Admin User...', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
  console.log('%cEmail: ' + ADMIN_EMAIL, 'color: #10b981;');
  
  try {
    // Check if Firebase is loaded
    if (typeof firebase === 'undefined') {
      console.error('%c❌ Firebase not loaded. Make sure you\'re on the website.', 'color: #ef4444;');
      return;
    }
    
    // Try to create user
    const auth = firebase.auth();
    
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
      const user = userCredential.user;
      
      console.log('%c✅ Admin user created successfully!', 'color: #10b981; font-size: 14px;');
      console.log('%cUID: ' + user.uid, 'color: #6b7280;');
      
      // Set admin role in Firestore
      const db = firebase.firestore();
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: ADMIN_EMAIL,
        role: 'admin',
        displayName: 'Admin',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        authProvider: 'email'
      });
      
      console.log('%c✅ Admin role set in Firestore!', 'color: #10b981;');
      console.log('%c🎉 Setup complete! You can now login at /admin', 'color: #3b82f6; font-size: 16px;');
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('%c⚠️ Admin user already exists', 'color: #f59e0b;');
        console.log('%cAttempting to sign in to verify...', 'color: #6b7280;');
        
        try {
          await auth.signInWithEmailAndPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
          console.log('%c✅ Admin credentials verified!', 'color: #10b981;');
        } catch (signInError) {
          console.error('%c❌ Password may be different. Error: ' + signInError.message, 'color: #ef4444;');
        }
      } else if (error.code === 'auth/configuration-not-found') {
        console.error('%c❌ Firebase Auth not enabled!', 'color: #ef4444; font-size: 14px;');
        console.log('%cPlease enable it first:', 'color: #f59e0b;');
        console.log('%chttps://console.firebase.google.com/project/ngcdo-6b1ce/authentication', 'color: #3b82f6; text-decoration: underline; cursor: pointer;');
      } else {
        console.error('%c❌ Error: ' + error.message, 'color: #ef4444;');
        console.log('%cCode: ' + error.code, 'color: #6b7280;');
      }
    }
    
  } catch (error) {
    console.error('%c❌ Script error:', 'color: #ef4444;', error);
  }
})();

// Instructions
console.log('%c📋 Instructions:', 'color: #3b82f6; font-weight: bold;');
console.log('1. If you see "Auth not enabled" error above:');
console.log('   → Go to https://console.firebase.google.com/project/ngcdo-6b1ce/authentication');
console.log('   → Click "Get Started"');
console.log('   → Enable "Email/Password"');
console.log('2. Then run this script again');
console.log('3. Or manually create user in the Firebase Console');
