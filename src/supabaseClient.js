import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rpcjvkycygcjbcwenbtn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwY2p2a3ljeWdjamJjd2VuYnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NjkxMjMsImV4cCI6MjA0MjI0NTEyM30.tqP2_SbaAzElL_gJ6Jf9QWkvsBVklNhuiyeGCL0fYRo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Add a simple test function
export async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('events').select('count', { count: 'exact' });
        if (error) throw error;
        console.log('Supabase connection successful', data);
        return true;
    } catch (err) {
        console.error('Supabase connection error:', err);
        return false;
    }
}