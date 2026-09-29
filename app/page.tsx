import { AudienceSection } from "@/components/home/AudienceSection";
import { BrowseShortcuts } from "@/components/home/BrowseShortcuts";
import { DealsCarousel } from "@/components/home/DealsCarousel";
import { FinalCta } from "@/components/home/FinalCta";
import { HomeHero } from "@/components/home/HomeHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { RecentListings } from "@/components/home/RecentListings";
import { TrustStrip } from "@/components/home/TrustStrip";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustStrip />
      <DealsCarousel />
      <BrowseShortcuts />
      <RecentListings />
      <HowItWorks />
      <AudienceSection />
      <FinalCta />
    </>
  );
}
