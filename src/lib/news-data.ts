export type NewsItem = {
  id: string
  date: string
  category: string
  title: string
  excerpt: string
  link?: string
  status: 'draft' | 'published' | 'archived'
}

/** Add approved announcements here. Use YYYY-MM-DD for date and a unique stable id. */
export const newsEntries: NewsItem[] = []
export const newsItems = newsEntries
  .filter((item) => item.status === 'published')
  .sort((a, b) => b.date.localeCompare(a.date))
