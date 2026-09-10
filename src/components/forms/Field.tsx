import { useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { formatBytes } from '../../lib/validation'

type Common = {
  label: string
  hint?: ReactNode
  error?: string
  required?: boolean
  className?: string
}

function Label({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={id} className="field-label">
      {label}
      {required && (
        <span className="ml-1 text-danger-600" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}

function Meta({ id, hint, error }: { id: string; hint?: ReactNode; error?: string }) {
  return (
    <>
      {hint && !error && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </>
  )
}

const describedBy = (id: string, hint?: ReactNode, error?: string) =>
  [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined

export function TextField({
  label,
  hint,
  error,
  required,
  className = '',
  value,
  onChange,
  type = 'text',
  name,
  autoComplete,
  placeholder,
  inputMode,
  maxLength,
  onBlur,
}: Common & {
  value: string
  onChange: (v: string) => void
  type?: 'text' | 'email' | 'tel' | 'url' | 'date' | 'number'
  name: string
  autoComplete?: string
  placeholder?: string
  inputMode?: 'text' | 'email' | 'tel' | 'url' | 'numeric'
  maxLength?: number
  onBlur?: () => void
}) {
  const id = `field-${name}`
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} />
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className="field-input mt-2"
      />
      <Meta id={id} hint={hint} error={error} />
    </div>
  )
}

export function TextArea({
  label,
  hint,
  error,
  required,
  className = '',
  value,
  onChange,
  name,
  rows = 5,
  maxLength,
  placeholder,
  onBlur,
}: Common & {
  value: string
  onChange: (v: string) => void
  name: string
  rows?: number
  maxLength?: number
  placeholder?: string
  onBlur?: () => void
}) {
  const id = `field-${name}`
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <Label id={id} label={label} required={required} />
        {maxLength && (
          <span className="text-eyebrow normal-case tracking-normal text-ink-400" aria-hidden="true">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={rows}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className="field-input mt-2 min-h-[7rem] resize-y"
      />
      <Meta id={id} hint={hint} error={error} />
    </div>
  )
}

export function SelectField({
  label,
  hint,
  error,
  required,
  className = '',
  value,
  onChange,
  name,
  options,
  placeholder = 'Select…',
  onBlur,
}: Common & {
  value: string
  onChange: (v: string) => void
  name: string
  options: readonly string[] | { value: string; label: string }[]
  placeholder?: string
  onBlur?: () => void
}) {
  const id = `field-${name}`
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} />
      <div className="relative mt-2">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className="field-input appearance-none pr-10"
        >
          <option value="">{placeholder}</option>
          {items.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          width="12"
          height="8"
          viewBox="0 0 14 8"
          fill="none"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-500"
          aria-hidden="true"
        >
          <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <Meta id={id} hint={hint} error={error} />
    </div>
  )
}

export function RadioGroup({
  label,
  hint,
  error,
  required,
  className = '',
  value,
  onChange,
  name,
  options,
}: Common & {
  value: string
  onChange: (v: string) => void
  name: string
  options: readonly { value: string; label: string; description?: string }[]
}) {
  const id = `field-${name}`
  return (
    <fieldset className={className} aria-describedby={describedBy(id, hint, error)}>
      <legend className="field-label">
        {label}
        {required && (
          <span className="ml-1 text-danger-600" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.value} className="choice">
            <input type="radio" aria-invalid={error ? 'true' : undefined} aria-describedby={describedBy(id, hint, error)} name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} required={required} />
            <span>
              <span className="block font-semibold">{o.label}</span>
              {o.description && <span className="mt-0.5 block text-small opacity-80">{o.description}</span>}
            </span>
          </label>
        ))}
      </div>
      <Meta id={id} hint={hint} error={error} />
    </fieldset>
  )
}

export function CheckboxField({
  label,
  hint,
  error,
  required,
  className = '',
  checked,
  onChange,
  name,
}: Omit<Common, 'label'> & { label: ReactNode; checked: boolean; onChange: (v: boolean) => void; name: string }) {
  const id = `field-${name}`
  return (
    <div className={className}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-small text-ink-700">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-ember-600"
        />
        <span>
          {label}
          {required && (
            <span className="ml-1 text-danger-600" aria-hidden="true">
              *
            </span>
          )}
        </span>
      </label>
      <Meta id={id} hint={hint} error={error} />
    </div>
  )
}

export function FileField({
  label,
  hint,
  error,
  required,
  className = '',
  file,
  onChange,
  name,
  accept,
}: Common & { file: File | null; onChange: (f: File | null) => void; name: string; accept: string }) {
  const id = `field-${name}`
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const pick = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.files?.[0] ?? null)
  const clear = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={className}>
      <Label id={id} label={label} required={required} />
      <div
        className={`mt-2 rounded-xl border border-dashed p-4 transition-colors ${
          error ? 'border-danger-600 bg-danger-50' : dragging ? 'border-ember bg-ember/10' : 'border-graphite-900/25 bg-white'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          if (!inputRef.current?.matches(':disabled')) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const f = e.dataTransfer.files?.[0]
          if (f && !inputRef.current?.matches(':disabled')) onChange(f)
        }}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          onChange={pick}
          required={required && !file}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className="sr-only"
        />
        {file ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-graphite-900 text-white" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="truncate text-small font-semibold text-ink-900">{file.name}</p>
                <p className="text-eyebrow normal-case tracking-normal text-ink-500">{formatBytes(file.size)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => inputRef.current?.click()} className="rounded-full border border-graphite-900/20 px-3 py-1.5 text-small font-medium text-graphite-900 hover:border-graphite-900">
                Replace
              </button>
              <button type="button" onClick={clear} className="rounded-full px-3 py-1.5 text-small font-medium text-danger-700 hover:bg-danger-50">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-graphite-900 px-5 text-small font-semibold text-white transition-colors hover:bg-ember-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Choose file
            </button>
            <span className="text-small text-ink-500">or drag and drop here</span>
          </div>
        )}
      </div>
      <Meta id={id} hint={hint} error={error} />
    </div>
  )
}

export function FormSection({
  title,
  description,
  children,
  step,
}: {
  title: string
  description?: string
  children: ReactNode
  step: string
}) {
  return (
    <section className="rounded-3xl border border-graphite-900/10 bg-white shadow-soft" aria-labelledby={`section-${step}`}>
      <header className="border-b border-graphite-900/10 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="font-display text-small font-bold text-ember-700">{step}</span>
          <h3 id={`section-${step}`} className="text-h4 font-semibold text-graphite-900">
            {title}
          </h3>
        </div>
        {description && <p className="mt-1.5 text-small text-ink-500">{description}</p>}
      </header>
      <div className="grid gap-6 px-6 py-6 sm:px-8 sm:py-8">{children}</div>
    </section>
  )
}
