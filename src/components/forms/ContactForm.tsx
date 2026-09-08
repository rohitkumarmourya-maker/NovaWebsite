import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { company, enquiryCategories } from '../../data/site'
import { limits } from '../../data/careers'
import { ApiUnavailableError, submitEnquiry } from '../../lib/api'
import { validators } from '../../lib/validation'
import { Button } from '../Ui'
import { CheckboxField, TextArea, TextField } from './Field'

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'organisation' | 'message' | 'consent', string>>

export default function ContactForm({ category, onCategoryChange }: { category: string; onCategoryChange: (c: string) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'offline'>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [reference, setReference] = useState('')
  const startedAt = useRef(0)
  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  function validate(): Errors {
    const e: Errors = {
      name: validators.fullName(name),
      email: validators.email(email),
      phone: phone.trim() ? validators.phone(phone) : '',
      organisation: validators.optionalShort(organisation),
      message: validators.message(message),
      consent: validators.checked(consent),
    }
    for (const k of Object.keys(e) as (keyof Errors)[]) if (!e[k]) delete e[k]
    return e
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setStatus('submitting')
    try {
      const res = await submitEnquiry({
        category,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        organisation: organisation.trim(),
        message: message.trim(),
        consent: String(consent),
        website: honeypot,
        startedAt: startedAt.current,
      })
      if (res.ok) {
        setReference(res.reference)
        setStatus('success')
      } else {
        setStatus('error')
        setServerMessage(res.error)
        if (res.fields) setErrors(res.fields as Errors)
      }
    } catch (err) {
      setStatus(err instanceof ApiUnavailableError ? 'offline' : 'error')
    }
  }

  const mailto = `mailto:${company.email}?subject=${encodeURIComponent(`[${category}] Enquiry from ${name || 'Website visitor'}`)}&body=${encodeURIComponent(
    `${message}\n\n${name}\n${email}${phone ? `\n${phone}` : ''}${organisation ? `\n${organisation}` : ''}`,
  )}`

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-success-600/30 bg-success-50 p-8 sm:p-10" role="status" aria-live="polite">
        <h3 className="text-h3 font-semibold text-graphite-900">Thank you, {name.split(' ')[0]}. Your enquiry is on its way.</h3>
        <p className="mt-3 max-w-prose text-body text-ink-700">
          It has been delivered to {company.email} under the category <strong>{category}</strong>. Reference:{' '}
          <span className="font-mono font-semibold text-graphite-900">{reference}</span>
        </p>
        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => {
              setStatus('idle')
              setName('')
              setEmail('')
              setPhone('')
              setOrganisation('')
              setMessage('')
              setConsent(false)
              startedAt.current = Date.now()
            }}
          >
            Send another enquiry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 rounded-3xl border border-graphite-900/10 bg-white p-6 shadow-soft sm:p-8">
      <p className="text-small text-ink-500">
        Enquiry type: <span className="font-semibold text-graphite-900">{category}</span>{' '}
        <button type="button" onClick={() => onCategoryChange(enquiryCategories[0])} className="ml-1 text-ember-700 underline-offset-4 hover:underline">
          change
        </button>
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Name" name="name" required autoComplete="name" value={name} onChange={setName} error={errors.name} maxLength={limits.name} />
        <TextField label="E-mail" name="email" type="email" required autoComplete="email" inputMode="email" value={email} onChange={setEmail} error={errors.email} maxLength={limits.email} />
        <TextField label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={setPhone} error={errors.phone} maxLength={limits.phone} hint="Optional." />
        <TextField label="Organisation" name="organisation" autoComplete="organization" value={organisation} onChange={setOrganisation} error={errors.organisation} maxLength={limits.short} hint="Optional." />
      </div>
      <TextArea label="Message" name="message" required value={message} onChange={setMessage} error={errors.message} maxLength={limits.message} rows={6} />
      <CheckboxField
        name="consent"
        required
        checked={consent}
        onChange={setConsent}
        error={errors.consent}
        label={
          <>
            I agree that Nova Ventures may use these details to respond to my enquiry (
            <Link to="/privacy" className="font-semibold text-ember-700 underline-offset-4 hover:underline">
              privacy policy
            </Link>
            ).
          </>
        }
      />
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      {status === 'error' && (
        <div className="rounded-xl border border-danger-600/30 bg-danger-50 p-4 text-small text-danger-700" role="alert">
          {serverMessage || 'Something went wrong. Please try again.'}
        </div>
      )}
      {status === 'offline' && (
        <div className="rounded-xl border border-ember/50 bg-ember/10 p-4 text-small text-ink-900" role="alert">
          <p className="font-semibold">The online enquiry service is not reachable right now.</p>
          <a href={mailto} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-graphite-900 px-5 text-small font-semibold text-white hover:bg-ember-700">
            Send by e-mail instead &rarr;
          </a>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-ink-500">We usually reply within two working days.</p>
        <Button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
        </Button>
      </div>
    </form>
  )
}
