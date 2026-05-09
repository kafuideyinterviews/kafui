/**
 * InterviewPDF.tsx
 *
 * Renders an interview story as a beautifully typeset PDF using
 * @react-pdf/renderer. Designed to feel like a quality magazine printout:
 *   – A4 page size with proper margins (the "book" feel)
 *   – Cormorant Garamond-style serif layout via Times Roman (PDF built-in)
 *   – Drop cap on the first paragraph (approximated with large first letter)
 *   – Pull quotes, chapter headings, dividers, fact boxes
 *   – Cover page with interview title, guest, and date
 *   – Kafui Dey brand footer on every page with page numbers
 *
 * This runs SERVER-SIDE only (via the /api/interview/[slug]/pdf route).
 * Never import this into client components.
 */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { InterviewFull, StoryBodyBlock, PullQuote, Divider, FactBox } from '@/sanity/lib/queries'

// ── Colour tokens ─────────────────────────────────────────────────────────────
const NAVY  = '#0B0F1A'
const GOLD  = '#C9A84C'
const CREAM = '#F7F2EB'
const MUTED = '#8A8880'
const TEXT  = '#2C2C2A'

// ── Register fonts ────────────────────────────────────────────────────────────
// @react-pdf/renderer bundles Times-Roman, Helvetica, Courier as built-ins.
// For production, register actual Cormorant Garamond / DM Sans TTF files
// by uploading them to your CDN and uncommenting the Font.register calls below.
//
// Font.register({
//   family: 'Cormorant',
//   fonts: [
//     { src: 'https://cdn.kafuideyinterviews.com/fonts/CormorantGaramond-Regular.ttf' },
//     { src: 'https://cdn.kafuideyinterviews.com/fonts/CormorantGaramond-Italic.ttf', fontStyle: 'italic' },
//     { src: 'https://cdn.kafuideyinterviews.com/fonts/CormorantGaramond-SemiBold.ttf', fontWeight: 600 },
//   ],
// })
//
// Font.register({
//   family: 'DMSans',
//   fonts: [
//     { src: 'https://cdn.kafuideyinterviews.com/fonts/DMSans-Regular.ttf' },
//     { src: 'https://cdn.kafuideyinterviews.com/fonts/DMSans-Medium.ttf', fontWeight: 500 },
//     { src: 'https://cdn.kafuideyinterviews.com/fonts/DMSans-SemiBold.ttf', fontWeight: 600 },
//   ],
// })

const SERIF       = 'Times-Roman'
const SERIF_ITALIC = 'Times-Italic'
const SANS        = 'Helvetica'

