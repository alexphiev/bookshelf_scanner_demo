export interface Book {
  detectedTitle: string
  detectedAuthors: string
  detectedPublisher: string
  booksFound: GoogleBooksResult[]
}

interface GoogleBooksResult {
  title: string
  subtitle?: string
  authors: string[]
  publisher: string
  publishedDate: string
  description: string
  industryIdentifiers: {
    type: string
    identifier: string
  }[]
  pageCount: number
  categories: string[]
  imageLinks: {
    smallThumbnail: string
    thumbnail: string
  }
  language: string
  previewLink: string
  infoLink: string
  canonicalVolumeLink: string
}
