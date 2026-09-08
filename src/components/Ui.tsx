import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-sans text-eyebrow font-bold uppercase ${
        dark ? 'text-ember' : 'text-ember-700'
      }`}
    >
      <span className="h-px w-6 bg-ember" aria-hidden="true" />
      {children}
    </span>
  )
}

const arrow = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="shrink-0 transition-transform duration-300 ease-editorial group-hover:translate-x-1"
    aria-hidden="true"
  >
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function ArrowLink({
  to,
  children,
  dark = false,
  className = '',
}: {
  to: string
  children: ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <Link
      to={to}
      className={`group inline-flex min-h-11 items-center gap-2 text-small font-semibold ${
        dark ? 'text-white hover:text-ember' : 'text-graphite-900 hover:text-ember-700'
      } ${className}`}
    >
      <span className="border-b border-transparent pb-0.5 transition-colors duration-300 group-hover:border-current">
        {children}
      </span>
      {arrow}
    </Link>
  )
}

type CTAVariant = 'primary' | 'ghost' | 'ghostDark' | 'ember'

const ctaBase =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-small font-semibold transition-all duration-300 ease-editorial focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-60'

const ctaStyles: Record<CTAVariant, string> = {
  primary: 'bg-graphite-900 text-white hover:bg-ember-700 active:bg-ember-800',
  ghost:
    'border border-graphite-900/25 text-graphite-900 hover:border-graphite-900 hover:bg-graphite-900 hover:text-white',
  ghostDark: 'border border-white/35 text-white hover:border-white hover:bg-white hover:text-graphite-900',
  ember: 'bg-ember text-graphite-900 hover:bg-white',
}

export function CTAButton({
  to,
  children,
  variant = 'primary',
  className = '',
}: {
  to: string
  children: ReactNode
  variant?: CTAVariant
  className?: string
}) {
  return (
    <Link to={to} className={`${ctaBase} ${ctaStyles[variant]} ${className}`}>
      {children}
    </Link>
  )
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  onClick,
}: {
  children: ReactNode
  variant?: CTAVariant
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${ctaBase} ${ctaStyles[variant]} ${className}`}>
      {children}
    </button>
  )
}

/** Standard page hero used by the inner pages. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  dark = false,
  aside,
}: {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
  dark?: boolean
  aside?: ReactNode
}) {
  return (
    <section className={`${dark ? 'bg-graphite-950 text-white' : 'bg-sand-50'} pb-14 pt-28 sm:pb-20 sm:pt-36 lg:pt-40`}>
      <div
        className={`container-nova ${
          aside ? 'grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16' : ''
        }`}
      >
        <div>
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
          <h1 className={`mt-6 max-w-4xl text-h1 font-bold ${dark ? 'text-white' : 'text-graphite-900'}`}>{title}</h1>
          {lead && (
            <p className={`mt-6 max-w-prose text-lead ${dark ? 'text-white/75' : 'text-ink-700'}`}>{lead}</p>
          )}
          {children}
        </div>
        {aside}
      </div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  dark = false,
  action,
}: {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  dark?: boolean
  action?: ReactNode
}) {
  return (
    <div
      className={`flex flex-col gap-6 ${align === 'center' ? 'items-center text-center' : ''} ${
        action ? 'sm:flex-row sm:items-end sm:justify-between' : ''
      }`}
    >
      <div className={align === 'center' ? 'flex flex-col items-center' : ''}>
        {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
        <h2 className={`mt-5 max-w-3xl text-h2 font-semibold ${dark ? 'text-white' : 'text-graphite-900'}`}>{title}</h2>
        {lead && (
          <p className={`mt-5 max-w-prose text-lead ${dark ? 'text-white/70' : 'text-ink-700'}`}>{lead}</p>
        )}
      </div>
      {action}
    </div>
  )
}

/** Final call-to-action band in ember. */
export function CtaBand({ title, to, label }: { title: ReactNode; to: string; label: string }) {
  return (
    <section className="bg-ember py-16 sm:py-24">
      <div className="container-nova flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="max-w-xl text-h2 font-semibold text-graphite-900">{title}</h2>
        <CTAButton to={to} variant="ghost" className="shrink-0">
          {label}
        </CTAButton>
      </div>
    </section>
  )
}
