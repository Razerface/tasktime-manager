import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = 'https://izrxxmzdmqfvhujuyfss.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cnh4bXpkbXFmdmh1anV5ZnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNTY0MzksImV4cCI6MjA0NzgzMjQzOX0._O9mbuEJNfbo__cqTUYGsrQBj3XQ_hY-lWyFVcPj2jI'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)