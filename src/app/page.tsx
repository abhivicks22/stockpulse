'use client'

import dynamic from 'next/dynamic'

// We dynamically import the UniverseExperience because Three.js/React Three Fiber
// relies heavily on browser APIs (window, document, WebGL limits) that crash on SSR.
const UniverseExperience = dynamic(() => import('@/components/landing/UniverseExperience'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="animate-pulse text-white/50 tracking-widest text-sm uppercase">
        Initializing Flight Systems...
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="bg-black text-white selection:bg-[#2962FF] selection:text-white">
      <UniverseExperience />
    </main>
  )
}
