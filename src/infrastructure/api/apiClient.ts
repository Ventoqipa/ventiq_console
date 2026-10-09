import { apiConfig } from '../../shared/api/config'

export class ApiClient {
  private static getBaseUrl(): string {
    return apiConfig.baseUrl
  }

  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('ventiq_auth_token')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    }

    const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      // Clear expired/invalid session
      localStorage.removeItem('ventiq_auth_token')
    }

    if (!response.ok) {
      let errorMessage = `API Error ${response.status}: ${response.statusText}`
      try {
        const errorData = await response.json()
        if (errorData?.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : errorData.message
        }
      } catch {
        // In case the response is not valid JSON
      }
      throw new Error(errorMessage)
    }

    // If the response has no content (e.g., 204 No Content)
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  static get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  static post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  static patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  static delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}