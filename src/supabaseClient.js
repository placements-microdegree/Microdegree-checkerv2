import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zcthupxqotcgbsztzivn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdGh1cHhxb3RjZ2JzenR6aXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjQ2ODAsImV4cCI6MjA2NDQ0MDY4MH0.BHJ_5yN7ov9IdY572yNmXBnWACd9BNyEDcLEWDZ9FDY';

export const supabase = createClient(supabaseUrl, supabaseKey)