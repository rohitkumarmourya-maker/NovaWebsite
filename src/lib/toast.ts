import { createContext, useContext } from 'react'

export type ToastMessage = { message: string; kind: 'success' | 'error' }
export const ToastContext = createContext<(message: string, kind: ToastMessage['kind']) => void>(() => {})
export const useToast = () => useContext(ToastContext)
