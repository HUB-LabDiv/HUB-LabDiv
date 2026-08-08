const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.bqszadfunqgtfpaorwvx:[Arc@no-390r]@aws-0-us-west-2.pooler.supabase.com:6543/postgres'
});

async function run() {
  await client.connect();
  try {
    const res = await client.query(`SELECT id, email, confirmation_token FROM auth.users WHERE confirmation_token IS NULL OR recovery_token IS NULL OR encrypted_password IS NULL`);
    console.log("Users with NULLs:", res.rows);
    
    // Fix them
    await client.query(`
      UPDATE auth.users SET confirmation_token = '' WHERE confirmation_token IS NULL;
      UPDATE auth.users SET recovery_token = '' WHERE recovery_token IS NULL;
      UPDATE auth.users SET email_change_token_new = '' WHERE email_change_token_new IS NULL;
      UPDATE auth.users SET email_change_token_current = '' WHERE email_change_token_current IS NULL;
      UPDATE auth.users SET encrypted_password = '' WHERE encrypted_password IS NULL;
      UPDATE auth.users SET phone_change_token = '' WHERE phone_change_token IS NULL;
    `);
    console.log("Fixed NULLs in auth.users");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();
