export interface Book {
  detectedTitle: string
  detectedAuthors: string
  detectedPublisher: string
  detectedLanguage: string
  booksFound: BookData[]
}

export interface BookData {
  source: 'google' | 'open_library' | 'hybrid'
  source_id: string
  title: string
  subtitle: string
  authors: string
  publisher: string
  isbn_13: string | null
  isbn_10: string | null
  language: string | null
  cover_url: string | null
  relevance_score?: number
}

export type DisplayedBook = Omit<
  BookData,
  'relevance_score' | 'source' | 'source_id'
>
