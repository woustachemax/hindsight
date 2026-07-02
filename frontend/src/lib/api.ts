const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const ACCESS_TOKEN_KEY = 'auth_token'

export function getToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const url = `${BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (typeof body.detail === 'string') {
        message = body.detail
      } else if (Array.isArray(body.detail)) {
        message = body.detail.map((e: { msg: string }) => e.msg).join(', ')
      }
    } catch {
      void 0
    }
    throw new Error(message)
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

export type AuthUser = {
  id: string
  email: string
  username: string
}

export async function login(
  email: string,
  password: string
): Promise<AuthUser> {
  const data = await apiRequest<AuthUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return data
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthUser> {
  const data = await apiRequest<AuthUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: username, email, password }),
  })
  return data
}

export async function me(): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/me')
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST' })
  } finally {
    clearToken()
  }
}