import { HeroSection }      from "@/components/sections/HeroSection";
import { BenefitsSection }   from "@/components/sections/BenefitsSection";
import { ServicesPreview }   from "@/components/sections/ServicesPreview";
import { AboutTeaser }       from "@/components/sections/AboutTeaser";
import { MedellinSection }   from "@/components/sections/MedellinSection";
import { TeamPreview }       from "@/components/sections/TeamPreview";
import { ProcessSection }    from "@/components/sections/ProcessSection";
import { CTABanner }         from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <ServicesPreview />
      <AboutTeaser />
      <MedellinSection />
      <TeamPreview />
      <ProcessSection />
      <CTABanner />
    </>
  );
}
