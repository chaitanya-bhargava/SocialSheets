import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zwbriswstaddmusjunqb.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3YnJpc3dzdGFkZG11c2p1bnFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDc3ODM4NiwiZXhwIjoyMDQwMzU0Mzg2fQ.U3dICm3TzHqfntG47o8P9G-w7lcLI8MX3vTKm78vIng';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;