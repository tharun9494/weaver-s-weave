import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Atelier Journal & Weaver Diaries — Sahaana" },
      {
        name: "description",
        content:
          "Read stories directly from handloom loom sheds, weaver lineages and design histories.",
      },
    ],
  }),
  component: Journal,
});

function Journal() {
  const articles = [
    {
      title: "The Korvai Borders of Kanchipuram",
      author: "Murugan M.",
      copy: "Exploring why the interlocking korvai joint is the hardest handloom technique to master.",
    },
    {
      title: "Rediscoving 19th Century Naqsha Patterns",
      author: "Iqbal Ansari",
      copy: "How we mapped historic motifs from dusty drawing books to active Varanasi jacquards.",
    },
    {
      title: "Natural Dyeing with Madder & Pomegranate",
      author: "Sunil Kumar",
      copy: "A weaver's guide to sustainable pigments harvested from local vegetation.",
    },
    {
      title: "The Rhythm of the Loom Shed",
      author: "Lakshmi Devi",
      copy: "A morning inside the Mysore silk cluster: count, speed, and standard of craft.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">The Journal</p>
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-6xl leading-[1.05] text-foreground">
          Stories behind the <em className="text-gold-gradient not-italic">weaves</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Historical analyses, dye guides, and daily reports from active looms across India.
        </p>
      </Reveal>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((art, i) => (
          <div key={art.title} className="bg-card p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                By {art.author}
              </p>
              <h3 className="mt-6 font-display text-sm sm:text-xl text-foreground">{art.title}</h3>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground sm:text-sm">
                {art.copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
