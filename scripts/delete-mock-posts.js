const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Deleting all mock posts...");

  // We delete based on the mock user ID or the mock author name
  const { data, error } = await supabase
    .from('submissions')
    .delete()
    .ilike("title", "%Manifesto da Comunicação Científica Aberta%")
    .select('id, title');

  if (error) {
    console.error("Error deleting mock posts:", error);
  } else {
    console.log(`Successfully deleted ${data.length} mock post(s).`);
    data.forEach(p => console.log(` - ${p.title}`));
  }
}

run();
