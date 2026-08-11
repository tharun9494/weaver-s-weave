import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { categories } from "@/data/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { useProducts } from "@/hooks/use-products";
import { Search, Loader2 } from "lucide-react";

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
  const { products, loading } = useProducts();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  // Filter products by active filters and search query
  const filteredProducts = products.filter((product) => {
    const matchesFilter =
      selectedFilter === "All" || product.occasion.toLowerCase() === selectedFilter.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.weave.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.weaver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Duplicate items for visual density in the display layout (like the original design)
  const grid = [...filteredProducts, ...filteredProducts.map((p) => ({ ...p, id: `${p.id}-dup` }))];

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

      {/* SEARCH AND FILTER SECTION */}
      <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-border/60 pb-8">
        {/* Active Filters */}
        <Reveal
          delay={0.1}
          className="flex overflow-x-auto no-scrollbar gap-3 -mx-5 px-5 pb-3 flex-nowrap sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap snap-x snap-mandatory"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`shrink-0 snap-start rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.2em] transition-all duration-500 cursor-pointer ${
                selectedFilter === filter
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "border border-border text-muted-foreground hover:border-accent hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </Reveal>

        {/* Search Bar Input */}
        <div className="relative w-full max-w-xs self-start lg:self-auto">
          <Search className="absolute left-4 top-3.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sarees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-transparent py-3 pl-11 pr-5 text-xs tracking-wider transition-all focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* PRODUCTS DISPLAY GRID */}
      {grid.length === 0 ? (
        <div className="mt-20 text-center text-sm text-muted-foreground">
          No sarees match your selected criteria. Try resetting filters or search query.
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-6 sm:gap-y-14">
          {grid.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i % 4} />
          ))}
        </div>
      )}
    </div>
  );
}
