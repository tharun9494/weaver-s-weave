import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { FeaturedSarees } from "@/components/site/FeaturedSarees";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { WhyUs } from "@/components/site/WhyUs";
import { WeaverJourney } from "@/components/site/WeaverJourney";
import { Newsletter, Testimonials } from "@/components/site/Testimonials";

const title = "Sahaana — Handloom Silk Sarees, Weaver Direct";
const description =
  "Authentic handwoven Kanchipuram, Banarasi and soft silk sarees sourced directly from weaver families. Silk Mark certified, no middlemen, fair loom pricing.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <FeaturedSarees />
      <CategoryGrid />
      <WhyUs />
      <WeaverJourney />
      <Testimonials />
      <Newsletter />
    </>
  );
}
