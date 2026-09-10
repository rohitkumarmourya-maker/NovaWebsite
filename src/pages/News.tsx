import { newsItems } from '../lib/news-data'
import { PageHero } from '../components/Ui'
import { Seo, breadcrumbJsonLd } from '../lib/head'

export default function News() {
  return (
    <>
      <Seo
        title="News & Updates"
        description="News and updates from Nova Ventures Innovation and Technology."
        path="/news"
        jsonLd={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'News & Updates', path: '/news' }])]}
      />
      <PageHero eyebrow="News & Updates" title="What’s happening at Nova Ventures." />

      <section className="py-16 sm:py-24">
        <div className="container-nova">
          {newsItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-graphite-900/20 bg-sand-50 p-10 text-center sm:p-16">
              <p className="text-h4 font-semibold text-graphite-900">No news or updates published yet.</p>
              <p className="mx-auto mt-3 max-w-md text-small text-ink-500">
                This page will hold dated updates — announcements, milestones and company news — as soon as there is something to share.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {newsItems.map((item) => (
                <article key={item.id} className="border-t border-graphite-900/10 pt-6">
                  <p className="text-eyebrow font-bold uppercase text-ember-700">
                    {item.category} &middot; <time dateTime={item.date}>{item.date}</time>
                  </p>
                  <h2 className="mt-3 text-h4 font-semibold text-graphite-900">{item.title}</h2>
                  <p className="mt-2 text-small text-ink-500">{item.excerpt}</p>
                  {item.link && (
                    <a href={item.link} className="mt-3 inline-block text-small font-semibold text-ember-700" target="_blank" rel="noopener noreferrer">
                      Read more &rarr;
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
