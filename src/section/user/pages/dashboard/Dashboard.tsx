import HeroSection from '../home/components/HeroSection'
import CapabilitiesPanel from '../home/components/CapabilitiesPanel'
import InfoCards from '../home/components/InfoCards'

const UserDashboard = () => (
  <div className="relative py-4 sm:py-6">
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
      <HeroSection />

      <div className="space-y-6">
        <CapabilitiesPanel />
        <InfoCards />
      </div>
    </div>
  </div>
)

export default UserDashboard
