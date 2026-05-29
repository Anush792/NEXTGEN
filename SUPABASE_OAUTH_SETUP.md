# 🚀 Supabase OAuth Setup Guide (Google + Facebook)

## Prerequisites

1. Supabase project created (keys already in `.env.local`)
2. Google Cloud Console project
3. Facebook Developer account

## 1. Supabase Dashboard Setup

### Enable Providers

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → **Authentication** → **Providers**
2. **Google**:
   - Toggle **Enabled**
   - Client ID: `YOUR_GOOGLE_CLIENT_ID.googleusercontent.com`
   - Secret: `YOUR_GOOGLE_CLIENT_SECRET`
3. **Facebook**:
   - Toggle **Enabled**
   - Client ID: `YOUR_FACEBOOK_APP_ID`
   - Secret: `YOUR_FACEBOOK_APP_SECRET`

### Set Redirect URLs

**Additional Redirect URLs** (separate by commas):

```
http://localhost:3000/api/auth/google/callback
http://localhost:3000/api/auth/facebook/callback
http://localhost:3000/api/auth/callback
https://yourdomain.com/api/auth/google/callback
https://yourdomain.com/api/auth/facebook/callback
https://yourdomain.com/api/auth/callback
```

### Save & Test

✅ Providers turn green when configured correctly.

## 2. Google OAuth Setup

1. [Google Cloud Console](https://console.cloud.google.com/) → New Project
2. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
   - Application type: **Web application**
   - Authorized redirect URIs: (same as Supabase)
3. Copy **Client ID** & **Client Secret** to Supabase

## 3. Facebook OAuth Setup

1. [Facebook Developers](https://developers.facebook.com/) → **My Apps** → Create App → **Consumer**
2. **Facebook Login** → **Settings**:
   - Valid OAuth Redirect URIs: (same as above)
3. **Basic Settings** → Copy **App ID** & **App Secret** to Supabase

## 4. Environment Variables

Add to `.env.local` (Supabase keys already present):

```
NEXT_PUBLIC_SUPABASE_URL=your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 5. Test Implementation

```bash
npm run dev
```

1. Go to `/signin`
2. Click **Continue with Google** → Supabase → Google → Redirect to `/student/dashboard`
3. **Success**: See your name/email/avatar + courses
4. Logout → Sign in with Facebook

## Troubleshooting

| Issue             | Fix                                      |
| ----------------- | ---------------------------------------- |
| `invalid_request` | Check redirect URLs match exactly        |
| Blank screen      | Check browser console + Supabase logs    |
| No session        | Verify env vars, restart dev server      |
| CORS              | Add domains to Supabase → Settings → API |

## Production Deployment

1. Update redirect URLs with production domain
2. Set env vars in hosting platform (Vercel/Netlify)
3. ✅ Supabase auto-handles scaling

**Done!** Your social login is production-ready.

**Next**: Update TODO.md after testing.
