const DEFAULT_API_URL = 'http://localhost:8080/v1'

export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL,
}
