import { CTAButton } from '../components/Ui'
import { Seo } from '../lib/head'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you are looking for does not exist or has moved." path="/404" noindex />
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pb-16 pt-32 text-center">
        <p className="font-display text-[clamp(4rem,12vw,8rem)] font-extrabold leading-none text-ember">404</p>
        <h1 className="mt-4 text-h2 font-bold text-graphite-900">Page not found</h1>
        <p className="mt-4 max-w-md text-body text-ink-500">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CTAButton to="/">Back to Home</CTAButton>
          <CTAButton to="/businesses" variant="ghost">
            Explore our businesses
          </CTAButton>
        </div>
      </section>
    </>
  )
}
