# 🔑 Create Admin User: anushgiri110@gmail.com

## Prerequisites

You must have real Supabase credentials set up first! If you still see placeholder values in your `.env` file, complete the setup in `FIX_DNS_ERROR.md` first.

## Step 1: Create Admin User Script

Run this command to create your admin user:

```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createAdmin() {
  try {
    console.log('Creating admin user: anushgiri110@gmail.com');

    const { data, error } = await supabase.auth.signUp({
      email: 'anushgiri110@gmail.com',
      password: 'Password'
    });

    if (error) {
      console.error('Error creating admin:', error.message);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
    console.log('Email confirmation required:', !data.user?.email_confirmed_at);

    // If email confirmation is required, you'll need to confirm the email
    if (!data.user?.email_confirmed_at) {
      console.log('📧 Check your email and click the confirmation link');
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createAdmin();
"
```

## Step 2: Verify Admin User

After creating the admin user, you can verify it exists:

```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAdmin() {
  try {
    const { data, error } = await supabase.auth.getUser();
    console.log('Current user:', data.user?.email || 'No user logged in');

    // List all users (requires service role key - admin only)
    console.log('Note: To list all users, you need the service role key from Supabase dashboard');
  } catch (err) {
    console.error('Error:', err);
  }
}

checkAdmin();
"
```

## Step 3: Configure Supabase Auth Settings

In your Supabase dashboard:

1. Go to **Authentication** → **Settings**
2. Configure:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/admin/dashboard`
   - **Enable email confirmations**: Choose your preference
   - **Enable email change confirmations**: Optional

## Step 4: Test Admin Login

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/admin/login`
3. Login with:
   - Email: `anushgiri110@gmail.com`
   - Password: `Password`

## Important Notes

### Password Strength

The password "Password" is very weak! For production, use a strong password with:

- At least 8 characters
- Uppercase and lowercase letters
- Numbers and symbols

### Email Confirmation

Depending on your Supabase settings:

- You may need to confirm the email before login works
- Check your email (anushgiri110@gmail.com) for confirmation link
- Or disable email confirmation in Supabase settings for development

### Admin vs Regular Users

Currently, all authenticated users can access the admin dashboard. For production, you should:

- Add role-based access control
- Create an `admin_users` table in Supabase
- Check user roles before allowing admin access

## Troubleshooting

### "User already exists"

If you get this error, the email is already registered. Try logging in instead.

### "Email not confirmed"

Go to Supabase dashboard → Authentication → Settings → disable email confirmation for development.

### "Invalid credentials"

Double-check your `.env` file has real Supabase credentials, not placeholders.

---

**Once you have real Supabase credentials, run the script above to create your admin user!** 🎉</content>
<parameter name="filePath">c:\Users\ACER\Downloads\project-bolt-sb1-szbbipfv\project\CREATE_ADMIN_USER.md
