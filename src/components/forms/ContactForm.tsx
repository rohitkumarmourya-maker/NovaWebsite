import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { company, enquiryCategories } from '../../data/site'
import { limits } from '../../data/careers'
import { ApiUnavailableError, submitEnquiry } from '../../lib/api'
import { validators } from '../../lib/validation'
import { useToast } from '../../lib/toast'
import { Button } from '../Ui'
import { CheckboxField, TextArea, TextField } from './Field'

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'organisation' | 'message' | 'consent', string>>

export default function ContactForm({ category, onCategoryChange, onPendingChange }: { category: string; onCategoryChange: (c: string) => void; onPendingChange: (pending: boolean) => void }) {
  const toast = useToast()
  const sending = useRef(false)
  const confirmationRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [submittedCategory, setSubmittedCategory] = useState(category)
  const [delivery, setDelivery] = useState<'accepted' | 'preview'>('accepted')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'offline'>('idle')
  useEffect(() => {
    if (status === 'success') {
      confirmationRef.current?.focus({ preventScroll: true })
      confirmationRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' })
    }
  }, [status])
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
    if (sending.current) return
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      toast('Please check the highlighted fields before submitting.', 'error')
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    sending.current = true
    onPendingChange(true)
    setSubmittedCategory(category)
    setServerMessage('')
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
        setDelivery(res.delivery ?? 'accepted')
        toast(res.delivery === 'preview' ? 'Preview saved locally. No email was sent.' : `Enquiry accepted. Reference: ${res.reference}`, 'success')
        setStatus('success')
      } else {
        setStatus('error')
        setServerMessage(res.error)
        toast(res.error, 'error')
        if (res.fields) setErrors(res.fields as Errors)
      }
    } catch (err) {
      setStatus(err instanceof ApiUnavailableError ? 'offline' : 'error')
      const message = err instanceof Error ? err.message : 'The enquiry could not be sent. Your details are still on this page.'
      setServerMessage(message)
      toast(message, 'error')
    } finally {
      sending.current = false
      onPendingChange(false)
    }
  }

  const mailto = `mailto:${company.email}?subject=${encodeURIComponent(`[${category}] Enquiry from ${name || 'Website visitor'}`)}&body=${encodeURIComponent(
    `${message}\n\n${name}\n${email}${phone ? `\n${phone}` : ''}${organisation ? `\n${organisation}` : ''}`,
  )}`

  if (status === 'success') {
    return (
      <div ref={confirmationRef} tabIndex={-1} className="rounded-3xl border border-success-600/30 bg-success-50 p-8 sm:p-10" role="status" aria-live="polite">
        <h3 className="text-h3 font-semibold text-graphite-900">{delivery === 'preview' ? 'Preview saved. No email was sent.' : `Thank you, ${name.split(' ')[0]}. Your enquiry has been accepted.`}</h3>
        <p className="mt-3 max-w-prose text-body text-ink-700">
          {delivery === 'preview' ? 'It has been saved to the local preview outbox' : 'It has been accepted by the email service for the Nova Ventures team'} under the category <strong>{submittedCategory}</strong>. Reference:{' '}
          <span className="font-mono font-semibold text-graphite-900">{reference}</span>
        </p>
        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => {
              setStatus('idle')
              setErrors({})
              setHoneypot('')
              setServerMessage('')
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
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 rounded-3xl border border-graphite-900/10 bg-white p-6 shadow-soft sm:p-8">
      <fieldset disabled={status === 'submitting'} className="flex min-w-0 flex-col gap-6" aria-busy={status === 'submitting'}>
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
          {serverMessage || 'The enquiry could not be sent. Your details are still on this page.'}
        </div>
      )}
      {(status === 'offline' || status === 'error') && (
        <div className="rounded-xl border border-ember/50 bg-ember/10 p-4 text-small text-ink-900" role="alert">
          <p className="font-semibold">Prefer to send your enquiry by email?</p>
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
      </fieldset>
    </form>
  )
}
