import { leadershipProfiles } from '../lib/leadership-data'
import { SectionHeading } from './Ui'

export default function Leadership() {
  return (
    <section id="leadership" className="scroll-mt-24 bg-sand-50 py-20 sm:py-28">
      <div className="container-nova">
        <SectionHeading eyebrow="Our people" title="Executive Leadership & Board of Directors" lead={leadershipProfiles.some((profile) => profile.status === 'published') ? 'Meet the people guiding Nova Ventures.' : 'Leadership profiles will be shared here as they are confirmed.'} />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:max-w-5xl">
          {leadershipProfiles.map((profile) => (
            <article key={profile.id} className="overflow-hidden rounded-3xl border border-graphite-900/10 bg-white">
              <div className="relative flex aspect-[4/3] items-center justify-center bg-graphite-900 text-white/40">
                {profile.photo ? <img src={profile.photo} alt={profile.fullName} loading="lazy" width={640} height={480} className="absolute inset-0 h-full w-full object-cover" /> : (
                  <div className="flex flex-col items-center gap-4">
                    <svg width="88" height="88" viewBox="0 0 88 88" fill="none" aria-hidden="true"><circle cx="44" cy="28" r="14" stroke="currentColor" strokeWidth="2" /><path d="M16 78v-8c0-14 12-25 28-25s28 11 28 25v8" stroke="currentColor" strokeWidth="2" /></svg>
                    <span className="text-small">Portrait to follow</span>
                  </div>
                )}
              </div>
              <div className="p-7 sm:p-8">
                <p className="text-small font-semibold text-ember-700">{profile.designation}</p>
                <h3 className="mt-2 text-h3 font-semibold text-graphite-900">{profile.fullName}</h3>
                <p className="mt-4 text-body text-ink-700">{profile.bio}</p>
                {profile.status === 'pending' && <p className="mt-5 text-small text-ink-500">Profile coming soon</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
