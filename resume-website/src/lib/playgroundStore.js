const USERS_KEY = 'resume-users'
const SESSION_KEY = 'resume-session'
const DOCUMENTS_KEY = 'resume-playground-documents'
const TEMP_DOCUMENT_TTL_MS = 1000 * 60 * 60 * 24

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function cleanupExpiredDocuments(documents) {
  const now = Date.now()
  return documents.filter((document) => {
    if (!document.expiresAt) return true
    return document.expiresAt > now
  })
}

export function getCurrentUser() {
  return readJson(SESSION_KEY, null)
}

export function registerUser({ name, email, password }) {
  const users = readJson(USERS_KEY, [])
  const normalizedEmail = email.trim().toLowerCase()
  const existingUser = users.find((user) => user.email === normalizedEmail)

  if (existingUser) {
    throw new Error('An account with that email already exists.')
  }

  const user = {
    id: createId('user'),
    name: name.trim(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  }

  const nextUsers = [...users, user]
  writeJson(USERS_KEY, nextUsers)
  writeJson(SESSION_KEY, { id: user.id, name: user.name, email: user.email })
  return { id: user.id, name: user.name, email: user.email }
}

export function loginUser({ email, password }) {
  const users = readJson(USERS_KEY, [])
  const normalizedEmail = email.trim().toLowerCase()
  const user = users.find((item) => item.email === normalizedEmail && item.password === password)

  if (!user) {
    throw new Error('Invalid email or password.')
  }

  const sessionUser = { id: user.id, name: user.name, email: user.email }
  writeJson(SESSION_KEY, sessionUser)
  return sessionUser
}

export function logoutUser() {
  window.localStorage.removeItem(SESSION_KEY)
}

export function getDocuments() {
  const documents = cleanupExpiredDocuments(readJson(DOCUMENTS_KEY, []))
  writeJson(DOCUMENTS_KEY, documents)
  return documents
}

export function listDocumentsForUser(userId) {
  return getDocuments()
    .filter((document) => document.ownerId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function listTemporaryDocuments() {
  return getDocuments()
    .filter((document) => !document.ownerId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function getDocumentById(documentId) {
  return getDocuments().find((document) => document.id === documentId) ?? null
}

export function getDocumentByShareToken(shareToken) {
  if (!shareToken) return null
  return getDocuments().find((document) => document.shareToken === shareToken) ?? null
}

export function saveDocument({ id, title, content, language, ownerId, shareToken }) {
  const documents = getDocuments()
  const now = new Date().toISOString()
  const documentId = id ?? createId('doc')
  const existingDocument = documents.find((document) => document.id === documentId)

  const document = {
    id: documentId,
    title: title.trim() || 'Untitled snippet',
    content,
    language,
    ownerId: ownerId ?? null,
    shareToken: shareToken ?? existingDocument?.shareToken ?? createId('share'),
    createdAt: existingDocument?.createdAt ?? now,
    updatedAt: now,
    expiresAt: ownerId ? null : new Date(Date.now() + TEMP_DOCUMENT_TTL_MS).toISOString(),
  }

  const nextDocuments = existingDocument
    ? documents.map((item) => (item.id === documentId ? document : item))
    : [document, ...documents]

  writeJson(DOCUMENTS_KEY, nextDocuments)
  return document
}
