import { createContext } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void
}

export const ToastContext = createContext<ToastContextData | undefined>(undefined)