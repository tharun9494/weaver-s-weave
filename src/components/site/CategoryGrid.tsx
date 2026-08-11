import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/catalog";
import { SectionHeading } from "./Reveal";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow="Premium categories"
        title="Six weaves, one standard of purity"
        description="From bridal Kanchipuram with temple borders to featherlight Mysore soft silk — each weave is sourced from the cluster it was born in."
      />

      <div className="mt-16 flex overflow-x-auto no-scrollbar gap-5 -mx-5 px-5 pb-6 flex-nowrap snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:mx-0 sm:px-0 sm:pb-0">
        {categories.map((category, i) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="snap-start shrink-0 w-[80vw] sm:w-auto"
          >
            <Link
              to="/collections"
              className="group relative block overflow-hidden rounded-3xl shadow-soft"
            >
              <img
                src={category.image}
                alt={`${category.name} silk sarees`}
                loading="lazy"
                width={1000}
                height={1300}
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-2xl text-primary-foreground">{category.name}</h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70">
                    {category.count} pieces
                  </p>
                </div>
                <span className="rounded-full border border-primary-foreground/40 p-2 text-primary-foreground transition-colors duration-500 group-hover:border-accent group-hover:text-accent">
                  <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
