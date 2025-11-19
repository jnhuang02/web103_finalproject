const API = import.meta.env.VITE_API_BASE

// Store user in localStorage for simplicity
const USER_KEY = 'eventful_user'

export async function verifyGoogleToken(token) {
  const res = await fetch(`${API}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  })
  
  if (!res.ok) throw new Error('Token verification failed')
  const user = await res.json()
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function getCurrentUser() {
  const stored = localStorage.getItem(USER_KEY)
  return stored ? JSON.parse(stored) : null
}

export function logout() {
  localStorage.removeItem(USER_KEY)
}
