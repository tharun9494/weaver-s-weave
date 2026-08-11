import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";
import { useCartWishlist } from "@/hooks/use-cart-wishlist";
import { useProducts } from "@/hooks/use-products";
import { formatINR } from "@/data/catalog";

const links = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections" },
  { label: "Our Weavers", to: "/weavers" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, openAuthModal } = useAuth();
  const { cartItems, wishlistItems } = useCartWishlist();
  const { products, loading: productsLoading } = useProducts();

  const totalCartQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Filter products based on search query
  const searchResults = searchQuery.trim()
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.weave.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.weaver.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.origin.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-panel py-3" : "border-b border-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="group flex items-center">
            <img
              src={logo}
              alt="Sri Varee Pattu"
              className="h-10 sm:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="relative text-[13px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {user && user.email === "ontimittatharun2002@gmail.com" && (
              <li>
                <Link
                  to="/admin"
                  className="relative text-[13px] uppercase tracking-[0.16em] text-accent font-semibold hover:text-foreground transition-colors"
                  activeProps={{ className: "text-accent border-b border-accent pb-1" }}
                >
                  Admin Portal
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setShowSearch(true)}
              className="hidden sm:inline-flex rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
            >
              <Search className="size-[18px]" strokeWidth={1.4} />
            </button>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative hidden sm:inline-flex rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Heart className="size-[18px]" strokeWidth={1.4} />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              aria-label="Cart"
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ShoppingBag className="size-[18px]" strokeWidth={1.4} />
              {totalCartQty > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                  {totalCartQty}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                to="/profile"
                aria-label="Account"
                className="hidden sm:inline-flex rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <User className="size-[18px]" strokeWidth={1.4} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                aria-label="Sign In"
                className="hidden sm:inline-flex rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
              >
                <User className="size-[18px]" strokeWidth={1.4} />
              </button>
            )}

            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="rounded-full p-2 text-foreground lg:hidden"
            >
              {open ? (
                <X className="size-5" strokeWidth={1.4} />
              ) : (
                <Menu className="size-5" strokeWidth={1.4} />
              )}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open ? (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel overflow-hidden px-6 pb-6 lg:hidden"
            >
              {links.map((link) => (
                <li key={link.to} className="border-b border-border/60 last:border-0">
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-sm uppercase tracking-[0.18em] text-muted-foreground"
                    activeProps={{ className: "text-foreground" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {user && user.email === "ontimittatharun2002@gmail.com" && (
                <li className="border-b border-border/60">
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="block py-4 text-sm uppercase tracking-[0.18em] text-accent font-semibold"
                    activeProps={{ className: "text-accent" }}
                  >
                    Admin Portal
                  </Link>
                </li>
              )}

              {/* Mobile-only menu items for search, wishlist, account */}
              <li className="border-b border-border/60 sm:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setShowSearch(true);
                  }}
                  className="flex w-full items-center gap-3 py-4 text-sm uppercase tracking-[0.18em] text-muted-foreground text-left cursor-pointer"
                >
                  <Search className="size-[18px]" strokeWidth={1.4} /> Search
                </button>
              </li>
              <li className="border-b border-border/60 sm:hidden">
                <Link
                  to="/wishlist"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-between py-4 text-sm uppercase tracking-[0.18em] text-muted-foreground text-left"
                >
                  <span className="flex items-center gap-3">
                    <Heart className="size-[18px]" strokeWidth={1.4} /> Wishlist
                  </span>
                  {wishlistItems.length > 0 && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-[9px] font-bold text-accent-foreground">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              </li>
              <li className="sm:hidden">
                {user ? (
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-3 py-4 text-sm uppercase tracking-[0.18em] text-muted-foreground text-left"
                  >
                    <User className="size-[18px]" strokeWidth={1.4} /> Account / Dashboard
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openAuthModal();
                    }}
                    className="flex w-full items-center gap-3 py-4 text-sm uppercase tracking-[0.18em] text-muted-foreground text-left cursor-pointer"
                  >
                    <User className="size-[18px]" strokeWidth={1.4} /> Account / Sign In
                  </button>
                )}
              </li>
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </header>

      {/* LUXURY SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {showSearch && (
          <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-lg">
            {/* Header section of search */}
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
              <span className="font-display text-2xl text-foreground">Artisan Search</span>
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="rounded-full border border-border p-2.5 text-foreground hover:bg-secondary"
                aria-label="Close search"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Input field */}
            <div className="mx-auto w-full max-w-3xl px-5 pt-10">
              <div className="relative border-b-2 border-accent/40 pb-3 focus-within:border-accent">
                <Search className="absolute left-0 top-1 size-6 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search by weave, weaver, color, occasion..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent pl-9 pr-4 text-xl font-light text-foreground placeholder-muted-foreground focus:outline-none sm:text-3xl"
                />
              </div>

              {/* Loader */}
              {productsLoading && (
                <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> Querying loom registries...
                </div>
              )}

              {/* Search Results */}
              <div className="mt-10 max-h-[60vh] overflow-y-auto no-scrollbar pb-10">
                {searchResults.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to="/collections"
                        onClick={() => {
                          setShowSearch(false);
                          setSearchQuery("");
                        }}
                        className="flex gap-4 rounded-2xl border border-border/80 bg-card p-4 transition-all hover:border-accent shadow-soft"
                      >
                        <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="size-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">
                            {product.weave}
                          </span>
                          <h4 className="font-display text-lg text-foreground mt-0.5">
                            {product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">{product.weaver}</p>
                          <p className="text-xs text-foreground font-semibold mt-1">
                            {formatINR(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.trim() ? (
                  <p className="text-center text-sm text-muted-foreground">
                    No sarees matching "{searchQuery}" found in our archive.
                  </p>
                ) : (
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground block">
                      Suggested Searches
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {["Kanchipuram", "Banarasi", "Soft Silk", "Bridal", "Wedding", "Iqbal"].map(
                        (tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSearchQuery(tag)}
                            className="rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-foreground"
                          >
                            {tag}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
