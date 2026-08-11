import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Exchanges Policy — Sahaana" },
      {
        name: "description",
        content: "Understanding our 7-day hassle-free return and exchange policy.",
      },
    ],
  }),
  component: Returns,
});

function Returns() {
  const steps = [
    {
      title: "7-Day Return Window",
      copy: "If you are not satisfied with your weave, initiate a return request within 7 days of delivery.",
    },
    {
      title: "Hassle-Free Pickups",
      copy: "We arrange free reverse pickup from your home address at your convenience.",
    },
    {
      title: "Full Refund Credit",
      copy: "Upon receiving the saree in its original fold and tags, we refund 100% of the value to your source bank.",
    },
    {
      title: "Exchange Options",
      copy: "Swap your saree for any other loom-numbered design in our collection instantly.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Support</p>
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-6xl leading-[1.05] text-foreground">
          Our 7-day promise of{" "}
          <em className="text-gold-gradient not-italic">complete satisfaction</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          We want you to love your handloom investment. No questions asked returns.
        </p>
      </Reveal>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="bg-card p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent/12 text-xs font-bold text-accent font-sans">
                ↺
              </span>
              <h3 className="mt-6 font-display text-sm sm:text-xl text-foreground">{step.title}</h3>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground sm:text-sm">
                {step.copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
