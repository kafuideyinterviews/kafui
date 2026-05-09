'use client'

import { useState, FormEvent } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

type Field = {
  name:        string
  email:       string
  phone:       string
  subject:     string
  message:     string
  organisation: string
}

const SUBJECT_OPTIONS = [
  'General Enquiry',
  'Interview Request',
  'Media & Press',
  'Speaking Engagement',
  'Patreon / Membership',
  'Technical Issue',
  'Other',
]

function validate(fields: Field): Partial<Record<keyof Field, string>> {
  const errors: Partial<Record<keyof Field, string>> = {}
  if (!fields.name.trim())                     errors.name    = 'Your name is required.'
  if (!fields.email.trim())                    errors.email   = 'Your email address is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
                                               errors.email   = 'Please enter a valid email address.'
  if (!fields.phone.trim())                    errors.phone   = 'Your phone number is required.'
  else if (!/^[\d\s\+\-\(\)]{7,20}$/.test(fields.phone))
                                               errors.phone   = 'Please enter a valid phone number.'
  if (!fields.subject)                         errors.subject = 'Please select a subject.'
  if (!fields.message.trim())                  errors.message = 'A message is required.'
  else if (fields.message.trim().length < 20)  errors.message = 'Please write at least 20 characters.'
  return errors
}

