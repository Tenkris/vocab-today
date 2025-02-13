import { Header } from "@/components/header";
import { LandingHero } from "@/components/landing-hero";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";

export default async function Home() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <Header />
        <LandingHero />
        <Features />
        <HowItWorks />
      </main>
    </>
  );
}
