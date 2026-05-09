# kafuideyinterviews.com — Interview System

## Files Included

```
sanity/
  schemas/
    interview.ts       ← Full Sanity document schema
    index.ts           ← Schema registry
  lib/
    client.ts          ← Sanity client, imageUrlBuilder, readingTime helper
    queries.ts         ← All GROQ queries + TypeScript types

components/interview/
  StoryBody.tsx        ← Portable text → editorial magazine renderer
  YouTubeEmbed.tsx     ← Lazy YouTube player (click-to-play, no iframe until click)
  ReadingProgressBar.tsx ← Gold progress bar at top of page
  InterviewCard.tsx    ← Card for the listing grid

app/(site)/interviews/
  page.tsx             ← Listing page — category filter + featured + grid
  [slug]/page.tsx      ← Story/book detail page — the main editorial experience
  
app/
  globals.css          ← Design tokens, drop cap, dark mode, fonts
tailwind.config.ts     ← Full brand config: navy, gold, cream, Cormorant, DM Sans
```

## Setup

### 1. Install dependencies
```bash
npm install next-sanity @sanity/image-url @portabletext/react
npm install -D @tailwindcss/typography @tailwindcss/line-clamp
```

### 2. Environment variables (.env.local)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token          # server-only, for mutations
```

### 3. Register schemas in your sanity.config.ts
```ts
import { schemaTypes } from './sanity/schemas'
// add to your defineConfig({ schema: { types: schemaTypes } })
```

### 4. Fonts (already in globals.css via Google Fonts)
- Cormorant Garamond — headings, drop cap, pull quotes
- DM Sans — body, UI, labels

## Story Page Features
- **Drop cap** on the first paragraph (automatic via CSS ::first-letter)
- **Pull quotes** — gold left-border blockquotes, set in Sanity Studio
- **Chapter headings** (h2) — large italic Cormorant Garamond
- **Section headings** (h3) — gold uppercase tracking label  
- **Inline images** — full, inset-left, or inset-right layout options
- **Chapter dividers** — gold ornament separator (✦)
- **Fact boxes** — gold-bordered callout blocks
- **YouTube embed** — click-to-play, no iframe until user interacts
- **Reading progress bar** — gold line at very top of viewport
- **Reading time estimate** — computed from word count at 200 wpm
- **Related interviews** — filtered by matching tags
- **Guest bio card** — photo + name + title
- **Patreon CTA** — bottom of every story
- **Full SEO** — generateMetadata, OG images, Twitter cards, JSON-LD ready

## Patreon Gating (next steps)
When `isPatreonOnly: true` on an interview:
1. Show teaser (first 2 paragraphs) only
2. Blur/lock the rest behind a Patreon OAuth wall
3. Implement `/api/auth/patreon` → OAuth callback → check tier → issue session JWT
4. Read session in the story page server component to conditionally render full `storyBody`
