import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, Phone, ArrowUp } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";

const columns = [
  {
    title: "Shop",
    items: [
      { label: "Bridal Silk", to: "/collections" },
      { label: "Kanchipuram", to: "/collections" },
      { label: "Banarasi", to: "/collections" },
      { label: "Soft Silk", to: "/collections" },
      { label: "Designer", to: "/collections" },
    ],
  },
  {
    title: "Atelier",
    items: [
      { label: "Our Weavers", to: "/weavers" },
      { label: "Handloom Process", to: "/handloom-process" },
      { label: "Authenticity", to: "/authenticity" },
      { label: "Silk Care", to: "/silk-care" },
      { label: "Journal", to: "/journal" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Shipping", to: "/shipping" },
      { label: "Returns", to: "/returns" },
      { label: "Size Guide", to: "/size-guide" },
      { label: "Track Order", to: "/track-order" },
      { label: "FAQs", to: "/faqs" },
    ],
  },
];

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className="hidden lg:block bg-gradient-maroon text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <img
              src={logo}
              alt="Sahaana Logo"
              className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
              Authentic handloom silk sarees, carried from the weaver's loom directly to your
              wardrobe. No middlemen, no markups — only heritage.
            </p>
            <div className="mt-8 flex gap-3">
              {[Instagram, Facebook, Mail, Phone].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={["Instagram", "Facebook", "Email", "Call"][i]}
                  className="rounded-full border border-primary-foreground/20 p-2.5 transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="size-4" strokeWidth={1.4} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] uppercase tracking-[0.28em] text-accent">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-primary-foreground/15 pt-8 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-6 text-xs text-primary-foreground/55">
            <p>© {new Date().getFullYear()} Sahaana Handloom. Handwoven in India.</p>
            {user && user.email === "ontimittatharun2002@gmail.com" && (
              <Link
                to="/admin"
                className="text-accent hover:underline uppercase tracking-wider font-semibold"
              >
                Admin Portal
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary-foreground/70 transition-colors hover:text-accent"
          >
            Back to top <ArrowUp className="size-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}
