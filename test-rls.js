// Test RLS policies with direct Supabase connection
const { createClient } = require('@supabase/supabase-js');

// Use the actual credentials
const supabaseUrl = 'https://ifwscuvbtdokljwwbvex.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmd3NjdXZidGRva2xqd3didmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMDI0NDMsImV4cCI6MjA3MDU3ODQ0M30.QzxtYT8nbLPx9T3-PLABLXx7XtkjAg77ffUlghnQ0Xc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRLS() {
  console.log('🔍 Testing Supabase RLS Policies for User Portal\n');
  console.log('================================');
  
  // Test 1: Basic connection
  console.log('\n📌 Test 1: Basic Connection');
  const { data: testData, error: testError } = await supabase
    .from('generated_content')
    .select('id, status, created_at')
    .limit(5);
  
  if (testError) {
    console.error('❌ Connection failed:', testError.message);
    console.error('   Error code:', testError.code);
    console.error('   Error hint:', testError.hint);
  } else {
    console.log('✅ Connection successful!');
    console.log('   Found', testData?.length || 0, 'items');
    if (testData && testData.length > 0) {
      console.log('   Statuses:', testData.map(d => d.status).join(', '));
    }
  }
  
  // Test 2: Admin approved content
  console.log('\n📌 Test 2: Admin Approved Content');
  const { data: adminApproved, error: adminError } = await supabase
    .from('generated_content')
    .select('id, status, content_text, created_at')
    .eq('status', 'admin_approved')
    .order('created_at', { ascending: false });
  
  if (adminError) {
    console.error('❌ Admin approved query failed:', adminError.message);
    console.error('   This is the critical issue - User Portal cannot see admin_approved content!');
  } else {
    console.log('✅ Admin approved query successful!');
    console.log('   Found', adminApproved?.length || 0, 'admin-approved items');
    if (adminApproved && adminApproved.length > 0) {
      console.log('   Latest admin-approved content:');
      adminApproved.slice(0, 3).forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.content_text?.substring(0, 50)}...`);
      });
    } else {
      console.log('   ⚠️  No admin-approved content found - might need to approve some in Admin Portal first');
    }
  }
  
  // Test 3: All statuses count
  console.log('\n📌 Test 3: Content Status Distribution');
  const { data: allContent, error: allError } = await supabase
    .from('generated_content')
    .select('status');
  
  if (allError) {
    console.error('❌ Status query failed:', allError.message);
  } else {
    const statusCounts = {};
    allContent?.forEach(item => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });
    console.log('✅ Content by status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
  }
  
  // Test 4: Authentication
  console.log('\n📌 Test 4: Authentication Status');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error('❌ Auth check failed:', authError.message);
  } else if (user) {
    console.log('✅ Authenticated as:', user.email);
    console.log('   User ID:', user.id);
  } else {
    console.log('⚠️  Not authenticated - using anonymous access');
    console.log('   This might be why content is not showing!');
  }
  
  console.log('\n================================');
  console.log('🎯 Summary:');
  console.log('If admin_approved content is not showing, the issue is likely:');
  console.log('1. RLS policies blocking anonymous access');
  console.log('2. User not authenticated in the User Portal');
  console.log('3. No content with admin_approved status exists');
  console.log('\nNext step: Apply the RLS policy fix SQL script in Supabase dashboard');
}

testRLS().catch(console.error);