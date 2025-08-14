// Temporary script to fix RLS policies
import { supabase } from '../lib/supabase';

async function fixRLSPolicies() {
  console.log('Testing Supabase connection and checking RLS policies...');
  
  // First, test if we can connect and query
  console.log('\n1. Testing basic connection...');
  const { data: testData, error: testError } = await supabase
    .from('generated_content')
    .select('id, status, created_at')
    .limit(5);
  
  if (testError) {
    console.error('Connection test failed:', testError);
    console.error('Error details:', testError.message);
    console.error('Error hint:', (testError as any).hint);
    console.error('Error code:', (testError as any).code);
  } else {
    console.log('Connection successful! Found', testData?.length || 0, 'items');
    if (testData && testData.length > 0) {
      console.log('Sample statuses:', testData.map(d => d.status));
    }
  }
  
  // Test specifically for admin_approved content
  console.log('\n2. Testing admin_approved query...');
  const { data: adminApproved, error: adminError } = await supabase
    .from('generated_content')
    .select('*')
    .eq('status', 'admin_approved');
  
  if (adminError) {
    console.error('Admin approved query failed:', adminError);
    console.error('Error details:', adminError.message);
  } else {
    console.log('Admin approved query successful!');
    console.log('Found', adminApproved?.length || 0, 'admin-approved items');
    if (adminApproved && adminApproved.length > 0) {
      console.log('First admin-approved item:', {
        id: adminApproved[0].id,
        status: adminApproved[0].status,
        content_preview: adminApproved[0].content_text?.substring(0, 100) + '...'
      });
    }
  }
  
  // Test all statuses to understand what's in the database
  console.log('\n3. Checking all content statuses...');
  const { data: allContent, error: allError } = await supabase
    .from('generated_content')
    .select('status')
    .order('created_at', { ascending: false });
  
  if (allError) {
    console.error('All content query failed:', allError);
  } else {
    const statusCounts: Record<string, number> = {};
    allContent?.forEach(item => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });
    console.log('Content by status:', statusCounts);
  }
  
  // Test authentication status
  console.log('\n4. Checking authentication status...');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error('Auth check failed:', authError);
  } else if (user) {
    console.log('Authenticated as:', user.email);
    console.log('User ID:', user.id);
  } else {
    console.log('Not authenticated - using anonymous access');
  }
}

// Run the fix
fixRLSPolicies().catch(console.error);