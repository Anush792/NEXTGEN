# Authentication Setup Guide

This guide explains how to set up email authentication and OAuth providers (Google & Facebook) for your Next.js application using Supabase.

## Prerequisites

- A Supabase project
- Google OAuth credentials (for Google sign-in)
- Facebook App credentials (for Facebook sign-in)

## Supabase Configuration

### 1. Enable Authentication Providers

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication > Providers**
4. Enable the following providers:

#### Email Authentication

- **Email**: Already enabled by default
- Configure email templates if needed

#### Google OAuth

1. Click on **Google** in the providers list
2. Toggle **Enable sign in with Google**
3. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Add authorized redirect URIs in Google Cloud Console:
   - `https://your-project.supabase.co/auth/v1/callback`

#### Facebook OAuth

1. Click on **Facebook** in the providers list
2. Toggle **Enable sign in with Facebook**
3. Enter your Facebook App credentials:
   - **App ID**: From Facebook Developers
   - **App Secret**: From Facebook Developers
4. Configure OAuth redirect URIs in Facebook:
   - `https://your-project.supabase.co/auth/v1/callback`

### 2. Configure Site URL

In **Authentication > Settings**:

- **Site URL**: Set to your production domain (e.g., `https://yourdomain.com`)
- **Redirect URLs**: Add your app's URLs for OAuth redirects

## Environment Variables

Ensure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add Facebook Login product
4. Configure OAuth redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
5. Get App ID and App Secret

## Testing Authentication

### Admin Authentication

- Admin users can sign in with email/password
- Create admin users in Supabase Auth dashboard or programmatically

### Student Authentication

- Students can sign in with:
  - Email and password
  - Google account
  - Facebook account
- New users can sign up via email

## Security Notes

- Admin authentication is separate from student authentication
- Consider implementing role-based access control for admin users
- Use Row Level Security (RLS) in Supabase for data access control
- Regularly rotate API keys and secrets

## Troubleshooting

### Common Issues

1. **OAuth redirect errors**: Check that redirect URIs are correctly configured in both Supabase and the OAuth provider
2. **Email not received**: Check Supabase email settings and spam folder
3. **Session not persisting**: Ensure cookies are enabled and domain settings are correct

### Debug Mode

Enable debug logging in Supabase dashboard under **Settings > API** to troubleshoot auth issues.</content>
<parameter name="filePath">c:\Users\ACER\Downloads\project-bolt-sb1-szbbipfv\project\AUTHENTICATION_SETUP.md
