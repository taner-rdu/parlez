import { getApiKey } from './auth'

export const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function authHeaders(): Record<string, string> {
  const key = getApiKey()
  return key ? { Authorization: `Bearer ${key}` } : {}
}
