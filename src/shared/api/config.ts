const DEFAULT_API_URL = 'https://ventiqapi-production.up.railway.app/v1'

export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL,
  useMock: import.meta.env.VITE_USE_MOCK_API === 'true',
}
