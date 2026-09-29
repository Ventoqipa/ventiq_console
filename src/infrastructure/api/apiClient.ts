const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/v1'

export class ApiClient {
  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('ventiq_auth_token')
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })

    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }
}