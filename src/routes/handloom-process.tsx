import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/handloom-process")({
  head: () => ({
    meta: [
      { title: "The Handloom Weaving Process — Sahaana" },
      {
        name: "description",
        content: "Understanding the artistry of Indian pit looms, jacquards and korvai borders.",
      },
    ],
  }),
  component: HandloomProcess,
});

function HandloomProcess() {
  const steps = [
    {
      title: "Yarn Preparation & Dyeing",
      copy: "Pure Mulberry silk is washed and dyed by hand in copper vats using organic plant madder and safe minerals.",
    },
    {
      title: "Naqsha Card Drafting",
      copy: "Intricate floral and temple motifs are hand-punched onto naqsha grids, the code that guides the weaver's thread.",
    },
    {
      title: "Pit Loom Weaving",
      copy: "The weaver sits in a pit beneath the loom, operating foot pedals and hand shuttles in perfect rhythmic synchronization.",
    },
    {
      title: "Korvai Border Joining",
      copy: "A complex technique where two weavers join the body warp and border warp thread-by-thread, producing structural density.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">The Atelier Craft</p>
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-6xl leading-[1.05] text-foreground">
          How a handloom saree is <em className="text-gold-gradient not-italic">brought to life</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          A single saree requires between 80 to 200 hours of continuous human labor. There are no
          motors, no gearboxes—only direct handcraft.
        </p>
      </Reveal>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="bg-card p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent/12 text-xs font-bold text-accent font-sans">
                0{i + 1}
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
