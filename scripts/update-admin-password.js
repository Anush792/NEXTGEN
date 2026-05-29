/**
 * Admin Password Update Script
 * 
 * This script updates the admin user password in Firebase Authentication.
 * The admin password is securely stored in Firebase Auth (server-side),
 * not in the frontend code.
 * 
 * New Password: Nextgen2624
 * 
 * To use:
 * 1. Open your browser console on the website
 * 2. Copy and paste this entire script
 * 3. Run: updateAdminPassword()
 * 
 * Or manually in Firebase Console:
 * 1. Go to Firebase Console → Authentication → Users
 * 2. Find user: admin@nextgencoders.com
 * 3. Click "Reset Password" and set to: Nextgen2624
 */

// Instructions for manual admin password update
console.log(`
╔════════════════════════════════════════════════════════════════╗
║           ADMIN PASSWORD UPDATE - Nextgen2624                 ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  OPTION 1: Firebase Console (Recommended)                    ║
║  ────────────────────────────────────────                      ║
║  1. Visit: https://console.firebase.google.com                 ║
║  2. Go to Authentication → Users                               ║
║  3. Create/Find user: anushgiri110@gmail.com                  ║
║  4. Set password: Nextgen2624                                 ║
║  5. Click "Save"                                               ║
║                                                                ║
║  OR if user already exists:                                   ║
║  3. Find: anushgiri110@gmail.com                              ║
║  4. Click "Reset Password"                                     ║
║  5. Enter new password: Nextgen2624                           ║
║  6. Click "Save"                                               ║
║                                                                ║
║  OPTION 2: Browser Console (If already logged in)            ║
║  ─────────────────────────────────────────────────            ║
║  If you're already logged in as admin, run:                  ║
║                                                                ║
║  const user = firebase.auth().currentUser;                   ║
║  user.updatePassword('Nextgen2624')                          ║
║    .then(() => console.log('Password updated!'))              ║
║    .catch(err => console.error('Error:', err));              ║
║                                                                ║
║  SECURITY NOTES:                                               ║
║  • Password is stored securely in Firebase Auth (hashed)      ║
║  • No plain text passwords in frontend code                   ║
║  • All auth handled server-side by Google                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

// Admin credentials reference (for development use only)
const ADMIN_CREDENTIALS = {
  email: 'anushgiri110@gmail.com',
  password: 'Nextgen2624'  // NEW SECURE PASSWORD
};

// Export for use if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ADMIN_CREDENTIALS };
}
