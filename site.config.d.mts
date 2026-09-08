export const siteUrl: string
export const apiBase: string
export const company: { name: string; legalName: string; email: string; state: string; country: string }
export const staticRoutes: { path: string; priority: string; changefreq: string }[]
export const businessIds: string[]
export function buildCsp(opts?: { forMeta?: boolean }): string
export function securityHeaders(): Record<string, string>
