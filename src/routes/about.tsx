import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Compass, Eye, HeartHandshake, BadgeCheck } from "lucide-react";

const title = "About Sahaana — Weaver Direct Silk Since 1994";
const description =
  "Sahaana carries handloom silk sarees from weaver families straight to your wardrobe. Our story, mission, vision and promise of authenticity.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: About,
});

const values = [
  { icon: Compass, title: "Mission", copy: "Make authentic handloom silk accessible without eroding the artisan's margin." },
  { icon: Eye, title: "Vision", copy: "A thousand weaver families earning a living wage from their own looms by 2030." },
  { icon: HeartHandshake, title: "Customer trust", copy: "Traceable looms, honest pricing, and a 7-day no-questions return." },
  { icon: BadgeCheck, title: "Authenticity", copy: "Silk Mark certification and a loom number on every single saree." },
];

function About() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Our story</p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] text-foreground sm:text-6xl">
          Three decades between the loom and{" "}
          <em className="text-gold-gradient not-italic">your wardrobe</em>
        </h1>
      </Reveal>

      <div className="mt-16 grid gap-14 lg:grid-cols-2">
        <Reveal delay={0.08}>
          <p className="text-base leading-relaxed text-muted-foreground">
            Sahaana began in 1994 as a single handloom in a Kanchipuram courtyard. Our founder's
            grandmother wove six sarees a season and sold them through four intermediaries, each
            taking a cut larger than her own.
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            We rebuilt that chain in reverse. Today, 320 weaver families sell through Sahaana with no
            agent in between — they set the loom price, we handle the craft of presenting it.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="rounded-3xl border border-accent/25 bg-card p-6 sm:p-10 shadow-soft">
            <p className="font-display text-2xl leading-relaxed text-foreground">
              “A saree should carry two names — the woman who wears it, and the woman who wove it.”
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Sahaana, founder
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-24 grid gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value) => (
          <div key={value.title} className="bg-card p-6 sm:p-9">
            <span className="inline-flex rounded-full bg-accent/12 p-3 text-accent">
              <value.icon className="size-5" strokeWidth={1.4} />
            </span>
            <h2 className="mt-6 font-display text-xl text-foreground">{value.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
