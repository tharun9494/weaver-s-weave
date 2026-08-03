import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import weaverHands from "@/assets/weaver-hands.jpg";
import { Reveal } from "./Reveal";

const steps = [
  { n: "01", title: "Silk yarn", copy: "Mulberry yarn reeled in Ramanagara, degummed and graded by hand." },
  { n: "02", title: "Handloom preparation", copy: "Warping and street-sizing — four days before a single pick." },
  { n: "03", title: "Weaving", copy: "Pit-loom weaving at 6cm a day, with pure gold-dipped zari." },
  { n: "04", title: "Design", copy: "Temple borders and butta motifs drafted from family archives." },
  { n: "05", title: "Quality inspection", copy: "Eleven checks: zari purity, weft density, fall and finish." },
  { n: "06", title: "Packing", copy: "Muslin wrapped, cedar boxed, Silk Mark sealed." },
  { n: "07", title: "Delivery", copy: "Dispatched straight from the weaving cluster to your door." },
];

export function WeaverJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 60%"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="bg-gradient-maroon text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="eyebrow">The weaver's story</p>
              <h2 className="mt-4 text-4xl leading-[1.08] sm:text-5xl">
                Seven hands touch your saree.
                <br />
                <em className="text-gold-gradient not-italic">None of them a middleman.</em>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-primary-foreground/70">
                Follow the lifecycle of a Sahaana saree, from reeled mulberry yarn to the muslin
                wrap that arrives at your door.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 overflow-hidden rounded-3xl shadow-luxe">
                <img
                  src={weaverHands}
                  alt="Weaver's hands threading gold zari into burgundy silk on a wooden handloom"
                  loading="lazy"
                  width={1408}
                  height={1008}
                  className="w-full object-cover"
                />
              </div>
            </Reveal>
          </div>

          <div ref={ref} className="relative pl-12">
            <div className="absolute left-[13px] top-2 h-full w-px bg-primary-foreground/15" />
            <motion.div
              style={{ height: lineHeight }}
              className="bg-gradient-gold absolute left-[13px] top-2 w-px"
            />
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: 26 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="relative pb-14 last:pb-0"
              >
                <span className="bg-gradient-gold absolute -left-12 top-1.5 grid size-7 place-items-center rounded-full text-[10px] tracking-widest text-accent-foreground">
                  {step.n}
                </span>
                <h3 className="font-display text-2xl">{step.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-primary-foreground/70">
                  {step.copy}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <SectionHeadingLight />
        </div>
      </div>
    </section>
  );
}

function SectionHeadingLight() {
  const process = ["Thread", "Handloom", "Design", "Dyeing", "Finishing", "Packaging", "You"];
  return (
    <>
      <Reveal className="text-center">
        <p className="eyebrow">The making of a saree</p>
        <h2 className="mt-4 text-3xl sm:text-4xl">Forty-two days on the loom</h2>
      </Reveal>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        {process.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <span className="rounded-full border border-accent/40 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-primary-foreground/85">
              {step}
            </span>
            {i < process.length - 1 ? <span className="hairline-gold w-6 opacity-60" /> : null}
          </motion.div>
        ))}
      </div>
    </>
  );
}
