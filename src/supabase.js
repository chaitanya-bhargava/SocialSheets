import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-ref.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);