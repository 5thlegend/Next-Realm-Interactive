import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { EngineSection } from '@/components/sections/EngineSection'
import { ThreePathsSection } from '@/components/sections/ThreePathsSection'
import { ProofSection } from '@/components/sections/ProofSection'
import { ForgeSection } from '@/components/sections/ForgeSection'
import { PortalSection } from '@/components/sections/PortalSection'
import { MembershipSection } from '@/components/sections/MembershipSection'
import { FinalCTASection } from '@/components/sections/FinalCTASection'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <EngineSection />
        <ThreePathsSection />
        <ProofSection />
        <ForgeSection />
        <PortalSection />
        <MembershipSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  )
}
