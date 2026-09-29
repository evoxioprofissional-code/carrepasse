import { HomeHero } from "@/components/home/HomeHero";
import { HomeMarketplace } from "@/components/home/HomeMarketplace";

export default function HomePage() {
  return (
    // Área clara vai até o footer (anula o espaçamento inferior do <main>).
    <div className="-mb-20 bg-paper">
      <HomeHero />
      <HomeMarketplace />
    </div>
  );
}
