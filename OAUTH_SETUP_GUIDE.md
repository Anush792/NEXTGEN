# FREE Firebase OAuth Setup Guide

## 🚀 **Why Firebase?**

- **100% FREE** - No credit card required
- **Unlimited OAuth logins**
- **Google and Facebook support**
- **Easy setup** - Just a few clicks

## 📋 **Quick Setup (5 minutes)**

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Sign in with your Google account
3. Click **"Create a project"**
4. Name it (e.g., "my-app-auth")
5. Click **"Continue"** through the steps

### 2. Enable Authentication

1. In your project dashboard, click **"Authentication"** (left sidebar)
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **Google** provider
5. Enable **Facebook** provider

### 3. Get Firebase Config

1. Click the gear icon **⚙️** (Project settings)
2. Scroll to **"Your apps"** section
3. Click the **web icon** `</>` to add a web app
4. Register app (name: "My App")
5. **Copy the config object**

### 4. Update Environment Variables

Replace the demo values in your `.env` file with real Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 🧪 **Test the Setup**

```bash
npm run dev
```

Visit `http://localhost:3000/signin` and test:

- ✅ Google login
- ✅ Facebook login
- ✅ Email/password signup

## 🔧 **Troubleshooting**

### "Auth domain not authorized"

- In Firebase Console → Authentication → Settings
- Add your domain to "Authorized domains"
- Add: `localhost` (for development)

### OAuth popup blocked

- Allow popups in your browser
- Or use redirect mode (advanced)

### Still getting errors?

- Check Firebase Console → Authentication → Users
- Verify providers are enabled
- Check browser console for detailed errors

## 💡 **Pro Tips**

- Firebase Auth is **completely free** forever
- No usage limits for basic authentication
- Scales automatically as you grow
- Works with any frontend framework

## 🎯 **What's Working Now**

- ✅ Google OAuth (free)
- ✅ Facebook OAuth (free)
- ✅ Email/Password auth (free)
- ✅ Secure authentication
- ✅ User session management
- ✅ Automatic redirects
