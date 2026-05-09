import { groq } from 'next-sanity'

const sanityImageFragment = groq`asset->{ url, metadata { dimensions, lqip } }, alt`
const coverImageFragment  = groq`coverImage { ${sanityImageFragment} }`
const guestPhotoFragment  = groq`guestPhoto  { ${sanityImageFragment} }`
const storyBodyFragment   = groq`storyBody[] { ..., _type == "storyImage" => { ..., image { ${sanityImageFragment} } } }`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroHeadline,
    heroBio,
    heroSlides[] {
      _key,
      type,
      videoUrl,
      caption,
      image       { ${sanityImageFragment} },
      videoPoster { ${sanityImageFragment} },
    },
    aboutBio,
    aboutPhoto { ${sanityImageFragment} },
    patreonUrl, youtubeChannelUrl, spotifyUrl, twitterHandle, instagramHandle, contactEmail,
  }
`

export const interviewsListQuery = groq`
  *[_type == "interview"] | order(publishedAt desc) {
    _id, title, slug, guest, guestTitle, excerpt,
    youtubeId, youtubeUrl, spotifyEpisodeId, duration, publishedAt,
    category, tags,
    isPatreonOnly, patreonTier, featured,
    ${coverImageFragment}, ${guestPhotoFragment},
  }
`
export const featuredInterviewQuery = groq`
  *[_type == "interview" && featured == true] | order(publishedAt desc) [0] {
    _id, title, slug, guest, guestTitle, excerpt,
    openingQuote, youtubeId, publishedAt, category, tags, isPatreonOnly,
    ${coverImageFragment},
  }
`
export const featuredCarouselQuery = groq`
  *[_type == "interview" && featured == true] | order(publishedAt desc) [0..3] {
    _id, title, slug, guest, guestTitle, excerpt,
    openingQuote, youtubeId, publishedAt, category, tags, isPatreonOnly,
    ${coverImageFragment},
  }
`
export const interviewBySlugQuery = groq`
  *[_type == "interview" && slug.current == $slug][0] {
    _id, title, slug, guest, guestTitle, excerpt,
    youtubeUrl, youtubeId, duration, publishedAt, category, tags,
    isPatreonOnly, patreonTier, openingQuote, openingQuoteAttrib,
    seoTitle, seoDescription,
    ${coverImageFragment}, ${guestPhotoFragment},
    ${storyBodyFragment},
  }
`
export const relatedInterviewsQuery = groq`
  *[_type == "interview" && slug.current != $slug && category == $category]
  | order(publishedAt desc) [0..2] {
    _id, title, slug, guest, guestTitle, excerpt, youtubeId, publishedAt, category,
    ${coverImageFragment},
  }
`
export const latestInterviewsQuery = groq`
  *[_type == "interview"] | order(publishedAt desc) [0..5] {
    _id, title, slug, guest, guestTitle, excerpt,
    youtubeId, publishedAt, category, tags, isPatreonOnly,
    ${coverImageFragment},
  }
`
// One representative interview per category (most recent), for homepage category tiles
export const categoryTilesQuery = groq`
  *[_type == "interview" && defined(category)] | order(publishedAt desc) {
    category,
    ${coverImageFragment},
  }
`
export const galleryQuery = groq`
  *[_type == "galleryImage"] | order(order asc) {
    _id, image { ${sanityImageFragment} }, caption, category, dateTaken, featured, order,
  }
`
export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id, person, role, photo { ${sanityImageFragment} },
    quote, videoUrl, videoId, featured, order,
  }
`
export const milestonesQuery = groq`
  *[_type == "milestone"] | order(order asc) {
    _id, year, title, organisation, logo { ${sanityImageFragment} }, description, order,
  }
`

// ── Types ─────────────────────────────────────────────────────────────────────
export type SanityImage = {
  asset: { url: string; metadata: { dimensions: { width: number; height: number }; lqip: string } }
  alt: string
}

export type HeroSlide = {
  _key:         string
  type:         'video' | 'image'
  videoUrl?:    string
  caption?:     string
  image?:       SanityImage
  videoPoster?: SanityImage
}

export type SiteSettings = {
  heroHeadline?:     string
  heroBio?:          string
  heroSlides?:       HeroSlide[]
  aboutBio?:         Record<string, unknown>[]
  aboutPhoto?:       SanityImage
  patreonUrl?:       string
  youtubeChannelUrl?: string
  spotifyUrl?:       string
  twitterHandle?:    string
  instagramHandle?:  string
  contactEmail?:     string
}

export type InterviewCard = {
  _id: string; title: string; slug: { current: string }
  guest: string; guestTitle?: string; excerpt: string
  youtubeId?: string; youtubeUrl?: string; spotifyEpisodeId?: string
  duration?: string; publishedAt: string
  category?: string; tags?: string[]
  isPatreonOnly: boolean; patreonTier?: string
  featured: boolean; coverImage: SanityImage; guestPhoto?: SanityImage
  openingQuote?: string
}
export type PullQuote  = { _type: 'pullQuote';  _key: string; quote: string; attribution?: string }
export type StoryImage = { _type: 'storyImage'; _key: string; image: SanityImage; alt: string; caption?: string; layout: 'full' | 'inset-left' | 'inset-right' }
export type Divider    = { _type: 'divider';    _key: string; label?: string }
export type FactBox    = { _type: 'factBox';    _key: string; heading: string; body: string }
export type StoryBodyBlock = PullQuote | StoryImage | Divider | FactBox | Record<string, unknown>
export type InterviewFull = InterviewCard & {
  youtubeUrl?: string; openingQuote?: string; openingQuoteAttrib?: string
  seoTitle?: string; seoDescription?: string; storyBody: StoryBodyBlock[]
}
export type CategoryTile = { category: string; coverImage: SanityImage }
export type GalleryImage = {
  _id: string; image: SanityImage; caption?: string
  category: string; dateTaken?: string; featured: boolean; order: number
}
export type Testimonial = {
  _id: string; person: string; role: string; photo?: SanityImage
  quote: string; videoUrl?: string; videoId?: string; featured: boolean; order: number
}
export type Milestone = {
  _id: string; year: string; title: string; organisation?: string
  logo?: SanityImage; description?: string; order: number
}