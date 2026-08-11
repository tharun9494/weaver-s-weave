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
        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-6 sm:gap-y-14">
          {products.slice(0, 4).map((product, i) => (
            <div key={product.id} className="w-full">
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
