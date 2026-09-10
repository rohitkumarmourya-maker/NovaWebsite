import { useState } from 'react'
import { ToastContext, type ToastMessage } from '../lib/toast'
import type { ReactNode } from 'react'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  return (
    <ToastContext.Provider value={(message, kind) => setToast({ message, kind })}>
      {children}
      <div className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-xl" aria-live="polite" aria-atomic="true">
        {toast && (
          <div role={toast.kind === 'error' ? 'alert' : 'status'} className={`flex items-start gap-4 rounded-2xl border p-5 shadow-lift ${toast.kind === 'error' ? 'border-danger-600 bg-danger-50 text-danger-700' : 'border-success-600 bg-success-50 text-success-700'}`}>
            <p className="flex-1 text-small font-semibold">{toast.message}</p>
            <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification" className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-h3 hover:bg-black/5">×</button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}
