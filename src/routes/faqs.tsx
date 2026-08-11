import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — Sahaana" },
      {
        name: "description",
        content:
          "Answers to questions on authenticity, silk mark certification, pricing, orders and shipping.",
      },
    ],
  }),
  component: FAQs,
});

function FAQs() {
  const faqs = [
    {
      q: "Are the sarees certified pure silk?",
      a: "Yes, every saree comes with an individual Silk Mark certificate tag containing a trace hologram. This guarantees 100% pure natural mulberry silk.",
    },
    {
      q: "What metal is used for the zari work?",
      a: "Our master weavers use pure silver wire plated with 24k gold for all pure zari sarees. We never use polyester or copper-imitation zari.",
    },
    {
      q: "How are you able to offer these prices?",
      a: "We operate a direct-from-loom model. By removing distributors, wholesalers, and retail agents, we pay weavers a higher wage while passing the savings directly to you.",
    },
    {
      q: "How long does dispatch and shipping take?",
      a: "Sarees are dispatched from active loom centers within 48 hours. Domestic delivery takes 2-4 working days, and global delivery takes 5-9 days via DHL Express.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Support</p>
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-6xl leading-[1.05] text-foreground">
          Frequently asked <em className="text-gold-gradient not-italic">questions</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Everything you need to know about material purity, loom dispatches, and returns.
        </p>
      </Reveal>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
        {faqs.map((faq, i) => (
          <div key={faq.q} className="bg-card p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">
                Question {i + 1}
              </span>
              <h3 className="mt-6 font-display text-sm sm:text-xl text-foreground">{faq.q}</h3>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground sm:text-sm">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
