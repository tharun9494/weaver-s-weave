import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import logo from "@/assets/logo.png";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "glass-panel py-3" : "border-b border-transparent py-5"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center">
          <img
            src={logo}
            alt="Sahaana"
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
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Search"
            className="hidden sm:inline-flex rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Search className="size-[18px]" strokeWidth={1.4} />
          </button>

          <button
            type="button"
            aria-label="Wishlist"
            className="hidden sm:inline-flex rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Heart className="size-[18px]" strokeWidth={1.4} />
          </button>

          <button
            type="button"
            aria-label="Cart"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.4} />
          </button>

          <button
            type="button"
            aria-label="Account"
            className="hidden sm:inline-flex rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <User className="size-[18px]" strokeWidth={1.4} />
          </button>

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

            {/* Mobile-only menu items for search, wishlist, account */}
            <li className="border-b border-border/60 sm:hidden">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 py-4 text-sm uppercase tracking-[0.18em] text-muted-foreground text-left"
              >
                <Search className="size-[18px]" strokeWidth={1.4} /> Search
              </button>
            </li>
            <li className="border-b border-border/60 sm:hidden">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 py-4 text-sm uppercase tracking-[0.18em] text-muted-foreground text-left"
              >
                <Heart className="size-[18px]" strokeWidth={1.4} /> Wishlist
              </button>
            </li>
            <li className="sm:hidden">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 py-4 text-sm uppercase tracking-[0.18em] text-muted-foreground text-left"
              >
                <User className="size-[18px]" strokeWidth={1.4} /> Account / Login
              </button>
            </li>
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
