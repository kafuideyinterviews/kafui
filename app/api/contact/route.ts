import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = 'Kafui Dey Website <no-reply@kafuideyinterviews.com>'
const TO_ADDRESS   = process.env.CONTACT_TO_EMAIL ?? 'hello@kafuideyinterviews.com'
const MAX_MESSAGE  = 2000

// ── Simple in-memory rate limiter — 3 submissions per IP per 10 min ──────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT   = 3
const WINDOW_MS    = 10 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now   = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

// ── Input validation ─────────────────────────────────────────────────────────
function validateBody(body: unknown): body is {
  name: string; email: string; phone: string; subject: string; message: string; organisation?: string
} {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  return (
    typeof b.name    === 'string' && b.name.trim().length > 0 &&
    typeof b.email   === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.phone   === 'string' && /^[\d\s\+\-\(\)]{7,20}$/.test(b.phone.trim()) &&
    typeof b.subject === 'string' && b.subject.trim().length > 0 &&
    typeof b.message === 'string' && b.message.trim().length >= 20 &&
    b.message.trim().length <= MAX_MESSAGE
  )
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ── Rate limit by IP ───────────────────────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { message: 'Too many requests. Please wait a few minutes before trying again.' },
      { status: 429 },
    )
  }

  // ── Parse and validate ─────────────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  if (!validateBody(body)) {
    return NextResponse.json({ message: 'Missing or invalid fields.' }, { status: 422 })
  }

  const { name, email, phone, subject, message, organisation } = body

  // ── Send via Resend ────────────────────────────────────────────────────────
  const orgLine   = organisation?.trim() ? `\nOrganisation: ${organisation.trim()}` : ''
  const phoneLine = phone.trim() ? `\nPhone:   ${phone.trim()}` : ''

  try {
    await resend.emails.send({
      from:    FROM_ADDRESS,
      to:      [TO_ADDRESS],
      replyTo: email,
      subject: `[Contact] ${subject} — ${name}`,
      text: [
        `New message from kafuideyinterviews.com`,
        ``,
        `Name:    ${name}`,
        `Email:   ${email}${phoneLine}${orgLine}`,
        `Subject: ${subject}`,
        ``,
        `Message:`,
        message.trim(),
      ].join('\n'),
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#F7F2EB;border-radius:4px">
          <p style="font-family:Georgia,serif;font-size:22px;font-style:italic;color:#0B0F1A;margin:0 0 24px">
            New Contact Message
          </p>
          <table style="width:100%;border-collapse:collapse;font-family:'DM Sans',sans-serif;font-size:14px">
            <tr><td style="padding:8px 0;color:#8A8880;width:120px">Name</td><td style="padding:8px 0;color:#2C2C2A">${escHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#8A8880">Email</td><td style="padding:8px 0"><a href="mailto:${escHtml(email)}" style="color:#C9A84C">${escHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#8A8880">Phone</td><td style="padding:8px 0;color:#2C2C2A">${escHtml(phone)}</td></tr>
            ${organisation?.trim() ? `<tr><td style="padding:8px 0;color:#8A8880">Organisation</td><td style="padding:8px 0;color:#2C2C2A">${escHtml(organisation)}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#8A8880">Subject</td><td style="padding:8px 0;color:#2C2C2A">${escHtml(subject)}</td></tr>
          </table>
          <div style="margin-top:24px;padding:20px;background:#fff;border-left:3px solid #C9A84C;border-radius:2px">
            <p style="font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.8;color:#2C2C2A;margin:0;white-space:pre-wrap">${escHtml(message.trim())}</p>
          </div>
          <p style="margin-top:24px;font-family:'DM Sans',sans-serif;font-size:12px;color:#8A8880">
            Sent from kafuideyinterviews.com — reply directly to this email to respond to ${escHtml(name)}.
          </p>
        </div>
      `,
    })

    // ── Auto-reply to sender ────────────────────────────────────────────────
    await resend.emails.send({
      from:    FROM_ADDRESS,
      to:      [email],
      subject: `We received your message — Kafui Dey`,
      text: [
        `Hi ${name},`,
        ``,
        `Thank you for reaching out. Your message has been received and we will get back to you within 2–3 business days.`,
        ``,
        `Your message:`,
        `"${message.trim()}"`,
        ``,
        `— The Kafui Dey Team`,
        `kafuideyinterviews.com`,
      ].join('\n'),
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#F7F2EB;border-radius:4px">
          <p style="font-family:Georgia,serif;font-size:22px;font-style:italic;color:#0B0F1A;margin:0 0 16px">
            Message received.
          </p>
          <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#2C2C2A;line-height:1.7">
            Hi ${escHtml(name)}, thank you for getting in touch. We will reply within 2–3 business days.
          </p>
          <div style="margin:24px 0;padding:16px 20px;background:#fff;border-left:3px solid #C9A84C;border-radius:2px">
            <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#8A8880;margin:0 0 6px">Your message:</p>
            <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#2C2C2A;margin:0;line-height:1.7;white-space:pre-wrap">${escHtml(message.trim())}</p>
          </div>
          <p style="font-family:'DM Sans',sans-serif;font-size:12px;color:#8A8880">
            — The Kafui Dey Team &nbsp;·&nbsp; <a href="https://kafuideyinterviews.com" style="color:#C9A84C">kafuideyinterviews.com</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ message: 'Message sent.' }, { status: 200 })
  } catch (err) {
    console.error('[Contact send error]', err)
    return NextResponse.json(
      { message: 'Failed to send message. Please try again later.' },
      { status: 500 },
    )
  }
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}