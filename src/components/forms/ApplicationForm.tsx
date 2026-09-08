import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  applicationTypes,
  experienceLevels,
  internshipDurations,
  limits,
  noticePeriods,
  openings,
  otherPositionLabel,
  qualifications,
  referralSources,
  resumeRules,
  verticals,
} from '../../data/careers'
import { company } from '../../data/site'
import { ApiUnavailableError, submitApplication } from '../../lib/api'
import { validateDocument, validators } from '../../lib/validation'
import { Button } from '../Ui'
import { CheckboxField, FileField, FormSection, RadioGroup, SelectField, TextArea, TextField } from './Field'

type Values = {
  applicationType: string
  position: string
  positionOther: string
  vertical: string
  preferredLocation: string
  availability: string
  startDate: string
  fullName: string
  email: string
  phone: string
  city: string
  linkedin: string
  qualification: string
  institution: string
  fieldOfStudy: string
  graduationYear: string
  experience: string
  employer: string
  currentRole: string
  skills: string
  coverLetter: string
  referral: string
  notes: string
  consent: boolean
  declaration: boolean
}

const initial: Values = {
  applicationType: '',
  position: '',
  positionOther: '',
  vertical: '',
  preferredLocation: '',
  availability: '',
  startDate: '',
  fullName: '',
  email: '',
  phone: '',
  city: '',
  linkedin: '',
  qualification: '',
  institution: '',
  fieldOfStudy: '',
  graduationYear: '',
  experience: '',
  employer: '',
  currentRole: '',
  skills: '',
  coverLetter: '',
  referral: '',
  notes: '',
  consent: false,
  declaration: false,
}

type Errors = Partial<Record<keyof Values | 'resume' | 'coverLetterFile', string>>

