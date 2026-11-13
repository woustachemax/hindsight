// Local, backend-free auth. Session state lives in localStorage so the
// existing login/register/me/logout call sites keep working without a server.
// Swap these implementations for real network calls once a backend exists.

const SESSION_KEY = 'hindsight_session'

export type AuthUser = {
  id: string
  email: string
  username: string
}

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function writeSession(user: AuthUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function validate(email: string, password: string): void {
  if (!email.trim() || !password) {
    throw new Error('email and password are required')
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthUser> {
  validate(email, password)
  const existing = readSession()
  const user: AuthUser =
    existing && existing.email === email
      ? existing
      : { id: crypto.randomUUID(), email, username: email.split('@')[0] }
  writeSession(user)
  return user
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthUser> {
  validate(email, password)
  if (!username.trim()) throw new Error('username is required')
  const user: AuthUser = { id: crypto.randomUUID(), email, username }
  writeSession(user)
  return user
}

export async function me(): Promise<AuthUser> {
  const user = readSession()
  if (!user) throw new Error('not signed in')
  return user
}

export async function logout(): Promise<void> {
  localStorage.removeItem(SESSION_KEY)
}
