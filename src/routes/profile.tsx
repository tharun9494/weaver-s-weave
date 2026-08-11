import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Reveal } from "@/components/site/Reveal";
import {
  User,
  Phone,
  MapPin,
  LogOut,
  ClipboardList,
  ShieldAlert,
  Sparkles,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Artisan Lounge Account Dashboard — Sahaana" },
      {
        name: "description",
        content:
          "Manage your delivery addresses, contact details, and view your loom-registered purchase history.",
      },
    ],
  }),
  component: ProfilePage,
});

// Mock purchase history representing direct-weaver orders
const mockOrders = [
  {
    orderId: "SH-9082",
    date: "July 24, 2026",
    sareeName: "Rani Kanchipuram",
    weave: "Pure Kanchipuram Silk",
    loomNumber: "LOM-4402",
    weaver: "Murugan & family",
    status: "Delivered",
    price: "₹42,800",
    image: "/src/assets/product-bridal.jpg",
  },
  {
    orderId: "SH-8201",
    date: "May 12, 2026",
    sareeName: "Champagne Banarasi",
    weave: "Katan Silk Brocade",
    loomNumber: "LOM-1109",
    weaver: "Iqbal Ansari",
    status: "Delivered",
    price: "₹36,400",
    image: "/src/assets/product-banarasi.jpg",
  },
];