export default function ApplicationForm({ presetPosition }: { presetPosition?: string }) {
  const [values, setValues] = useState<Values>({ ...initial, position: presetPosition ?? '' })
  const [resume, setResume] = useState<File | null>(null)
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'offline'>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [reference, setReference] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const startedAt = useRef(0)
  useEffect(() => {
    startedAt.current = Date.now()
  }, [])
  const formRef = useRef<HTMLFormElement>(null)

  const set = <K extends keyof Values>(key: K) => (v: Values[K]) => {
    setValues((s) => ({ ...s, [key]: v }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const isInternship = values.applicationType === 'Internship'
  const positionOptions = useMemo(
    () => [
      ...openings
        .filter((o) => !values.applicationType || o.type.includes(values.applicationType))
        .map((o) => ({ value: o.title, label: `${o.title} — ${o.vertical}` })),
      { value: otherPositionLabel, label: otherPositionLabel },
    ],
    [values.applicationType],
  )

  function validateAll(): Errors {
    const e: Errors = {}
    e.applicationType = validators.oneOf(applicationTypes)(values.applicationType)
    e.position = validators.oneOf(positionOptions.map((p) => p.value))(values.position)
    if (values.position === otherPositionLabel) e.positionOther = validators.short(values.positionOther)
    e.vertical = validators.oneOf(verticals)(values.vertical)
    e.preferredLocation = validators.optionalShort(values.preferredLocation)
    e.availability = validators.oneOf(isInternship ? internshipDurations : noticePeriods)(values.availability)
    e.fullName = validators.fullName(values.fullName)
    e.email = validators.email(values.email)
    e.phone = validators.phone(values.phone)
    e.city = validators.city(values.city)
    e.linkedin = validators.optionalUrl(values.linkedin)
    e.qualification = validators.oneOf(qualifications)(values.qualification)
    e.institution = validators.short(values.institution)
    e.fieldOfStudy = validators.optionalShort(values.fieldOfStudy)
    e.graduationYear = validators.year(values.graduationYear)
    e.experience = validators.oneOf(experienceLevels)(values.experience)
    e.employer = validators.optionalShort(values.employer)
    e.currentRole = validators.optionalShort(values.currentRole)
    e.skills = validators.skills(values.skills)
    e.coverLetter = validators.coverLetter(values.coverLetter)
    e.referral = validators.optionalOneOf(referralSources)(values.referral)
    e.notes = validators.notes(values.notes)
    e.consent = validators.checked(values.consent)
    e.declaration = validators.checked(values.declaration)
    e.resume = validateDocument(resume, true)
    e.coverLetterFile = validateDocument(coverLetterFile, false)
    for (const k of Object.keys(e) as (keyof Errors)[]) if (!e[k]) delete e[k]
    return e
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = validateAll()
    setErrors(e)
    if (Object.keys(e).length) {
      setStatus('idle')
      // Move focus to the first invalid control.
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], .field-error')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus({ preventScroll: true })
      })
      return
    }

    setStatus('submitting')
    setServerMessage('')
    const fd = new FormData()
    for (const [k, v] of Object.entries(values)) fd.append(k, typeof v === 'boolean' ? String(v) : v.trim())
    fd.append('website', honeypot) // honeypot — must stay empty
    fd.append('startedAt', String(startedAt.current))
    if (resume) fd.append('resume', resume, resume.name)
    if (coverLetterFile) fd.append('coverLetterFile', coverLetterFile, coverLetterFile.name)

    try {
      const res = await submitApplication(fd)
      if (res.ok) {
        setReference(res.reference)
        setStatus('success')
        window.scrollTo({ top: (document.getElementById('apply')?.offsetTop ?? 0) - 96, behavior: 'smooth' })
      } else {
        setStatus('error')
        setServerMessage(res.error)
        if (res.fields) setErrors(res.fields as Errors)
      }
    } catch (err) {
      setStatus(err instanceof ApiUnavailableError ? 'offline' : 'error')
      if (!(err instanceof ApiUnavailableError)) setServerMessage('Something went wrong while sending your application. Please try again.')
    }
  }

  function reset() {
    setValues({ ...initial })
    setResume(null)
    setCoverLetterFile(null)
    setErrors({})
    setStatus('idle')
    setReference('')
    startedAt.current = Date.now()
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-success-600/30 bg-success-50 p-8 sm:p-12" role="status" aria-live="polite">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-600 text-white" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="m5 12 5 5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-6 text-h3 font-semibold text-graphite-900">Application received. Thank you, {values.fullName.split(' ')[0]}.</h3>
        <p className="mt-3 max-w-prose text-body text-ink-700">
          Your {values.applicationType.toLowerCase()} application for <strong>{values.position === otherPositionLabel ? values.positionOther : values.position}</strong> has
          been delivered to the Nova Ventures careers team. Keep this reference for any follow-up:
        </p>
        <p className="mt-4 inline-block rounded-xl bg-white px-4 py-2 font-mono text-lead font-semibold text-graphite-900">{reference}</p>
        <p className="mt-6 text-small text-ink-500">
          A copy of this confirmation is sent to {values.email} when acknowledgements are enabled. Questions? Write to{' '}
          <a href={`mailto:${company.email}`} className="font-semibold text-ember-700">
            {company.email}
          </a>
          .
        </p>
        <div className="mt-8">
          <Button variant="ghost" onClick={reset}>
            Submit another application
          </Button>
        </div>
      </div>
    )
  }

  const mailtoFallback = `mailto:${company.email}?subject=${encodeURIComponent(
    `[Nova Careers] ${values.applicationType || 'Job'} application – ${values.position === otherPositionLabel ? values.positionOther : values.position || 'Position'} – ${values.fullName}`,
  )}&body=${encodeURIComponent(
    `Name: ${values.fullName}\nEmail: ${values.email}\nPhone: ${values.phone}\nCity: ${values.city}\nVertical: ${values.vertical}\nQualification: ${values.qualification}, ${values.institution} (${values.graduationYear})\nExperience: ${values.experience}\n\nSkills:\n${values.skills}\n\nCover letter:\n${values.coverLetter}\n\n(Please attach your CV before sending.)`,
  )}`

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6" aria-describedby="apply-required-note">
      {/* Form header — styled like a Google Form header card, branded for Nova Ventures. */}
      <div className="overflow-hidden rounded-3xl border border-graphite-900/10 bg-white shadow-soft">
        <div className="h-2.5 bg-ember" aria-hidden="true" />
        <div className="px-6 py-7 sm:px-8 sm:py-9">
          <img
            src="/logos/nova-logo-horizontal.png"
            alt="Nova Ventures — Innovation and Technology"
            width={1200}
            height={655}
            className="h-auto w-48 sm:w-56"
            loading="lazy"
          />
          <h3 className="mt-6 text-h3 font-semibold text-graphite-900">Job &amp; Internship Application</h3>
          <p className="mt-3 max-w-prose text-body text-ink-700">
            Apply to any of Nova Ventures’ six businesses. The form takes about five minutes. Your details go
            directly to the careers team at <span className="font-semibold">{company.email}</span> and are used
            only for recruitment (see our{' '}
            <Link to="/privacy" className="font-semibold text-ember-700 underline-offset-4 hover:underline">
              privacy policy
            </Link>
            ).
          </p>
          <p id="apply-required-note" className="mt-4 text-small text-danger-700">
            * Indicates a required field
          </p>
        </div>
      </div>

      <FormSection step="01" title="Position" description="Tell us what you are applying for.">
        <RadioGroup
          label="I am applying for"
          name="applicationType"
          required
          value={values.applicationType}
          onChange={(v) => {
            set('applicationType')(v)
            set('availability')('')
            if (values.position && !positionOptions.some((p) => p.value === values.position)) set('position')('')
          }}
          error={errors.applicationType}
          options={[
            { value: 'Job', label: 'A job (full-time role)', description: 'Open and upcoming positions across the businesses.' },
            { value: 'Internship', label: 'An internship', description: 'Students and recent graduates, 1 to 6 months.' },
          ]}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            label="Position"
            name="position"
            required
            value={values.position}
            onChange={set('position')}
            error={errors.position}
            options={positionOptions}
            hint="Choose an opening, or “Other” to apply generally."
          />
          {values.position === otherPositionLabel && (
            <TextField
              label="Role you are looking for"
              name="positionOther"
              required
              value={values.positionOther}
              onChange={set('positionOther')}
              error={errors.positionOther}
              maxLength={limits.short}
              placeholder="e.g. CAD/CAM Designer"
            />
          )}
          <SelectField
            label="Preferred business"
            name="vertical"
            required
            value={values.vertical}
            onChange={set('vertical')}
            error={errors.vertical}
            options={verticals}
          />
          <TextField
            label="Preferred work location"
            name="preferredLocation"
            value={values.preferredLocation}
            onChange={set('preferredLocation')}
            error={errors.preferredLocation}
            maxLength={limits.short}
            placeholder="e.g. Bilaspur, Raipur, remote"
          />
          <SelectField
            label={isInternship ? 'Internship duration' : 'Notice period / availability'}
            name="availability"
            required
            value={values.availability}
            onChange={set('availability')}
            error={errors.availability}
            options={isInternship ? internshipDurations : noticePeriods}
          />
          <TextField
            label="Earliest start date"
            name="startDate"
            type="date"
            value={values.startDate}
            onChange={set('startDate')}
            hint="Optional."
          />
        </div>
      </FormSection>

      <FormSection step="02" title="Personal details" description="How we can reach you.">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Full name" name="fullName" required autoComplete="name" value={values.fullName} onChange={set('fullName')} error={errors.fullName} maxLength={limits.name} />
          <TextField label="E-mail address" name="email" type="email" required autoComplete="email" inputMode="email" value={values.email} onChange={set('email')} error={errors.email} maxLength={limits.email} />
          <TextField label="Phone / WhatsApp" name="phone" type="tel" required autoComplete="tel" inputMode="tel" value={values.phone} onChange={set('phone')} error={errors.phone} maxLength={limits.phone} placeholder="+91 98765 43210" />
          <TextField label="Current city" name="city" required autoComplete="address-level2" value={values.city} onChange={set('city')} error={errors.city} maxLength={limits.city} />
          <TextField label="LinkedIn or portfolio link" name="linkedin" type="url" inputMode="url" autoComplete="url" value={values.linkedin} onChange={set('linkedin')} error={errors.linkedin} maxLength={limits.url} placeholder="https://" className="sm:col-span-2" />
        </div>
      </FormSection>

      <FormSection step="03" title="Education" description="Your highest or current qualification.">
        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField label="Highest qualification" name="qualification" required value={values.qualification} onChange={set('qualification')} error={errors.qualification} options={qualifications} className="sm:col-span-2" />
          <TextField label="Institution / university" name="institution" required value={values.institution} onChange={set('institution')} error={errors.institution} maxLength={limits.short} />
          <TextField label="Field of study / specialisation" name="fieldOfStudy" value={values.fieldOfStudy} onChange={set('fieldOfStudy')} error={errors.fieldOfStudy} maxLength={limits.short} placeholder="e.g. Mechanical Engineering" />
          <TextField label="Year of completion (or expected)" name="graduationYear" type="text" inputMode="numeric" required value={values.graduationYear} onChange={set('graduationYear')} error={errors.graduationYear} maxLength={4} placeholder="2024" />
        </div>
      </FormSection>

      <FormSection step="04" title="Experience & skills">
        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField label="Total work experience" name="experience" required value={values.experience} onChange={set('experience')} error={errors.experience} options={experienceLevels} />
          <TextField label="Current / most recent employer" name="employer" value={values.employer} onChange={set('employer')} error={errors.employer} maxLength={limits.short} hint="Leave blank if you are a fresher." />
          <TextField label="Current / most recent role" name="currentRole" value={values.currentRole} onChange={set('currentRole')} error={errors.currentRole} maxLength={limits.short} className="sm:col-span-2" />
          <TextArea
            label="Key skills and tools"
            name="skills"
            required
            value={values.skills}
            onChange={set('skills')}
            error={errors.skills}
            maxLength={limits.skills}
            rows={4}
            hint="Machines, software, certifications, languages — whatever is relevant to the role."
            className="sm:col-span-2"
          />
        </div>
      </FormSection>

      <FormSection step="05" title="Documents" description="Your CV is required. A cover letter is welcome but optional.">
        <FileField label="CV / Resume" name="resume" required accept={resumeRules.accept} file={resume} onChange={(f) => { setResume(f); setErrors((e) => ({ ...e, resume: undefined })) }} error={errors.resume} hint={resumeRules.label} />
        <TextArea
          label="Cover letter"
          name="coverLetter"
          value={values.coverLetter}
          onChange={set('coverLetter')}
          error={errors.coverLetter}
          maxLength={limits.coverLetter}
          rows={6}
          hint="Optional. Tell us why this role, and why Nova Ventures. You can write it here, attach a file below, or both."
        />
        <FileField label="Cover letter file" name="coverLetterFile" accept={resumeRules.accept} file={coverLetterFile} onChange={(f) => { setCoverLetterFile(f); setErrors((e) => ({ ...e, coverLetterFile: undefined })) }} error={errors.coverLetterFile} hint={`Optional. ${resumeRules.label}`} />
      </FormSection>

      <FormSection step="06" title="Final details">
        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField label="How did you hear about Nova Ventures?" name="referral" value={values.referral} onChange={set('referral')} error={errors.referral} options={referralSources} className="sm:col-span-2" />
          <TextArea label="Anything else you would like us to know?" name="notes" value={values.notes} onChange={set('notes')} error={errors.notes} maxLength={limits.notes} rows={3} className="sm:col-span-2" />
        </div>
        <CheckboxField
          name="consent"
          required
          checked={values.consent}
          onChange={set('consent')}
          error={errors.consent}
          label={
            <>
              I consent to Nova Ventures storing and processing the information and documents in this application for recruitment purposes, as described in the{' '}
              <Link to="/privacy" className="font-semibold text-ember-700 underline-offset-4 hover:underline">
                privacy policy
              </Link>
              .
            </>
          }
        />
        <CheckboxField
          name="declaration"
          required
          checked={values.declaration}
          onChange={set('declaration')}
          error={errors.declaration}
          label="I declare that the information provided is true and complete to the best of my knowledge."
        />

        {/* Honeypot: invisible to people, tempting to bots. */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="apply-website">Website</label>
          <input id="apply-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>

        {status === 'error' && (
          <div className="rounded-xl border border-danger-600/30 bg-danger-50 p-4 text-small text-danger-700" role="alert">
            {serverMessage || 'Something went wrong. Please check the highlighted fields and try again.'}
          </div>
        )}
        {status === 'offline' && (
          <div className="rounded-xl border border-ember/50 bg-ember/10 p-4 text-small text-ink-900" role="alert">
            <p className="font-semibold">The online application service is not reachable right now.</p>
            <p className="mt-1">
              You can e-mail your application instead — this link opens a message with your details already filled in. Please attach your CV before sending.
            </p>
            <a href={mailtoFallback} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-graphite-900 px-5 text-small font-semibold text-white hover:bg-ember-700">
              E-mail my application &rarr;
            </a>
          </div>
        )}

        <div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={reset} className="min-h-11 text-small font-medium text-ink-500 hover:text-graphite-900">
            Clear form
          </button>
          <Button type="submit" disabled={status === 'submitting'} className="sm:min-w-56">
            {status === 'submitting' ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                Sending application…
              </>
            ) : (
              <>
                Submit application <span aria-hidden="true">&rarr;</span>
              </>
            )}
          </Button>
        </div>
      </FormSection>
    </form>
  )
}
