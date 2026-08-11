import { products } from "@/data/catalog";
import { ProductCard } from "./ProductCard";
import { SectionHeading } from "./Reveal";
import { Link } from "@tanstack/react-router";

export function FeaturedSarees() {
  return (
    <section className="bg-gradient-ivory">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          eyebrow="The atelier selection"
          title="Featured sarees of the season"
          description="Four pieces chosen by our master weavers this month — each one loom-numbered and traceable."
        />
        <div className="mt-16 flex overflow-x-auto no-scrollbar gap-x-6 pb-6 -mx-5 px-5 flex-nowrap snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:mx-0 sm:px-0 sm:pb-0 gap-y-14">
          {products.map((product, i) => (
            <div key={product.id} className="snap-start shrink-0 w-[80vw] sm:w-auto">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <Link
            to="/collections"
            className="rounded-full border border-accent/60 px-10 py-4 text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors duration-500 hover:bg-accent/12"
          >
            View all collections
          </Link>
        </div>
      </div>
    </section>
  );
}
