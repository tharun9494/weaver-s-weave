import { createFileRoute } from "@tanstack/react-router";
import { products, categories } from "@/data/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";

const title = "Silk Saree Collections — Sahaana Handloom";
const description =
  "Browse bridal Kanchipuram, Banarasi brocade, Mysore soft silk and designer tussar sarees, each traceable to the weaver who made it.";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Collections,
});

const filters = ["All", "Bridal", "Wedding", "Festival", "Reception"];

function Collections() {
  const grid = [...products, ...products.map((p) => ({ ...p, id: `${p.id}-b` }))];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Collections</p>
        <h1 className="mt-4 max-w-2xl text-4xl leading-[1.05] text-foreground sm:text-6xl">
          The full <em className="text-gold-gradient not-italic">handloom</em> archive
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {categories.reduce((sum, c) => sum + c.count, 0)} sarees across six weaves, all
          loom-numbered and Silk Mark certified.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 flex overflow-x-auto no-scrollbar gap-3 -mx-5 px-5 pb-3 flex-nowrap sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap snap-x snap-mandatory">
        {filters.map((filter, i) => (
          <button
            key={filter}
            type="button"
            className={`shrink-0 snap-start rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 ${
              i === 0
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:border-accent hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </Reveal>

      <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {grid.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i % 4} />
        ))}
      </div>
    </div>
  );
}
