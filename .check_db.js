const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDB() {
  const labDivUserId = '1a8d1b11-d1b1-4f11-9a11-1a8d1b11d1b1';
  
  console.log('Fixing media_url for LabDiv posts...');
  
  const { data, error } = await supabase
    .from('submissions')
    .update({ media_url: '/labdiv-logo.png' })
    .eq('user_id', labDivUserId)
    .like('media_url', 'https://sites.google.com/%');
    
  if (error) {
    console.error('Error updating posts:', error);
  } else {
    console.log('Posts fixed successfully!');
    
    // verify
    const { data: posts } = await supabase
      .from('submissions')
      .select('title, media_url')
      .eq('user_id', labDivUserId);
      
    console.log(posts);
  }
}

fixDB();
