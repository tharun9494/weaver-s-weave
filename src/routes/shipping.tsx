import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Delivery Policy — Sahaana" },
      {
        name: "description",
        content:
          "Understanding our direct-from-loom shipping times, tracking and courier partners.",
      },
    ],
  }),
  component: Shipping,
});

function Shipping() {
  const policies = [
    {
      title: "48-Hour Dispatch",
      copy: "All ready sarees are dispatched within 48 hours directly from the weaver's loom center.",
    },
    {
      title: "Free Domestic Shipping",
      copy: "We provide fully insured shipping free of cost across all states in India.",
    },
    {
      title: "Global Air Delivery",
      copy: "We ship internationally to the US, Europe, and Asia via express DHL/FedEx within 5-9 working days.",
    },
    {
      title: "Real-time Tracking",
      copy: "Once shipped, you will receive an SMS and email notification with an active tracking link.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Support</p>
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-6xl leading-[1.05] text-foreground">
          Delivery directly <em className="text-gold-gradient not-italic">from the loom</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Safe, insured, and tracked shipping directly from artisan clusters to your doorstep.
        </p>
      </Reveal>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
        {policies.map((pol, i) => (
          <div key={pol.title} className="bg-card p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent/12 text-xs font-bold text-accent font-sans">
                ✈
              </span>
              <h3 className="mt-6 font-display text-sm sm:text-xl text-foreground">{pol.title}</h3>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground sm:text-sm">
                {pol.copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
