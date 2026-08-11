import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/authenticity")({
  head: () => ({
    meta: [
      { title: "Pure Silk Authenticity Guarantee — Sahaana" },
      {
        name: "description",
        content:
          "Understanding Silk Mark, pure gold zari certification and weaver-direct traceability.",
      },
    ],
  }),
  component: Authenticity,
});

function Authenticity() {
  const points = [
    {
      title: "Silk Mark Certified",
      copy: "Every saree comes with an official, tamper-proof Silk Mark hologram label from the Silk Mark Organisation of India.",
    },
    {
      title: "Pure Zari Standard",
      copy: "We use only genuine silver thread coated with 24k pure gold for zari work, never cheap copper or metallic substitutes.",
    },
    {
      title: "Traceable Loom Numbers",
      copy: "Each saree has a loom ID marked on its inner fold. You can cross-reference this to trace the family who wove it.",
    },
    {
      title: "Flame-Test Verified",
      copy: "Natural mulberry silk burns with a smell of hair and leaves crushable ash. We welcome testing on any fiber sample.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Our Guarantee</p>
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-6xl leading-[1.05] text-foreground">
          Pure materials, zero <em className="text-gold-gradient not-italic">compromise</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          In an industry filled with synthetic mixes and imitation zari, Sahaana remains committed
          to 100% verified purity standards.
        </p>
      </Reveal>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
        {points.map((pt, i) => (
          <div key={pt.title} className="bg-card p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent/12 text-xs font-bold text-accent font-sans">
                ✓
              </span>
              <h3 className="mt-6 font-display text-sm sm:text-xl text-foreground">{pt.title}</h3>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground sm:text-sm">
                {pt.copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
