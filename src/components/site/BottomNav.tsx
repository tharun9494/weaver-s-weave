import { Link } from "@tanstack/react-router";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCartWishlist } from "@/hooks/use-cart-wishlist";

export function BottomNav() {
  const { user, openAuthModal } = useAuth();
  const { cartItems, wishlistItems } = useCartWishlist();

  const totalCartQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  interface TabItem {
    label: string;
    to: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    badge?: number;
  }

  const tabs: TabItem[] = [
    { label: "Home", to: "/", icon: Home },
    { label: "Shop", to: "/collections", icon: Search },
    { label: "Wishlist", to: "/wishlist", icon: Heart, badge: wishlistItems.length },
    { label: "Bag", to: "/cart", icon: ShoppingBag, badge: totalCartQty },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-border/80 bg-background/95 pb-safe backdrop-blur-md shadow-soft lg:hidden">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className="relative flex flex-col items-center justify-center w-14 h-full text-muted-foreground transition-all duration-300 hover:text-foreground"
          activeProps={{ className: "text-accent" }}
        >
          <tab.icon className="size-[20px]" strokeWidth={1.5} />
          <span className="mt-1 text-[9px] uppercase tracking-wider font-medium font-sans">
            {tab.label}
          </span>
          {tab.badge && tab.badge > 0 ? (
            <span className="absolute right-1 top-2.5 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground font-sans">
              {tab.badge}
            </span>
          ) : null}
        </Link>
      ))}

      {/* Account Profile Tab */}
      {user ? (
        <Link
          to="/profile"
          className="flex flex-col items-center justify-center w-14 h-full text-muted-foreground transition-all duration-300 hover:text-foreground"
          activeProps={{ className: "text-accent" }}
        >
          <User className="size-[20px]" strokeWidth={1.5} />
          <span className="mt-1 text-[9px] uppercase tracking-wider font-medium font-sans">
            Profile
          </span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={openAuthModal}
          className="flex flex-col items-center justify-center w-14 h-full text-muted-foreground transition-all duration-300 hover:text-foreground cursor-pointer"
        >
          <User className="size-[20px]" strokeWidth={1.5} />
          <span className="mt-1 text-[9px] uppercase tracking-wider font-medium font-sans">
            Sign In
          </span>
        </button>
      )}
    </nav>
  );
}
