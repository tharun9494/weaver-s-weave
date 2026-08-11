import { Heart, Eye, ShoppingBag, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { formatINR, type Product } from "@/data/catalog";
import { useCartWishlist } from "@/hooks/use-cart-wishlist";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { isInWishlist, addToWishlist, removeFromWishlist, addToCart } = useCartWishlist();
  const [showQuickView, setShowQuickView] = useState(false);

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
      className="group relative flex flex-col justify-between h-full"
    >
      <div>
        <div
          onClick={() => setShowQuickView(true)}
          className="relative overflow-hidden rounded-2xl bg-secondary cursor-pointer"
        >
          <img
            src={product.image}
            alt={`${product.name} — ${product.weave}`}
            loading="lazy"
            width={1000}
            height={1300}
            className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
            onError={(e) => {
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickView(true);
              }}
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
        </div>

        <div className="mt-5" onClick={() => setShowQuickView(true)}>
          <p className="eyebrow text-[9px]">{product.weave}</p>
          <h3 className="mt-2 font-display text-lg text-foreground group-hover:text-accent transition-colors truncate cursor-pointer">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground truncate">{product.weaver}</p>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-sm font-semibold text-foreground font-sans">
              {formatINR(product.price)}
            </span>
            {product.compareAt ? (
              <span className="text-xs text-muted-foreground line-through font-sans">
                {formatINR(product.compareAt)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Add to Bag Button placed clearly below metadata */}
      <div className="mt-5">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary/95 py-2.5 text-[10px] uppercase tracking-[0.2em] text-primary-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-soft font-sans font-semibold"
        >
          <ShoppingBag className="size-3.5" strokeWidth={1.5} /> Add to bag
        </button>
      </div>

      {/* Product Quick View Details Modal */}
      <AnimatePresence>
        {showQuickView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setShowQuickView(false)}
            />

            {/* Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-accent/25 bg-card p-6 shadow-luxe max-h-[85vh] overflow-y-auto no-scrollbar md:p-8 z-10"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowQuickView(false)}
                className="absolute right-5 top-5 rounded-full border border-border p-1.5 text-foreground hover:bg-secondary cursor-pointer z-20"
                aria-label="Close modal"
              >
                <X className="size-4" />
              </button>

              <div className="grid gap-6 md:grid-cols-2 mt-4">
                {/* Product Image */}
                <div className="overflow-hidden rounded-2xl bg-secondary aspect-[4/5] w-full shadow-soft">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="eyebrow">{product.weave}</p>
                    <h3 className="mt-2 font-display text-2xl text-foreground leading-tight">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-xs text-accent uppercase tracking-widest">
                      {product.badge || "Authentic Weave"}
                    </p>

                    <div className="mt-4 flex items-baseline gap-3">
                      <span className="text-xl font-semibold text-foreground font-sans">
                        {formatINR(product.price)}
                      </span>
                      {product.compareAt ? (
                        <span className="text-sm text-muted-foreground line-through font-sans">
                          {formatINR(product.compareAt)}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-6 space-y-3 border-t border-b border-border/60 py-4 text-xs text-muted-foreground leading-relaxed">
                      <p>
                        Origin Cluster:{" "}
                        <strong className="text-foreground">{product.origin}</strong>
                      </p>
                      <p>
                        Weaving Lineage:{" "}
                        <strong className="text-foreground">{product.weaver}</strong>
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground/90 leading-relaxed">
                        This authentic handloom saree was woven using pure mulberry silk and premium
                        gold zari. Every thread carries the heritage of generations of artisan
                        weavers, certified by the Silk Mark Organisation of India.
                      </p>
                    </div>
                  </div>

                  {/* Add to Bag and Video Buttons */}
                  <div className="mt-6 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={async (e) => {
                        await handleAddToCart(e);
                        setShowQuickView(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-[10px] uppercase tracking-widest text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-soft font-sans font-semibold"
                    >
                      <ShoppingBag className="size-4" strokeWidth={1.5} /> Add to bag
                    </button>

                    {product.instagramLink && (
                      <button
                        type="button"
                        onClick={() => window.open(product.instagramLink!, "_blank")}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-transparent py-3 text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer font-sans font-semibold"
                      >
                        <Play className="size-4 fill-current text-accent" strokeWidth={1.5} /> Watch
                        Loom Story Video
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
