import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getSessionId() {
  let sessionId = localStorage.getItem('thinkbig_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('thinkbig_session_id', sessionId)
  }
  return sessionId
}
