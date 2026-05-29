// Firebase Admin Setup Script
// Run this in browser console after signing up as admin@nextgencoders.com

const createAdmin = async () => {
  const { getAuth, createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
  const { getFirestore, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
  const { initializeApp } = await import('firebase/app');

  const firebaseConfig = {
    apiKey: "AIzaSyBtLQE8DjH_m_cEehBFGVoYeeZbAPUL5AA",
    authDomain: "ngcdo-6b1ce.firebaseapp.com",
    projectId: "ngcdo-6b1ce",
    storageBucket: "ngcdo-6b1ce.firebasestorage.app",
    messagingSenderId: "723238683916",
    appId: "1:723238683916:web:49cec0cd701a97e5223529",
    measurementId: "G-Z0RCXPQ3JS"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const email = 'admin@nextgencoders.com';
  const password = 'admin123';
  const displayName = 'Admin';

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL,
      role: 'admin',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      provider: 'email'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
};

// Instructions for manual admin creation:
console.log(`
╔════════════════════════════════════════════════════════════════╗
║           FIREBASE ADMIN SETUP INSTRUCTIONS                    ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Option 1: Manual Sign Up                                      ║
║  ─────────────────────────────────────────────────────────     ║
║  1. Go to /signin page                                         ║
║  2. Click "Don't have an account? Sign Up"                     ║
║  3. Create account with:                                       ║
║     Email: admin@nextgencoders.com                             ║
║     Password: admin123                                         ║
║     Name: Admin                                                ║
║  4. Go to Firebase Console → Firestore Database                ║
║  5. Find the user document in "users" collection               ║
║  6. Change role field from "user" to "admin"                   ║
║                                                                ║
║  Option 2: Run in Browser Console (after Firebase loads)       ║
║  ─────────────────────────────────────────────────────────     ║
║  Copy and run the createAdmin() function above               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);
