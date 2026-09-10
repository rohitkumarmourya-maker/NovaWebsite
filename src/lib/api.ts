/** Shared JSON/multipart client. No SMTP configuration is exposed to the browser. */
const apiBase = ((import.meta.env.VITE_API_BASE as string | undefined) ?? '').replace(/\/+$/, '')
export type ApiOk = { ok: true; reference: string; delivery?: 'accepted' | 'preview'; acknowledgement?: 'sent' | 'disabled' | 'failed' }
export type ApiFail = { ok: false; error: string; fields?: Record<string, string> }
export type ApiResult = ApiOk | ApiFail

export class ApiUnavailableError extends Error {
  constructor(message = 'The online service is not reachable. Your details are still on this page.') { super(message); this.name = 'ApiUnavailableError' }
}

async function post(path: string, body: FormData | string, headers?: Record<string, string>): Promise<ApiResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 65_000)
  try {
    const response = await fetch(`${apiBase}${path}`, { method: 'POST', body, headers: { Accept: 'application/json', ...headers }, credentials: 'omit', signal: controller.signal })
    if (response.status === 413) return { ok: false, error: 'The upload is too large. Keep all attachments combined under 4 MB.' }
    if (response.status === 429) return { ok: false, error: 'Too many submissions. Please wait before trying again.' }
    if (!(response.headers.get('content-type') ?? '').includes('application/json')) throw new ApiUnavailableError()
    const data: unknown = await response.json()
    if (!data || typeof data !== 'object' || !('ok' in data)) throw new ApiUnavailableError()
    if (response.ok && data.ok === true && 'reference' in data && typeof data.reference === 'string') return data as ApiOk
    if (data.ok === false && 'error' in data && typeof data.error === 'string') return data as ApiFail
    throw new ApiUnavailableError()
  } catch (error) {
    if (error instanceof ApiUnavailableError) throw error
    throw new ApiUnavailableError(controller.signal.aborted ? 'The request timed out before delivery could be confirmed. Your details are still on this page; check for a confirmation before retrying.' : undefined)
  } finally { clearTimeout(timer) }
}

export const submitApplication = (form: FormData) => post('/api/apply', form)
export const submitEnquiry = (payload: Record<string, string | number>) => post('/api/contact', JSON.stringify(payload), { 'Content-Type': 'application/json' })
