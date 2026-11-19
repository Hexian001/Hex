import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Swarm } from "@/components/Swarm";
import { Playground } from "@/components/Playground";
import { Capacity } from "@/components/Capacity";
import { NodesTeaser } from "@/components/NodesTeaser";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main id="ai" className="min-h-screen bg-ink">
      <Nav />
      <Hero />
      <Swarm />
      <Playground />
      <Capacity />
      <NodesTeaser />
      <Footer />
    </main>
  );
}
