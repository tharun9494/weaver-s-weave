import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/size-guide")({
  head: () => ({
    meta: [
      { title: "Saree Size Guide & Drape Specifications — Sahaana" },
      {
        name: "description",
        content: "Detailed specifications on saree length, width, pallu and blouse fabric.",
      },
    ],
  }),
  component: SizeGuide,
});

function SizeGuide() {
  const specs = [
    {
      title: "Saree Length",
      copy: "Standard length of 5.5 meters (6 yards), providing optimal pleats and drape for all heights.",
    },
    {
      title: "Saree Width",
      copy: "Standard height/width of 45-48 inches (approx. 1.2 meters) to accommodate standard draping waistlines.",
    },
    {
      title: "Blouse Piece Fabric",
      copy: "Includes an additional 0.8 meter matching unstitched blouse fabric attached at the inner end.",
    },
    {
      title: "Pallu Dimension",
      copy: "The decorative pallu spans between 0.6 to 1 meter depending on the design's weave intricacy.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Support</p>
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-6xl leading-[1.05] text-foreground">
          Saree dimensions <em className="text-gold-gradient not-italic">and specifications</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Every Sahaana saree is woven in standard dimensions to match traditional Indian draping
          requirements.
        </p>
      </Reveal>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
        {specs.map((spec, i) => (
          <div key={spec.title} className="bg-card p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent/12 text-xs font-bold text-accent font-sans">
                ⤾
              </span>
              <h3 className="mt-6 font-display text-sm sm:text-xl text-foreground">{spec.title}</h3>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground sm:text-sm">
                {spec.copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
