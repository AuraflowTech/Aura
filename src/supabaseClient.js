import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fssbxucvfyaxuchayzox.supabase.co'
const supabaseAnonKey = 'sb_publishable_uWrUJxw4nFQpkO7aduvkFg_YNTbOinI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true, // Tohle musí být true!
      autoRefreshToken: true,
    }
  })