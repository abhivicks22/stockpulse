import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import MissionStats from '@/components/landing/MissionStats'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main className="bg-[#000000] text-white selection:bg-[#2962FF] selection:text-white">
      <Navbar />
      <Hero />
      <MissionStats />

      {/* We reuse the generic CTA block but wrap it to ensure black background continuation */}
      <div className="bg-[#000000] border-t border-white/10">
        <CTA />
      </div>

      <div className="bg-[#000000] border-t border-white/10">
        <Footer />
      </div>
    </main>
  )
}
