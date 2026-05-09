import type { DefaultDocumentNodeResolver } from 'sanity/structure'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => {
  return S.document().views([S.view.form()])
}