function ProfilePage() {
  const { user, profile, loading, signOut, updateProfile, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [activeSubTab, setActiveSubTab] = useState<"details" | "orders">("details");

  // Profile edit fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync state with Firestore profile
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name,
        phone,
        address,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(
        "Failed to update profile: " + (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate({ to: "/" });
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="mx-auto max-w-xl px-5 pb-28 pt-36 text-center sm:pt-44">
        <Reveal>
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <User className="size-6" strokeWidth={1.2} />
          </div>
          <h1 className="mt-8 font-display text-4xl text-foreground sm:text-5xl">
            Namaste, Saree Patron
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Please sign in to access your direct-weaver tracking coordinates, orders archive, and
            authenticity certificates.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={openAuthModal}
              className="rounded-full bg-primary px-10 py-4 text-[11px] uppercase tracking-widest text-primary-foreground shadow-soft transition-all duration-300 hover:bg-primary/95 cursor-pointer font-sans"
            >
              Sign In / Register
            </button>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Direct Loom Lounge</p>
        <h1 className="mt-4 text-4xl leading-[1.05] text-gold-gradient sm:text-6xl">
          Namaste, <em className="not-italic text-foreground">{profile.name || "Patron"}</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Track loom dispatches, view certificates of authenticity, and update your shipping
          coordinates.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        {/* SIDE BAR / ACCOUNT OVERVIEW */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-accent/20 bg-card p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/12 text-accent">
                <User className="size-6" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-2xl text-foreground">
                  {profile.name || "Patron"}
                </h3>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => setActiveSubTab("details")}
                className={`flex w-full items-center gap-3 rounded-full px-5 py-3 text-left text-xs uppercase tracking-wider transition-colors duration-300 ${
                  activeSubTab === "details"
                    ? "bg-accent/12 font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <User className="size-4" strokeWidth={1.5} /> Profile Details
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab("orders")}
                className={`flex w-full items-center gap-3 rounded-full px-5 py-3 text-left text-xs uppercase tracking-wider transition-colors duration-300 ${
                  activeSubTab === "orders"
                    ? "bg-accent/12 font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <ClipboardList className="size-4" strokeWidth={1.5} /> Order Archive
              </button>
            </div>

            <hr className="my-6 border-border/60" />

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-full px-5 py-3 text-left text-xs uppercase tracking-wider text-destructive transition-colors duration-300 hover:bg-destructive/10"
            >
              <LogOut className="size-4" strokeWidth={1.5} /> Sign Out
            </button>
          </div>

          <div className="mt-6 rounded-3xl border border-gold/15 bg-gradient-maroon p-6 text-primary-foreground shadow-soft">
            <div className="flex items-start gap-4">
              <Sparkles className="mt-1 size-5 shrink-0 text-accent" />
              <div>
                <h4 className="font-display text-lg text-accent-foreground">
                  Artisan Patron Level
                </h4>
                <p className="mt-2 text-xs leading-relaxed opacity-75">
                  Your purchases directly fund handloom families. You currently support 2 master
                  weaving homes. Thank you for preserving the heritage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="lg:col-span-8">
          {activeSubTab === "details" ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-accent/20 bg-card p-6 shadow-soft sm:p-10"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl text-foreground">Artisan Coordinates</h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full border border-accent/60 px-5 py-2 text-[10px] uppercase tracking-widest text-foreground transition-colors hover:bg-accent/12"
                  >
                    Edit Details
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="mt-8 space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                    Patron Name
                  </label>
                  {isEditing ? (
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-4 flex items-center text-muted-foreground/60">
                        <User className="size-4" strokeWidth={1.5} />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-full border border-border bg-transparent py-3.5 pl-11 pr-5 text-sm transition-all focus:border-accent focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p className="mt-2 font-display text-xl text-foreground">
                      {profile.name || "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                    Contact Phone
                  </label>
                  {isEditing ? (
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-4 flex items-center text-muted-foreground/60">
                        <Phone className="size-4" strokeWidth={1.5} />
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-full border border-border bg-transparent py-3.5 pl-11 pr-5 text-sm transition-all focus:border-accent focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p className="mt-2 font-display text-xl text-foreground">
                      {profile.phone || "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                    Shipping Address
                  </label>
                  {isEditing ? (
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-3.5 flex items-center text-muted-foreground/60">
                        <MapPin className="size-4" strokeWidth={1.5} />
                      </span>
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-transparent py-3.5 pl-11 pr-5 text-sm transition-all focus:border-accent focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p className="mt-2 text-sm leading-relaxed text-foreground whitespace-pre-line">
                      {profile.address || "Not set"}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-8 flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-[11px] uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/95 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="size-4 animate-spin" /> : "Save Settings"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(profile.name || "");
                        setPhone(profile.phone || "");
                        setAddress(profile.address || "");
                      }}
                      className="rounded-full border border-border px-8 py-3 text-[11px] uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="rounded-3xl border border-accent/20 bg-card p-6 shadow-soft sm:p-10">
                <h2 className="font-display text-3xl text-foreground">Order & Loom Archive</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  History of direct handloom purchases with their unique tracking codes.
                </p>

                <div className="mt-8 space-y-6">
                  {mockOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="flex flex-col gap-6 rounded-2xl border border-border/80 p-5 sm:flex-row sm:items-center"
                    >
                      {/* Placeholder Order Saree Image */}
                      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                        <img
                          src={order.image}
                          alt={order.sareeName}
                          className="size-full object-cover"
                          onError={(e) => {
                            // Fallback if image doesn't resolve
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="flex size-full items-center justify-center bg-accent/10 font-display text-gold">
                          Silk
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            Order {order.orderId} • {order.date}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <Check className="size-2.5" /> {order.status}
                          </span>
                        </div>
                        <h4 className="mt-2 font-display text-xl text-foreground">
                          {order.sareeName} —{" "}
                          <span className="text-sm text-muted-foreground">{order.weave}</span>
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                          <p>
                            Weaver: <strong className="text-foreground">{order.weaver}</strong>
                          </p>
                          <p>
                            Loom Number: <strong className="text-accent">{order.loomNumber}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between sm:flex-col sm:items-end">
                        <span className="font-semibold text-foreground sm:text-lg">
                          {order.price}
                        </span>
                        <button
                          type="button"
                          className="text-[10px] uppercase tracking-widest text-accent hover:underline sm:mt-2"
                          onClick={() =>
                            toast.success(`Loom certificate downloaded for ${order.loomNumber}`)
                          }
                        >
                          Certificate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
