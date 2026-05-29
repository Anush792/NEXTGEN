# 🧪 Test Your Supabase Setup

After updating your `.env` file with real Supabase credentials, run this test:

```bash
# Test 1: Check if Supabase connection works
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Connection test: OK');
"
```

```bash
# Test 2: Start your dev server
npm run dev
```

```bash
# Test 3: Check if auth works
curl -X GET http://localhost:3000/api/test-supabase
```

## Expected Results

- **Test 1**: Should show your real Supabase URL and "Connection test: OK"
- **Test 2**: Server should start without errors
- **Test 3**: Should return Supabase connection status

## If Tests Fail

1. **"Invalid URL"**: Your NEXT_PUBLIC_SUPABASE_URL is still placeholder
2. **"Connection failed"**: Check your anon key
3. **Server won't start**: Check for syntax errors

## OAuth Testing

Once server starts:

1. Go to http://localhost:3000/signin
2. Click "Continue with Google" or "Continue with Facebook"
3. Should redirect to OAuth provider (no DNS error)
4. After auth, should redirect back to your app

## Common Issues

### Still getting DNS error?

- Your `.env` file still has placeholder values
- Restart your dev server after changing `.env`
- Clear browser cache

### OAuth redirect fails?

- Check OAuth provider configuration in Supabase
- Verify redirect URIs match your domain
- Make sure providers are enabled

### Auth doesn't work?

- Check Supabase dashboard for auth logs
- Verify email confirmation settings
- Check browser console for errors

---

**Remember: The DNS error will only be fixed with real Supabase credentials!**</content>
<parameter name="filePath">c:\Users\ACER\Downloads\project-bolt-sb1-szbbipfv\project\TEST_SUPABASE_SETUP.md
