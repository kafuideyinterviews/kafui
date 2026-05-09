import type { StructureResolver } from 'sanity/structure'
import {
  DocumentsIcon,
  ImageIcon,
  StarIcon,
  CalendarIcon,
  CogIcon,
  PlayIcon,
} from '@sanity/icons'

/**
 * Custom desk structure for Kafui Dey Studio.
 *
 * Groups documents into logical sections in the sidebar:
 *   ── Content
 *       Interviews  (list + detail)
 *       Gallery
 *       Testimonials
 *       Career Milestones
 *   ── Settings
 *       Site Settings  (singleton)
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Kafui Dey')
    .items([
      // ── CONTENT ──────────────────────────────────────────────────────────
      S.listItem()
        .title('Content')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Content')
            .items([
              // Interviews — with sub-grouping by featured / all / members only
              S.listItem()
                .title('Interviews')
                .icon(PlayIcon)
                .child(
                  S.list()
                    .title('Interviews')
                    .items([
                      S.listItem()
                        .title('All Interviews')
                        .icon(PlayIcon)
                        .child(
                          S.documentTypeList('interview')
                            .title('All Interviews')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                        ),
                      S.listItem()
                        .title('Featured')
                        .icon(StarIcon)
                        .child(
                          S.documentTypeList('interview')
                            .title('Featured Interviews')
                            .filter('_type == "interview" && featured == true')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                        ),
                      S.listItem()
                        .title('Members Only')
                        .icon(CogIcon)
                        .child(
                          S.documentTypeList('interview')
                            .title('Members Only Interviews')
                            .filter('_type == "interview" && isPatreonOnly == true')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                        ),
                    ]),
                ),

              S.divider(),

              // Gallery
              S.listItem()
                .title('Gallery')
                .icon(ImageIcon)
                .child(
                  S.list()
                    .title('Gallery')
                    .items([
                      S.listItem()
                        .title('All Images')
                        .icon(ImageIcon)
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('All Gallery Images')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
                        ),
                      S.listItem()
                        .title('Featured Images')
                        .icon(StarIcon)
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('Featured Gallery Images')
                            .filter('_type == "galleryImage" && featured == true')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
                        ),
                    ]),
                ),

              // Testimonials
              S.listItem()
                .title('Testimonials')
                .icon(StarIcon)
                .child(
                  S.documentTypeList('testimonial')
                    .title('Testimonials')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }]),
                ),

              // Career Milestones
              S.listItem()
                .title('Career Milestones')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('milestone')
                    .title('Career Milestones')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }]),
                ),
            ]),
        ),

      S.divider(),

      // ── SETTINGS ─────────────────────────────────────────────────────────
      // Singleton — opens the document directly without a list view
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),
    ])
