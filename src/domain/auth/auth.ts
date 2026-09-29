export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'VENTOQIPA_ADMIN'
}

export interface AuthSession {
  token: string
  user: AuthUser
}