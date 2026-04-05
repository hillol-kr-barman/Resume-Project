import { supabase } from './supabaseClient'

function mapUser(user) {
  if (!user) return null

  const fullName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Mate'

  return {
    id: user.id,
    name: fullName,
    email: user.email ?? '',
  }
}

function mapDocument(row) {
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

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return mapUser(data.user)
}

export async function registerUser({ name, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        name: name.trim(),
      },
    },
  })

  if (error) {
    throw error
  }

  if (!data.user) {
    throw new Error('Could not create your account.')
  }

  return mapUser(data.user)
}

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (error) {
    throw error
  }

  return mapUser(data.user)
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function listDocumentsForUser(userId) {
  const { data, error } = await supabase
    .from('playground_documents')
    .select('id, title, content, language, owner_id, share_token, is_shared, created_at, updated_at')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map(mapDocument)
}

export async function getDocumentByShareToken(shareToken) {
  if (!shareToken) return null

  const { data, error } = await supabase
    .from('playground_documents')
    .select('id, title, content, language, owner_id, share_token, is_shared, created_at, updated_at')
    .eq('share_token', shareToken)
    .eq('is_shared', true)
    .maybeSingle()

  if (error) {
    throw error
  }

  return mapDocument(data)
}

export async function saveDocument({ id, title, content, language, ownerId, isShared = false }) {
  if (!ownerId) {
    throw new Error('Please log in to save documents.')
  }

  const payload = {
    owner_id: ownerId,
    title: title.trim() || 'Untitled snippet',
    content,
    language,
    is_shared: isShared,
  }

  const query = id
    ? supabase
        .from('playground_documents')
        .update(payload)
        .eq('id', id)
    : supabase
        .from('playground_documents')
        .insert(payload)

  const { data, error } = await query
    .select('id, title, content, language, owner_id, share_token, is_shared, created_at, updated_at')
    .single()

  if (error) {
    throw error
  }

  return mapDocument(data)
}
