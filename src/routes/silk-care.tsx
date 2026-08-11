import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/silk-care")({
  head: () => ({
    meta: [
      { title: "Silk Care Guide — Sahaana" },
      {
        name: "description",
        content:
          "How to preserve and care for handwoven silk sarees, zari thread and mulberry yarn.",
      },
    ],
  }),
  component: SilkCare,
});

function SilkCare() {
  const tips = [
    {
      title: "Dry Clean Only",
      copy: "Never handwash silk sarees at home. Water can swell silk fibers, causing wrinkles and distorting the gold zari.",
    },
    {
      title: "Muslin Storage",
      copy: "Store your sarees wrapped in natural unbleached muslin cotton cloth. Avoid plastic bags which trap moisture.",
    },
    {
      title: "Low Heat Ironing",
      copy: "Always iron silk sarees on the reverse side using medium-low heat, or use a steamer with a cloth barrier.",
    },
    {
      title: "Regular Refolding",
      copy: "Refold your stored silk sarees every 3 months to prevent crease cracking along structural warp folds.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Care Guide</p>
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-6xl leading-[1.05] text-foreground">
          Preserve your heirloom <em className="text-gold-gradient not-italic">for generations</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Handwoven pure silk is a living fabric. With correct storage and dry cleaning, it
          maintains its gold luster and drape for over a century.
        </p>
      </Reveal>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
        {tips.map((tip, i) => (
          <div key={tip.title} className="bg-card p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent/12 text-xs font-bold text-accent font-sans">
                ✻
              </span>
              <h3 className="mt-6 font-display text-sm sm:text-xl text-foreground">{tip.title}</h3>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground sm:text-sm">
                {tip.copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
