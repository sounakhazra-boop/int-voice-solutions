import { HeroSection } from "@/components/ui/HeroSection";
import { InitiativesSection } from "@/components/ui/InitiativesSection";
import { Navbar } from "@/components/ui/NavBar";
import { StatsBanner } from "@/components/ui/StataBannar";
import { UseCasesSection } from "@/components/ui/UseCaseSection";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <InitiativesSection />
      <UseCasesSection />
      <StatsBanner />
      {/* <Footer /> */}
    </>
  );
}
