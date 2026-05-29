# 🔑 Admin Setup Complete

## Admin Credentials

- **Email**: anushgiri110@gmail.com
- **Password**: Password

## Setup Steps (Do This First!)

### 1. Get Real Supabase Credentials

Follow `FIX_DNS_ERROR.md` to set up your Supabase project and get real credentials.

### 2. Create Admin User

Run the admin creation script:

```bash
# Option 1: Run the script directly
node create-admin.js

# Option 2: Manual command
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.auth.signUp({ email: 'anushgiri110@gmail.com', password: 'Password' }).then(console.log);
"
```

### 3. Configure Supabase (Optional)

- Go to Supabase Dashboard → Authentication → Settings
- Disable email confirmation for easier development
- Add redirect URL: `http://localhost:3000/admin/dashboard`

### 4. Test Login

1. Start server: `npm run dev`
2. Go to: `http://localhost:3000/admin/login`
3. Login with the credentials above

## Security Notes

⚠️ **Important**: The password "Password" is very weak for production!

- For development: It's fine
- For production: Change to a strong password with uppercase, lowercase, numbers, and symbols

## Troubleshooting

### "DNS error" or "can't reach page"

- You haven't set up real Supabase credentials yet
- Follow `FIX_DNS_ERROR.md` first

### "Invalid credentials"

- Make sure you ran the admin creation script
- Check if email confirmation is required

### "Email not confirmed"

- Check anushgiri110@gmail.com for confirmation email
- Or disable email confirmation in Supabase settings

---

**Once you complete the setup steps, your admin login will work perfectly!** 🎉</content>
<parameter name="filePath">c:\Users\ACER\Downloads\project-bolt-sb1-szbbipfv\project\ADMIN_SETUP.md
