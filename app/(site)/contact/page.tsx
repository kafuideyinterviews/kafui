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

            {/* Social links */}
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold mb-4">
                Follow Kafui Dey
              </p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'YouTube',   href: 'https://www.youtube.com/@kafuideymc',                    icon: 'M21.6 7.2a2.7 2.7 0 00-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3a2.7 2.7 0 00-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 001.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 001.9-1.9C22 15.1 22 12 22 12s0-3.1-.4-4.8zm-11.1 7.7V9.1l5.1 2.9-5.1 2.9z' },
                  { label: 'Facebook',  href: 'https://web.facebook.com/KafuiDeyHost/',                icon: 'M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z' },
                  { label: 'Instagram', href: 'https://www.instagram.com/kafuidey/',                   icon: 'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.3 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.1 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4A6.2 6.2 0 0012 5.8zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z' },
                  { label: 'Twitter/X', href: 'https://twitter.com/KafuiDey',                          icon: 'M18.9 2h3.1l-6.8 7.8L23 22h-6.3l-4.9-6.4L5.9 22H2.8l7.3-8.3L2 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L6.3 3.7H4.5L17.8 20z' },
                  { label: 'LinkedIn',  href: 'https://gh.linkedin.com/in/kafuidey',                   icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { label: 'TikTok',    href: 'https://www.tiktok.com/@kafuidey7',                     icon: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z' },
                  { label: 'Spotify',   href: 'https://open.spotify.com/show/7DcdeDekO7fOF08IlIWNkY', icon: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z' },
                  { label: 'Amazon',    href: 'https://www.amazon.com/stores/author/B00IRHGXIQ',       icon: 'M15.93 17.09c-.16.12-.41.13-.6.05-1.42-1.19-1.67-1.74-2.45-2.87-2.34 2.39-4 3.1-7.04 3.1C3.4 17.37 2 15.57 2 13.32c0-1.7.9-2.85 2.17-3.42 1.1-.5 2.64-.59 3.82-.72.93-.11 2.73-.18 3.4-.59v-.45c0-.66.05-1.44-.33-2.01-.33-.5-.97-.71-1.53-.71-1.04 0-1.97.53-2.19 1.64-.05.24-.24.48-.48.49l-2.68-.29c-.23-.05-.48-.24-.41-.59C4.34 4.05 6.94 3 9.32 3c1.22 0 2.82.33 3.78 1.25 1.22 1.14 1.1 2.66 1.1 4.31v3.9c0 1.17.49 1.69 .94 2.32.16.23.2.5-.01.67l-1.2 1.04v-.4zm-4.6-2.14c.49-.87.47-1.69.47-2.6v-.49c-1.49 0-3.07.32-3.07 2.07 0 .89.46 1.49 1.25 1.49.58 0 1.1-.36 1.35-.97v.5zm6.86 4.06c-2.12 1.55-5.19 2.37-7.84 2.37-3.71 0-7.05-1.37-9.58-3.65-.2-.18-.02-.42.22-.28 2.73 1.59 6.1 2.54 9.58 2.54 2.35 0 4.93-.49 7.31-1.5.36-.15.66.23.31.52z' },
                ].map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-sm border border-border text-muted transition-all duration-200 hover:border-gold hover:text-gold hover:-translate-y-0.5"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  )
}