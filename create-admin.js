const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createAdmin() {
  try {
    console.log('🚀 Creating admin user: anushgiri110@gmail.com');

    // Check if we have real credentials
    if (process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id') ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-anon-key')) {
      console.error('❌ ERROR: You are still using placeholder Supabase credentials!');
      console.error('📖 Please follow FIX_DNS_ERROR.md to set up real Supabase credentials first.');
      console.error('🔗 Go to: https://supabase.com/dashboard');
      return;
    }

    console.log('🔍 Checking Supabase connection...');

    // Test connection first
    const { data: testData, error: testError } = await supabase.from('order_submissions').select('count', { count: 'exact', head: true });

    if (testError && !testError.message.includes('relation "public.order_submissions" does not exist')) {
      console.error('❌ Supabase connection failed:', testError.message);
      console.error('🔧 Check your .env file has correct credentials');
      return;
    }

    console.log('✅ Supabase connection OK');

    const { data, error } = await supabase.auth.signUp({
      email: 'anushgiri110@gmail.com',
      password: 'Password'
    });

    if (error) {
      console.error('❌ Error creating admin:', error.message);

      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        console.log('ℹ️  User already exists!');
        console.log('🔑 Try logging in with:');
        console.log('   Email: anushgiri110@gmail.com');
        console.log('   Password: Password');
        console.log('📧 If email confirmation is required, check your email inbox.');
        return;
      }

      if (error.message.includes('Password should be at least')) {
        console.log('ℹ️  Password policy too strict. Try a stronger password or adjust Supabase auth settings.');
        return;
      }

      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', data.user?.email);
    console.log('🆔 User ID:', data.user?.id);

    if (!data.user?.email_confirmed_at) {
      console.log('📧 Email confirmation required!');
      console.log('   📬 Check anushgiri110@gmail.com and click the confirmation link');
      console.log('   ⚙️  Or disable email confirmation in Supabase dashboard → Authentication → Settings');
    } else {
      console.log('✅ Email already confirmed - you can login immediately!');
    }

    console.log('\n🔑 Admin Login Credentials:');
    console.log('   Email: anushgiri110@gmail.com');
    console.log('   Password: Password');
    console.log('\n🌐 Login URL: http://localhost:3000/admin/login');
    console.log('\n🎉 Setup complete! You can now login as admin.');

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.error('🔧 Make sure:');
    console.error('   1. Your .env file has real Supabase credentials');
    console.error('   2. You have internet connection');
    console.error('   3. Supabase project is active');
  }
}

createAdmin();</content>
<parameter name="filePath">c:\Users\ACER\Downloads\project-bolt-sb1-szbbipfv\project\create-admin.js