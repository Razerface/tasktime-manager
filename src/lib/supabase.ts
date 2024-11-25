import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = 'https://izrxxmzdmqfvhujuyfss.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase anon key not found. Please set VITE_SUPABASE_ANON_KEY environment variable.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)