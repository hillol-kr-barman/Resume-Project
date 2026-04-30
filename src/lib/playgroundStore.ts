import type { User } from '@supabase/supabase-js'
import type { AuthUser } from '@hillolbarman/ui'
import { supabase } from './supabaseClient'

export interface PlaygroundDocument {
  id: string
  title: string
  content: string
  language: string
  ownerId: string
  shareToken: string | null
  isShared: boolean
  createdAt: string
  updatedAt: string
}

interface DocumentRow {
  id: string
  title: string
  content: string
  language: string
  owner_id: string
  share_token: string | null
  is_shared: boolean
  created_at: string
  updated_at: string
}

function mapUser(user: User | null): AuthUser | null {
  if (!user) return null

  const fullName =
    (user.user_metadata?.['name'] as string | undefined) ||
    (user.user_metadata?.['full_name'] as string | undefined) ||
    user.email?.split('@')[0] ||
    'Mate'

  return { id: user.id, name: fullName, email: user.email ?? '' }
}

function mapDocument(row: DocumentRow | null): PlaygroundDocument | null {
  if (!row) return null

  return {
    id: row.id,
    title: row.title,
    content: row.content,
    language: row.language,
    ownerId: row.owner_id,
    shareToken: row.share_token,
    isShared: row.is_shared,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return mapUser(data.user)
}

export async function registerUser(data: { name: string; email: string; password: string }): Promise<AuthUser> {
  const { data: result, error } = await supabase.auth.signUp({
    email: data.email.trim().toLowerCase(),
    password: data.password,
    options: { data: { name: data.name.trim() } },
  })

  if (error) throw error
  if (!result.user) throw new Error('Could not create your account.')

  return mapUser(result.user) as AuthUser
}

export async function loginUser(credentials: { email: string; password: string }): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email.trim().toLowerCase(),
    password: credentials.password,
  })

  if (error) throw error
  return mapUser(data.user) as AuthUser
}

export async function requestPasswordReset(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    throw new Error('Enter your email address first.')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) throw error
}

export async function updatePassword(password: string): Promise<AuthUser> {
  const trimmedPassword = password.trim()

  if (trimmedPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.')
  }

  const { data, error } = await supabase.auth.updateUser({ password: trimmedPassword })

  if (error) throw error
  return mapUser(data.user) as AuthUser
}

export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function listDocumentsForUser(userId: string): Promise<PlaygroundDocument[]> {
  const { data, error } = await supabase
    .from('playground_documents')
    .select('id, title, content, language, owner_id, share_token, is_shared, created_at, updated_at')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => mapDocument(row as DocumentRow) as PlaygroundDocument)
}

export async function getDocumentByShareToken(shareToken: string): Promise<PlaygroundDocument | null> {
  if (!shareToken) return null

  const { data, error } = await supabase
    .from('playground_documents')
    .select('id, title, content, language, owner_id, share_token, is_shared, created_at, updated_at')
    .eq('share_token', shareToken)
    .eq('is_shared', true)
    .maybeSingle()

  if (error) throw error
  return mapDocument(data as DocumentRow | null)
}

interface SaveDocumentInput {
  id?: string | null
  title: string
  content: string
  language: string
  ownerId: string
  isShared?: boolean
}

export async function saveDocument(input: SaveDocumentInput): Promise<PlaygroundDocument> {
  if (!input.ownerId) {
    throw new Error('Please log in to save documents.')
  }

  const payload = {
    owner_id: input.ownerId,
    title: input.title.trim() || 'Untitled snippet',
    content: input.content,
    language: input.language,
    is_shared: input.isShared ?? false,
  }

  const query = input.id
    ? supabase.from('playground_documents').update(payload).eq('id', input.id)
    : supabase.from('playground_documents').insert(payload)

  const { data, error } = await query
    .select('id, title, content, language, owner_id, share_token, is_shared, created_at, updated_at')
    .single()

  if (error) throw error
  return mapDocument(data as DocumentRow) as PlaygroundDocument
}

export async function deleteDocument(id: string): Promise<void> {
  if (!id) throw new Error('Missing document id.')

  const { error } = await supabase.from('playground_documents').delete().eq('id', id)
  if (error) throw error
}

export async function deleteAllDocumentsForUser(ownerId: string): Promise<void> {
  if (!ownerId) throw new Error('Missing user id.')

  const { error } = await supabase.from('playground_documents').delete().eq('owner_id', ownerId)
  if (error) throw error
}