// ── Stylesheet ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: CREAM,
    paddingTop:      64,
    paddingBottom:   56,
    paddingLeft:     72,
    paddingRight:    72,
    fontFamily:      SANS,
    fontSize:        11,
    color:           TEXT,
    lineHeight:      1.75,
  },

  // Cover page
  cover: {
    backgroundColor: NAVY,
    paddingTop:      80,
    paddingBottom:   80,
    paddingLeft:     72,
    paddingRight:    72,
    flexDirection:   'column',
    justifyContent:  'flex-end',
  },
  coverKicker: {
    fontFamily:      SANS,
    fontSize:        8,
    fontWeight:      700,
    letterSpacing:   2,
    color:           GOLD,
    textTransform:   'uppercase',
    marginBottom:    16,
  },
  coverTitle: {
    fontFamily:      SERIF,
    fontSize:        36,
    color:           '#FFFFFF',
    lineHeight:      1.2,
    marginBottom:    16,
  },
  coverGuest: {
    fontFamily:      SANS,
    fontSize:        9,
    fontWeight:      700,
    letterSpacing:   2,
    color:           GOLD,
    textTransform:   'uppercase',
    marginBottom:    6,
  },
  coverGuestTitle: {
    fontFamily:      SANS,
    fontSize:        11,
    color:           'rgba(255,255,255,0.6)',
    marginBottom:    40,
  },
  coverMeta: {
    fontFamily:      SANS,
    fontSize:        9,
    color:           'rgba(255,255,255,0.35)',
    borderTopWidth:  0.5,
    borderTopColor:  'rgba(255,255,255,0.15)',
    paddingTop:      16,
    marginTop:       'auto',
  },
  coverGoldBar: {
    width:           40,
    height:          2,
    backgroundColor: GOLD,
    marginBottom:    32,
  },

  // Opening quote page
  openingPage: {
    backgroundColor: CREAM,
    paddingTop:      100,
    paddingBottom:   80,
    paddingLeft:     80,
    paddingRight:    80,
    flexDirection:   'column',
    justifyContent:  'center',
  },
  openingQuoteMark: {
    fontFamily:      SERIF,
    fontSize:        80,
    color:           GOLD,
    lineHeight:      0.8,
    marginBottom:    8,
  },
  openingQuoteText: {
    fontFamily:      SERIF_ITALIC,
    fontSize:        20,
    lineHeight:      1.5,
    color:           NAVY,
    marginBottom:    24,
  },
  openingQuoteAttrib: {
    fontFamily:      SANS,
    fontSize:        8,
    letterSpacing:   2,
    textTransform:   'uppercase',
    color:           GOLD,
  },

  // Story body
  paragraph: {
    fontFamily:      SERIF,
    fontSize:        11.5,
    lineHeight:      1.85,
    color:           TEXT,
    marginBottom:    14,
    textAlign:       'justify',
  },
  firstParagraph: {
    fontFamily:      SERIF,
    fontSize:        11.5,
    lineHeight:      1.85,
    color:           TEXT,
    marginBottom:    14,
    textAlign:       'justify',
  },
  dropCapContainer: {
    flexDirection:   'row',
    alignItems:      'flex-start',
    marginBottom:    14,
  },
  dropCap: {
    fontFamily:      SERIF,
    fontSize:        56,
    lineHeight:      0.82,
    color:           GOLD,
    marginRight:     4,
    marginTop:       2,
  },
  dropCapRemainder: {
    fontFamily:      SERIF,
    fontSize:        11.5,
    lineHeight:      1.85,
    color:           TEXT,
    flex:            1,
    textAlign:       'justify',
  },
  chapterHeading: {
    fontFamily:      SERIF_ITALIC,
    fontSize:        20,
    color:           NAVY,
    marginTop:       32,
    marginBottom:    12,
    lineHeight:      1.3,
  },
  sectionHeading: {
    fontFamily:      SANS,
    fontSize:        7.5,
    fontWeight:      700,
    letterSpacing:   2.5,
    textTransform:   'uppercase',
    color:           GOLD,
    marginTop:       24,
    marginBottom:    8,
  },
  pullQuoteContainer: {
    marginVertical:  28,
    paddingLeft:     16,
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
  },
  pullQuoteText: {
    fontFamily:      SERIF_ITALIC,
    fontSize:        15,
    lineHeight:      1.5,
    color:           NAVY,
    marginBottom:    8,
  },
  pullQuoteAttrib: {
    fontFamily:      SANS,
    fontSize:        7.5,
    letterSpacing:   2,
    textTransform:   'uppercase',
    color:           GOLD,
  },
  dividerRow: {
    flexDirection:   'row',
    alignItems:      'center',
    marginVertical:  24,
  },
  dividerLine: {
    flex:            1,
    height:          0.5,
    backgroundColor: MUTED,
    opacity:         0.3,
  },
  dividerOrnament: {
    fontFamily:      SERIF,
    fontSize:        12,
    color:           GOLD,
    marginHorizontal: 10,
  },
  factBoxContainer: {
    marginVertical:  20,
    padding:         16,
    borderWidth:     0.5,
    borderColor:     GOLD,
    borderStyle:     'solid',
    backgroundColor: 'rgba(201,168,76,0.05)',
  },
  factBoxHeading: {
    fontFamily:      SANS,
    fontSize:        7.5,
    fontWeight:      700,
    letterSpacing:   2,
    textTransform:   'uppercase',
    color:           GOLD,
    marginBottom:    6,
  },
  factBoxBody: {
    fontFamily:      SANS,
    fontSize:        10.5,
    lineHeight:      1.65,
    color:           TEXT,
  },
  caption: {
    fontFamily:      SANS,
    fontSize:        9,
    color:           MUTED,
    textAlign:       'center',
    marginBottom:    12,
  },

  // Footer
  footer: {
    position:        'absolute',
    bottom:          24,
    left:            72,
    right:           72,
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    borderTopWidth:  0.5,
    borderTopColor:  'rgba(0,0,0,0.15)',
    paddingTop:      8,
  },
  footerBrand: {
    fontFamily:      SERIF_ITALIC,
    fontSize:        8,
    color:           MUTED,
  },
  footerPage: {
    fontFamily:      SANS,
    fontSize:        8,
    color:           MUTED,
  },
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

/** Extracts plain text from a portable text block children array */
function blockText(block: Record<string, unknown>): string {
  if (!Array.isArray(block.children)) return ''
  return (block.children as { text?: string }[])
    .map((c) => c.text ?? '')
    .join('')
}

// ── Block renderers ───────────────────────────────────────────────────────────

