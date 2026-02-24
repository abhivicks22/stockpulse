import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import PlatformPreview from '@/components/landing/PlatformPreview'
import MarketTicker from '@/components/landing/MarketTicker'
import Features from '@/components/landing/Features'
import SocialProof from '@/components/landing/SocialProof'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PlatformPreview />
      <MarketTicker />
      <Features />
      <SocialProof />
      <CTA />
      <Footer />
    </main>
  )
}
