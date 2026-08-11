import { createFileRoute, Link } from "@tanstack/react-router";
import { useCartWishlist } from "@/hooks/use-cart-wishlist";
import { useProducts } from "@/hooks/use-products";
import { formatINR } from "@/data/catalog";
import { Reveal } from "@/components/site/Reveal";
import { Trash2, ShoppingBag, Heart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Handloom Wishlist — Sahaana" },
      {
        name: "description",
        content:
          "Your curated selection of handwoven silk sarees. Save designs direct from weavers' looms.",
      },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart } = useCartWishlist();
  const { products, loading } = useProducts();

  // Find products that are in the wishlist
  const wishlistedProducts = products.filter((p) => wishlistItems.includes(p.id));

  const handleAddToBag = (productId: string) => {
    addToCart(productId, 1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">My Selection</p>
        <h1 className="mt-4 text-4xl leading-[1.05] text-foreground sm:text-6xl">
          Curated <em className="text-gold-gradient not-italic">loomworks</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Sarees you've saved to your wishlist. Add them to your shopping bag or trace their weaves.
        </p>
      </Reveal>

      {wishlistedProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-12 text-center"
        >
          <div className="flex size-16 items-center justify-center rounded-full bg-accent/8 text-accent">
            <Heart className="size-6" strokeWidth={1.2} />
          </div>
          <h3 className="mt-6 font-display text-2xl text-foreground">Your wishlist is empty</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Explore our direct-from-weaver collections and save your favorite handwoven designs.
          </p>
          <div className="mt-8">
            <Link
              to="/collections"
              className="rounded-full bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/95"
            >
              Explore Collections
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="mt-16">
          <motion.div
            layout
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-6 sm:gap-y-12"
          >
            <AnimatePresence>
              {wishlistedProducts.map((product, i) => (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="group relative flex flex-col justify-between"
                >
                  <div>
                    <div className="relative overflow-hidden rounded-2xl bg-secondary">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-[1000ms] group-hover:scale-105"
                        onError={(e) => {
                          // Hide broken local image refs in testing
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute right-4 top-4">
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(product.id)}
                          aria-label="Remove from wishlist"
                          className="rounded-full bg-card/90 p-2.5 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground shadow-soft"
                        >
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="eyebrow text-[9px]">{product.weave}</p>
                      <h3 className="mt-2 font-display text-xl text-foreground">{product.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{product.weaver}</p>
                      <p className="mt-2 text-sm text-foreground">{formatINR(product.price)}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => handleAddToBag(product.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-5 py-3 text-[10px] uppercase tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                    >
                      <ShoppingBag className="size-3.5" strokeWidth={1.5} /> Add to Bag
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
}
