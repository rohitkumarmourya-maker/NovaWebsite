/**
 * Thin client for the form API (server/). All requests are same-origin by default; set
 * VITE_API_BASE at build time when the API lives on another domain.
 */
const apiBase = ((import.meta.env.VITE_API_BASE as string | undefined) ?? '').replace(/\/+$/, '')

export type ApiOk = { ok: true; reference: string }
export type ApiFail = { ok: false; error: string; fields?: Record<string, string> }
export type ApiResult = ApiOk | ApiFail

export class ApiUnavailableError extends Error {
  constructor() {
    super('API unavailable')
    this.name = 'ApiUnavailableError'
  }
}

async function post(path: string, body: FormData | string, headers?: Record<string, string>): Promise<ApiResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 45_000)
  let res: Response
  try {
    res = await fetch(`${apiBase}${path}`, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json', ...headers },
      credentials: 'omit',
      signal: controller.signal,
    })
  } catch {
    clearTimeout(timer)
    throw new ApiUnavailableError()
  }
  clearTimeout(timer)

  const type = res.headers.get('content-type') ?? ''
  if (!type.includes('application/json')) {
    // A static host without the API returns an HTML 404 page here.
    throw new ApiUnavailableError()
  }
  const data = (await res.json()) as ApiResult
  if (!res.ok && data.ok !== false) return { ok: false, error: 'Something went wrong. Please try again.' }
  return data
}

export const submitApplication = (form: FormData) => post('/api/apply', form)

export const submitEnquiry = (payload: Record<string, string | number>) =>
  post('/api/contact', JSON.stringify(payload), { 'Content-Type': 'application/json' })
