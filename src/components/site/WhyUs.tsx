import { motion } from "motion/react";
import {
  Users,
  Repeat,
  ShieldCheck,
  Gift,
  Truck,
  BadgeCheck,
  HandCoins,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "./Reveal";

const pillars = [
  {
    icon: Users,
    title: "Our weavers",
    copy: "320 families on our register, paid before dispatch.",
  },
  { icon: Repeat, title: "Handloom process", copy: "Pit looms and jacquard, never power-loom." },
  {
    icon: ShieldCheck,
    title: "Quality check",
    copy: "11-point inspection on zari, weft and fall.",
  },
  { icon: Gift, title: "Packaging", copy: "Muslin wrap in a reusable cedar-lined box." },
  { icon: Truck, title: "Direct delivery", copy: "From loom to doorstep in 48 hours." },
  { icon: BadgeCheck, title: "Authenticity", copy: "Silk Mark certificate with every saree." },
  { icon: HandCoins, title: "No middlemen", copy: "Zero agents between the loom and you." },
  { icon: Sparkles, title: "Best price", copy: "Fair to the artisan, honest to you." },
];

export function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading eyebrow="Why buy from us" title="Eight promises, kept on every order" />
      <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.75, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-card p-4 sm:p-8 transition-colors duration-500 hover:bg-secondary flex flex-col justify-between"
          >
            <div>
              <span className="inline-flex rounded-full bg-accent/12 p-2 sm:p-3 text-accent transition-transform duration-500 group-hover:scale-110">
                <pillar.icon className="size-4 sm:size-5" strokeWidth={1.4} />
              </span>
              <h3 className="mt-4 font-display text-sm sm:text-xl text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground sm:text-sm">
                {pillar.copy}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
