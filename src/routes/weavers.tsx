import { createFileRoute } from "@tanstack/react-router";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import weaverHands from "@/assets/weaver-hands.jpg";

const title = "Our Weavers — The Families Behind Sahaana Silk";
const description =
  "Meet the handloom weaver families of Kanchipuram, Varanasi, Mysore and Bhagalpur who weave every Sahaana saree, paid fairly and named on every label.";

export const Route = createFileRoute("/weavers")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Weavers,
});

const weavers = [
  {
    name: "Murugan & family",
    cluster: "Kanchipuram, Tamil Nadu",
    years: "6 generations",
    copy: "Temple-border Kanchipuram with korvai joins done entirely by hand on a pit loom.",
  },
  {
    name: "Iqbal Ansari",
    cluster: "Varanasi, Uttar Pradesh",
    years: "38 years at the loom",
    copy: "Katan silk brocade, jangla and shikargah patterns drafted from 19th century naqsha cards.",
  },
  {
    name: "Lakshmi Devi",
    cluster: "Mysore, Karnataka",
    years: "Master of soft silk",
    copy: "Featherlight Mysore crepe with rose gold zari, finished at 120 threads per inch.",
  },
  {
    name: "Sunil Kumar",
    cluster: "Bhagalpur, Bihar",
    years: "Tussar specialist",
    copy: "Hand-painted tussar using natural madder, indigo and pomegranate dyes.",
  },
];

function Weavers() {
  return (
    <div className="pb-28 pt-36 sm:pt-44">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">Our weavers</p>
          <h1 className="mt-4 max-w-3xl text-3xl sm:text-6xl leading-[1.05] text-foreground">
            The people whose hands <em className="text-gold-gradient not-italic">made it</em>
          </h1>
        </Reveal>

        <Reveal delay={0.12} className="mt-14 overflow-hidden rounded-3xl shadow-luxe">
          <img
            src={weaverHands}
            alt="Handloom weaver threading gold zari into silk"
            loading="lazy"
            width={1408}
            height={1008}
            className="max-h-[520px] w-full object-cover"
          />
        </Reveal>

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2">
          {weavers.map((weaver) => (
            <div key={weaver.name} className="bg-card p-4 sm:p-10 flex flex-col justify-between">
              <div>
                <p className="eyebrow text-[8px] sm:text-[9px] truncate">{weaver.cluster}</p>
                <h2 className="mt-3 font-display text-lg sm:text-3xl text-foreground truncate">
                  {weaver.name}
                </h2>
                <p className="mt-1 text-[9px] sm:text-xs uppercase tracking-[0.18em] text-accent truncate">
                  {weaver.years}
                </p>
                <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground sm:text-sm">
                  {weaver.copy}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <SectionHeading
            eyebrow="Our promise"
            title="Paid before dispatch, named on the label"
            description="We buy at the loom, in full, before a single saree ships. Every label carries the artisan's name and cluster — the only signature that matters."
          />
        </div>
      </div>
    </div>
  );
}
