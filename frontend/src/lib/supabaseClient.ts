import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
) as string

function createSessionStorageAdapter() {
  return {
    getItem: (key: string) => window.sessionStorage.getItem(key),
    setItem: (key: string, value: string) => window.sessionStorage.setItem(key, value),
    removeItem: (key: string) => window.sessionStorage.removeItem(key),
  }
}

function clearLegacyLocalStorage() {
  window.localStorage.removeItem('resume-users')
  window.localStorage.removeItem('resume-session')
  window.localStorage.removeItem('resume-playground-documents')
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing.')
}

clearLegacyLocalStorage()

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'resume-supabase-auth',
    storage: createSessionStorageAdapter(),
  },
})
