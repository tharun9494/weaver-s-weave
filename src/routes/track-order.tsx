import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Reveal } from "@/components/site/Reveal";
import { Search, Loader2, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Saree Order — Sahaana" },
      {
        name: "description",
        content: "View the live status of your handloom dispatch directly from weavers' looms.",
      },
    ],
  }),
  component: TrackOrder,
});

interface TrackedOrder {
  id: string;
  email: string;
  name: string;
  status: "Pending" | "Weaving" | "Shipped" | "Delivered";
  city: string;
  items: Array<{ name: string }>;
  createdAt?: string;
}

function TrackOrder() {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !orderId) {
      toast.error("Please enter your email or Order ID.");
      return;
    }

    setLoading(true);
    setOrder(null);
    try {
      const ordersCol = collection(db, "orders");
      let q;

      if (orderId) {
        // Query by Order ID (or doc ID)
        q = query(ordersCol, where("__name__", "==", orderId.trim()));
      } else {
        // Query by Email
        q = query(ordersCol, where("email", "==", email.trim().toLowerCase()));
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.error("No active order found with those details.");
      } else {
        const doc = snapshot.docs[0];
        if (doc) {
          setOrder({ id: doc.id, ...doc.data() } as TrackedOrder);
          toast.success("Order retrieved successfully.");
        } else {
          toast.error("No active order found with those details.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not trace order. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status?: string) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Weaving":
        return 2;
      case "Shipped":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep(order?.status);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Direct Dispatch Trace</p>
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-6xl leading-[1.05] text-foreground">
          Track your handwoven <em className="text-gold-gradient not-italic">loomwork</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Input your email address or Order ID to retrieve live weaving updates, dispatch status and
          tracking details.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal delay={0.08}>
          <form
            onSubmit={handleTrack}
            className="rounded-3xl border border-border bg-card p-6 sm:p-9 shadow-soft"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="trackEmail"
                  className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Email Address
                </label>
                <input
                  id="trackEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="mt-3 block w-full rounded-full border border-border bg-transparent px-6 py-4 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="relative flex items-center justify-center">
                <span className="absolute bg-card px-4 text-xs uppercase tracking-widest text-muted-foreground">
                  Or
                </span>
                <div className="w-full border-t border-border/80" />
              </div>

              <div>
                <label
                  htmlFor="trackOrderId"
                  className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Order ID
                </label>
                <input
                  id="trackOrderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter order reference code"
                  className="mt-3 block w-full rounded-full border border-border bg-transparent px-6 py-4 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-soft disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Search className="size-4" /> Trace Order
                  </>
                )}
              </button>
            </div>
          </form>
        </Reveal>

        <Reveal delay={0.16}>
          {order ? (
            <div className="rounded-3xl border border-accent/25 bg-card p-6 sm:p-9 shadow-soft flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <h3 className="mt-1 font-display text-xl text-foreground">
                      Destined for {order.city}
                    </h3>
                  </div>
                  <span className="rounded-full bg-accent/12 px-4 py-1.5 text-[10px] uppercase tracking-wider text-accent font-sans font-bold">
                    {order.status}
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Sarees in production
                  </p>
                  <ul className="mt-3 space-y-2">
                    {order.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm font-medium text-foreground flex items-center gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-accent" /> {item.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timeline */}
                <div className="mt-10">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Loom & dispatch progress
                  </p>
                  <div className="mt-6 flex justify-between items-center relative">
                    {/* Progress Bar Line */}
                    <div className="absolute left-0 right-0 top-5 h-0.5 bg-border -z-10" />
                    <div
                      className="absolute left-0 top-5 h-0.5 bg-accent -z-10 transition-all duration-700"
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />

                    {[
                      { step: 1, label: "Placed", icon: Clock },
                      { step: 2, label: "Weaving", icon: Package },
                      { step: 3, label: "Shipped", icon: Truck },
                      { step: 4, label: "Delivered", icon: CheckCircle },
                    ].map((stepObj) => {
                      const StepIcon = stepObj.icon;
                      const isActive = stepObj.step <= currentStep;
                      return (
                        <div key={stepObj.step} className="flex flex-col items-center">
                          <span
                            className={`flex size-10 items-center justify-center rounded-full border-2 transition-all duration-500 bg-card ${
                              isActive
                                ? "border-accent text-accent shadow-soft"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            <StepIcon className="size-4" strokeWidth={1.5} />
                          </span>
                          <span
                            className={`mt-2 text-[9px] uppercase tracking-wider font-semibold ${
                              isActive ? "text-accent" : "text-muted-foreground"
                            }`}
                          >
                            {stepObj.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/80 p-12 text-center flex flex-col items-center justify-center h-full">
              <Package className="size-10 text-muted-foreground/60" strokeWidth={1.2} />
              <h3 className="mt-4 font-display text-xl text-foreground">Waiting for query</h3>
              <p className="mt-2 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Enter your details to fetch loom production and air shipment tracking records.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
