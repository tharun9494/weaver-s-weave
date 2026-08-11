import { Heart, Eye, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { formatINR, type Product } from "@/data/catalog";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-secondary">
        <img
          src={product.image}
          alt={`${product.name} — ${product.weave}`}
          loading="lazy"
          width={1000}
          height={1300}
          className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
        />

        {product.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-card/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur-md">
            {product.badge}
          </span>
        ) : null}

        <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-100 lg:opacity-0 transition-all duration-500 lg:group-hover:opacity-100">
          {[Heart, Eye].map((Icon, i) => (
            <button
              key={i}
              type="button"
              aria-label={i === 0 ? "Add to wishlist" : "Quick view"}
              className="rounded-full bg-card/85 p-2.5 text-foreground backdrop-blur-md transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Icon className="size-4" strokeWidth={1.4} />
            </button>
          ))}
        </div>

        <div className="absolute inset-x-4 bottom-4 translate-y-0 opacity-100 lg:translate-y-6 lg:opacity-0 transition-all duration-500 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary/95 px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] text-primary-foreground backdrop-blur-md"
          >
            <ShoppingBag className="size-3.5" strokeWidth={1.5} /> Add to bag
          </button>
        </div>
      </div>

      <div className="mt-5">
        <p className="eyebrow text-[9px]">{product.weave}</p>
        <h3 className="mt-2 font-display text-xl text-foreground">{product.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{product.weaver}</p>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-sm text-foreground">{formatINR(product.price)}</span>
          {product.compareAt ? (
            <span className="text-xs text-muted-foreground line-through">
              {formatINR(product.compareAt)}
            </span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
