# 🚨 FIX DNS ERROR: Get Your Real Supabase Credentials

## The Problem

You're seeing "Check if there is a typo in your-project-id.supabase.co" because you're using placeholder credentials. You need real Supabase project credentials.

## Step-by-Step Solution

### Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project" or "Sign Up"
3. Create your account (use email or GitHub)

### Step 2: Create New Project

1. Click "New Project" in your dashboard
2. Fill in project details:
   - **Name**: Your project name (e.g., "My Learning Platform")
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select closest to your users (e.g., "East US (North Virginia)")
3. Click "Create new project"
4. **Wait 2-3 minutes** for the project to be created

### Step 3: Get Your Project Credentials

1. In your Supabase dashboard, select your project
2. Go to **Settings** (gear icon) → **API**
3. Copy these values:

**Project URL:**

```
https://abcdefghijklmnop.supabase.co
```

(This will be different for your project)

**anon/public key:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long string)
```

### Step 4: Update Your .env File

Replace the placeholder values in your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
NEXTAUTH_SECRET=5b833301e58b34592e272d80ce949aa136a0e2556ada75a9798fe832d41e1d83
NEXTAUTH_URL=http://localhost:3000
```

### Step 5: Enable Authentication Providers

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** (should be enabled by default)
3. Enable **Google** and **Facebook**

#### For Google OAuth:

1. Go to https://console.cloud.google.com/
2. Create/select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`

#### For Facebook OAuth:

1. Go to https://developers.facebook.com/
2. Create/select an app
3. Add Facebook Login product
4. Add redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`

### Step 6: Test Your Setup

1. Restart your development server:

```bash
npm run dev
```

2. Try signing up with Google or Facebook
3. The DNS error should be gone!

## Quick Verification

After updating `.env`, check that:

- Your URL starts with `https://` and ends with `.supabase.co`
- Your anon key is a long JWT token starting with `eyJ`
- No placeholder text remains

## Need Help?

If you still get errors:

1. Check your `.env` file has the correct values
2. Verify your Supabase project is active
3. Make sure OAuth providers are enabled
4. Clear browser cache and try again

## Example of Correct .env

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123def456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyM2RlZjQ1NiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjgzNDUwMDAwLCJleHAiOjIwMDAwMDAwMDB9.signature
NEXTAUTH_SECRET=5b833301e58b34592e272d80ce949aa136a0e2556ada75a9798fe832d41e1d83
NEXTAUTH_URL=http://localhost:3000
```

---

**Once you update with real credentials, the DNS error will be fixed and OAuth will work!** 🎉</content>
<parameter name="filePath">c:\Users\ACER\Downloads\project-bolt-sb1-szbbipfv\project\FIX_DNS_ERROR.md
