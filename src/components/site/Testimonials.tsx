import { Quote } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeading } from "./Reveal";

const testimonials = [
  {
    quote:
      "My wedding Kanchipuram arrived with the weaver's name stitched into the fall. It felt like receiving an heirloom, not a parcel.",
    name: "Ananya Raghavan",
    city: "Chennai",
  },
  {
    quote:
      "I have bought silk for thirty years. This is the first time I paid the loom price and could still trace the artisan.",
    name: "Meera Krishnan",
    city: "Bengaluru",
  },
  {
    quote:
      "The Banarasi brocade is impossibly light. Three compliments before I reached the mandap.",
    name: "Ishita Verma",
    city: "Delhi",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading eyebrow="Testimonials" title="Worn, loved, passed down" />
      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-border bg-card p-9 shadow-soft transition-transform duration-500 hover:-translate-y-1.5"
          >
            <Quote className="size-6 text-accent" strokeWidth={1.3} />
            <blockquote className="mt-6 font-display text-xl leading-relaxed text-foreground">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-7">
              <p className="text-sm text-foreground">{t.name}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {t.city}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="bg-gradient-ivory">
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow="The Sahaana journal"
          title="Loom notes, once a month"
          description="New arrivals, silk care rituals and stories from the weaving clusters. No noise."
        />
        <form
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 rounded-full border border-input bg-card px-6 py-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
