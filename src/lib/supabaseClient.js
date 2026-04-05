import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY

function createSessionStorageAdapter() {
  return {
    getItem(key) {
      return window.sessionStorage.getItem(key)
    },
    setItem(key, value) {
      window.sessionStorage.setItem(key, value)
    },
    removeItem(key) {
      window.sessionStorage.removeItem(key)
    },
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