function RenderBlock({ block, isFirst }: { block: StoryBodyBlock; isFirst: boolean }) {
  const b = block as Record<string, unknown>

  // Pull quote
  if (b._type === 'pullQuote') {
    const pq = block as PullQuote
    return (
      <View style={s.pullQuoteContainer}>
        <Text style={s.pullQuoteText}>“{pq.quote}”</Text>
        {pq.attribution && <Text style={s.pullQuoteAttrib}>{pq.attribution}</Text>}
      </View>
    )
  }

  // Divider
  if (b._type === 'divider') {
    const dv = block as Divider
    return (
      <View style={s.dividerRow}>
        <View style={s.dividerLine} />
        <Text style={s.dividerOrnament}>{dv.label ?? '✦'}</Text>
        <View style={s.dividerLine} />
      </View>
    )
  }

  // Fact box
  if (b._type === 'factBox') {
    const fb = block as FactBox
    return (
      <View style={s.factBoxContainer}>
        {fb.heading && <Text style={s.factBoxHeading}>{fb.heading}</Text>}
        <Text style={s.factBoxBody}>{fb.body}</Text>
      </View>
    )
  }

  // Story image — skip in PDF (can't fetch remote images reliably without CDN allowlist)
  if (b._type === 'storyImage') {
    const caption = (b as { caption?: string }).caption
    return caption ? <Text style={s.caption}>[Image: {caption}]</Text> : null
  }

  // Standard portable text block
  if (b._type === 'block') {
    const style  = (b.style as string) ?? 'normal'
    const text   = blockText(b)

    if (style === 'h2') return <Text style={s.chapterHeading}>{text}</Text>
    if (style === 'h3') return <Text style={s.sectionHeading}>{text}</Text>
    if (style === 'caption') return <Text style={s.caption}>{text}</Text>

    // Drop cap on first normal paragraph
    if (isFirst && style === 'normal' && text.length > 1) {
      return (
        <View style={s.dropCapContainer}>
          <Text style={s.dropCap}>{text.charAt(0)}</Text>
          <Text style={s.dropCapRemainder}>{text.slice(1)}</Text>
        </View>
      )
    }

    return <Text style={s.paragraph}>{text}</Text>
  }

  return null
}

// ── Main PDF Document ─────────────────────────────────────────────────────────

export function InterviewPDFDocument({ interview }: { interview: InterviewFull }) {
  const blocks = interview.storyBody ?? []

  // Track which block is the first normal paragraph (for drop cap)
  let firstNormalSeen = false

  return (
    <Document
      title={interview.title}
      author="Kafui Dey"
      subject={`Interview with ${interview.guest}`}
      keywords={[interview.category, ...(interview.tags ?? [])].filter(Boolean).join(', ')}
      creator="kafuideyinterviews.com"
      producer="@react-pdf/renderer"
    >
      {/* ── Cover Page ─────────────────────────────────────────── */}
      <Page size="A4" style={s.cover}>
        <View style={{ flex: 1 }} />
        <View style={s.coverGoldBar} />
        <Text style={s.coverKicker}>Kafui Dey Interviews</Text>
        <Text style={s.coverTitle}>{interview.title}</Text>
        <Text style={s.coverGuest}>{interview.guest}</Text>
        {interview.guestTitle && (
          <Text style={s.coverGuestTitle}>{interview.guestTitle}</Text>
        )}
        {interview.category && (
          <Text style={{ ...s.coverGuest, fontSize: 7.5, color: 'rgba(201,168,76,0.6)', marginBottom: 40 }}>
            {interview.category}
          </Text>
        )}
        <Text style={s.coverMeta}>
          {formatDate(interview.publishedAt)}
          {'  ·  '}
          kafuideyinterviews.com
        </Text>
      </Page>

      {/* ── Opening Quote Page ─────────────────────────────────── */}
      {interview.openingQuote && (
        <Page size="A4" style={s.openingPage}>
          <Text style={s.openingQuoteMark}>“</Text>
          <Text style={s.openingQuoteText}>{interview.openingQuote}</Text>
          {interview.openingQuoteAttrib && (
            <Text style={s.openingQuoteAttrib}>{interview.openingQuoteAttrib}</Text>
          )}
        </Page>
      )}

      {/* ── Story Pages ────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        {/* Chapter title at top of first story page */}
        <Text style={{ ...s.chapterHeading, marginTop: 0 }}>{interview.title}</Text>
        <Text style={{ ...s.sectionHeading, marginTop: 0, marginBottom: 24 }}>
          {interview.guest}
          {interview.guestTitle ? `  —  ${interview.guestTitle}` : ''}
        </Text>

        {/* Story body blocks */}
        {blocks.map((block, i) => {
          const b = block as Record<string, unknown>
          const isFirstNormal =
            !firstNormalSeen &&
            b._type === 'block' &&
            ((b.style as string) ?? 'normal') === 'normal'

          if (isFirstNormal) firstNormalSeen = true

          return (
            <RenderBlock
              key={String(b._key ?? i)}
              block={block}
              isFirst={isFirstNormal}
            />
          )
        })}

        {/* Footer on every story page */}
        <View style={s.footer} fixed>
          <Text style={s.footerBrand}>Kafui Dey</Text>
          <Text style={s.footerPage} render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          } />
        </View>
      </Page>

      {/* ── Back Page ──────────────────────────────────────────── */}
      <Page size="A4" style={{ ...s.cover, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ ...s.coverKicker, textAlign: 'center', marginBottom: 12 }}>
          kafuideyinterviews.com
        </Text>
        <Text style={{ fontFamily: SERIF_ITALIC, fontSize: 14, color: '#FFFFFF', textAlign: 'center', marginBottom: 24 }}>
          Conversations That Matter
        </Text>
        <View style={{ width: 32, height: 1, backgroundColor: GOLD }} />
        <Text style={{ ...s.coverMeta, borderTopWidth: 0, paddingTop: 0, marginTop: 32, textAlign: 'center' }}>
          © {new Date().getFullYear()} Kafui Dey. All rights reserved.
        </Text>
      </Page>
    </Document>
  )
}