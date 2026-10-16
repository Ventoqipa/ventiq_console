export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: string
  customerId?: string
}

export interface AuthSession {
  accessToken: string
  tokenType: string
  expiresIn: string
  user: AuthUser
}