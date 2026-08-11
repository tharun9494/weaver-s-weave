import { Heart, Eye, ShoppingBag, Play } from "lucide-react";
import { motion } from "motion/react";
import { formatINR, type Product } from "@/data/catalog";
import { useCartWishlist } from "@/hooks/use-cart-wishlist";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { isInWishlist, addToWishlist, removeFromWishlist, addToCart } = useCartWishlist();

  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, 1);
  };

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
          onError={(e) => {
            // Hide broken local image refs in test environment
            e.currentTarget.style.display = "none";
          }}
        />

        {product.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-card/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur-md">
            {product.badge}
          </span>
        ) : null}

        <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-100 lg:opacity-0 transition-all duration-500 lg:group-hover:opacity-100">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className="rounded-full bg-card/85 p-2.5 text-foreground backdrop-blur-md transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer shadow-soft"
          >
            <Heart
              className={`size-4 ${inWishlist ? "fill-accent text-accent" : "text-foreground"}`}
              strokeWidth={1.4}
            />
          </button>

          {/* Quick View Button */}
          <button
            type="button"
            onClick={() =>
              toast.info(`Loom Trace Number: ${product.id.toUpperCase()} • Authentic Weave`)
            }
            aria-label="Quick view"
            className="rounded-full bg-card/85 p-2.5 text-foreground backdrop-blur-md transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer shadow-soft"
          >
            <Eye className="size-4" strokeWidth={1.4} />
          </button>

          {/* Instagram Video Link */}
          {product.instagramLink && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(product.instagramLink!, "_blank");
              }}
              aria-label="Watch loom story video"
              className="rounded-full bg-card/85 p-2.5 text-foreground backdrop-blur-md transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer shadow-soft"
            >
              <Play className="size-4 fill-current text-accent" strokeWidth={1.4} />
            </button>
          )}
        </div>

        <div className="absolute inset-x-4 bottom-4 translate-y-0 opacity-100 lg:translate-y-6 lg:opacity-0 transition-all duration-500 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          {/* Add to Bag Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary/95 px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] text-primary-foreground backdrop-blur-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-soft"
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