export default function ContactPage() {
  const [fields, setFields] = useState<Field>({
    name: '', email: '', phone: '', subject: '', message: '', organisation: '',
  })
  const [errors,    setErrors]    = useState<Partial<Record<keyof Field, string>>>({})
  const [formState, setFormState] = useState<FormState>('idle')
  const [serverMsg, setServerMsg] = useState('')

  function update(key: keyof Field) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((f) => ({ ...f, [key]: e.target.value }))
      if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validation = validate(fields)
    if (Object.keys(validation).length) {
      setErrors(validation)
      // Focus first error field
      const firstKey = Object.keys(validation)[0] as keyof Field
      const el = document.getElementById(`contact-${firstKey}`)
      if (el) el.focus()
      return
    }

    setFormState('submitting')

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fields),
      })
      const data = await res.json() as { message?: string }
      if (!res.ok) throw new Error(data.message ?? 'Server error')
      setFormState('success')
      setFields({ name: '', email: '', phone: '', subject: '', message: '', organisation: '' })
    } catch (err) {
      setFormState('error')
      setServerMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  const inputBase =
    'w-full rounded-sm border bg-transparent px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted/60 transition-colors focus:outline-none focus:ring-1 focus:ring-gold'
  const inputNormal  = `${inputBase} border-border hover:border-muted`
  const inputInvalid = `${inputBase} border-red-400 focus:ring-red-400`

  return (
    <main className="min-h-screen bg-background">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="border-b border-border pt-24 pb-14 text-center">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Get in Touch
        </p>
        <h1 className="font-serif text-5xl italic font-normal text-navy dark:text-cream md:text-6xl">
          Contact
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-muted">
          For interview requests, media enquiries, speaking engagements, or general questions.
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_400px]">

          {/* ── Form ────────────────────────────────────────────── */}
          <div>
            {formState === 'success' ? (
              <div
                role="alert"
                className="rounded-sm border border-gold/30 bg-gold/5 px-8 py-12 text-center"
              >
                <p className="font-serif text-3xl italic font-normal text-navy dark:text-cream">
                  Message received.
                </p>
                <p className="mt-4 font-sans text-sm leading-relaxed text-muted">
                  Thank you for reaching out. We will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setFormState('idle')}
                  className="mt-8 rounded-sm border border-border px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-muted transition-colors hover:border-gold hover:text-gold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                {/* Server error */}
                {formState === 'error' && (
                  <div
                    role="alert"
                    className="mb-6 rounded-sm border border-red-400/30 bg-red-500/10 px-5 py-3 font-sans text-sm text-red-600 dark:text-red-400"
                  >
                    {serverMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/70">
                      Full Name <span className="text-gold" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={fields.name}
                      onChange={update('name')}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'error-name' : undefined}
                      placeholder="Your full name"
                      className={errors.name ? inputInvalid : inputNormal}
                    />
                    {errors.name && (
                      <p id="error-name" role="alert" className="font-sans text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/70">
                      Email Address <span className="text-gold" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={fields.email}
                      onChange={update('email')}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'error-email' : undefined}
                      placeholder="you@example.com"
                      className={errors.email ? inputInvalid : inputNormal}
                    />
                    {errors.email && (
                      <p id="error-email" role="alert" className="font-sans text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-phone" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/70">
                      Telephone <span className="text-gold" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      autoComplete="tel"
                      value={fields.phone}
                      onChange={update('phone')}
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'error-phone' : undefined}
                      placeholder="+233 20 000 0000"
                      className={errors.phone ? inputInvalid : inputNormal}
                    />
                    {errors.phone && (
                      <p id="error-phone" role="alert" className="font-sans text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Organisation */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-organisation" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/70">
                      Organisation <span className="text-muted font-normal normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="contact-organisation"
                      type="text"
                      autoComplete="organization"
                      value={fields.organisation}
                      onChange={update('organisation')}
                      placeholder="Company, media house, NGO..."
                      className={inputNormal}
                    />
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-subject" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/70">
                      Subject <span className="text-gold" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="contact-subject"
                      value={fields.subject}
                      onChange={update('subject')}
                      aria-required="true"
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? 'error-subject' : undefined}
                      className={errors.subject ? inputInvalid : inputNormal}
                    >
                      <option value="" disabled>Select a subject…</option>
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p id="error-subject" role="alert" className="font-sans text-xs text-red-500">{errors.subject}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="mt-6 flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/70">
                    Message <span className="text-gold" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={7}
                    value={fields.message}
                    onChange={update('message')}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'error-message' : undefined}
                    placeholder="Write your message here…"
                    maxLength={2000}
                    className={`resize-none ${errors.message ? inputInvalid : inputNormal}`}
                  />
                  <div className="flex items-center justify-between">
                    {errors.message ? (
                      <p id="error-message" role="alert" className="font-sans text-xs text-red-500">{errors.message}</p>
                    ) : <span />}
                    <p className={`font-sans text-xs tabular-nums ${fields.message.length > 1800 ? 'text-red-400' : 'text-muted'}`}>
                      {fields.message.length} / 2000
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="relative inline-flex items-center gap-3 rounded-sm bg-gold px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a8893e] hover:text-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-gold disabled:hover:text-navy"
                  >
                    {formState === 'submitting' ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Sending…
                      </>
                    ) : 'Send Message'}
                  </button>
                  <p className="mt-4 font-sans text-xs text-muted">
                    Fields marked <span className="text-gold">*</span> are required. We respond within 24 hours.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* ── Sidebar info ─────────────────────────────────────── */}
          <aside className="space-y-10">
            {[
              {
                label: 'Interview Requests',
                body:  'Kafui Dey conducts a limited number of new interviews each month. Submit your request with a brief on the proposed subject and purpose.',
              },
              {
                label: 'Media & Press',
                body:  'For press enquiries, accreditation, or to request high-resolution photos, please select "Media & Press" in the form.',
              },
              {
                label: 'Patreon & Members',
                body:  'For questions about membership tiers, billing, or exclusive content access, select "Patreon / Membership".',
              },
            ].map(({ label, body }) => (
              <div key={label} className="border-l-2 border-gold/30 pl-5">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold">
                  {label}
                </p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}

            {/* Response time note */}
            <div className="rounded-sm border border-border p-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/60">
                Response Time
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted">
                All messages are reviewed personally. Expect a reply within 24 hours.
                For urgent press matters, please indicate this in your message.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </main>
  )
}