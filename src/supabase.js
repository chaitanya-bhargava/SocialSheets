import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASEURL;
const supabaseKey = process.env.REACT_APP_SUPABASEKEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase configuration. Set REACT_APP_SUPABASEURL and REACT_APP_SUPABASEKEY in your .env file.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;