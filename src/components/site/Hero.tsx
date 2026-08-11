import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-saree.jpg";

const particles = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7.3 + 5) % 96}%`,
  top: `${(i * 13.7 + 8) % 90}%`,
  size: 3 + ((i * 5) % 7),
  delay: (i % 7) * 0.9,
}));

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({
          x: (e.clientX - r.left) / r.width - 0.5,
          y: (e.clientY - r.top) / r.height - 0.5,
        });
      }}
      className="relative min-h-[100svh] overflow-hidden bg-gradient-ivory"
    >
      {/* animated aurora glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-aurora absolute -left-24 top-10 size-[38rem] rounded-full bg-accent/20 blur-[130px]" />
        <div
          className="animate-aurora absolute -right-20 bottom-0 size-[34rem] rounded-full bg-primary/15 blur-[140px]"
          style={{ animationDelay: "-8s" }}
        />
        {particles.map((p, i) => (
          <span
            key={i}
            className="animate-float-slow absolute rounded-full bg-accent"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow"
          >
            From the weaver's loom — direct to you
          </motion.p>

          <h1 className="mt-7 text-5xl leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {["Handwoven", "silk, without", "middlemen."].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {i === 2 ? <em className="text-gold-gradient not-italic">{line}</em> : line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            Every saree in our atelier is traced to the artisan who wove it — pure zari, natural
            dyes, and six generations of craft, priced fairly for both of you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-11 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/collections"
              className="group relative overflow-hidden rounded-full bg-primary px-9 py-4 text-[12px] uppercase tracking-[0.22em] text-primary-foreground shadow-soft transition-transform duration-500 hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now <ArrowRight className="size-3.5" strokeWidth={1.6} />
              </span>
              <span className="animate-shimmer absolute inset-y-0 -left-1/2 w-1/3 bg-accent/35" />
            </Link>
            <Link
              to="/collections"
              className="rounded-full border border-accent/60 px-9 py-4 text-[12px] uppercase tracking-[0.22em] text-foreground transition-colors duration-500 hover:bg-accent/12"
            >
              Explore Collections
            </Link>
          </motion.div>

          <div className="mt-14 flex flex-wrap gap-10">
            {[
              ["320+", "Weaver families"],
              ["100%", "Pure silk mark"],
              ["48h", "Atelier dispatch"],
            ].map(([value, label], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 + i * 0.12 }}
              >
                <p className="font-display text-3xl text-foreground">{value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ y: imageY }}
          className="relative z-0 mt-12 lg:mt-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="relative"
            style={{ transform: `translate3d(${tilt.x * 18}px, ${tilt.y * 18}px, 0)` }}
          >
            <div className="absolute -inset-6 rounded-[999px_999px_40px_40px] bg-accent/18 blur-3xl" />
            <img
              src={heroImage}
              alt="Model wearing a deep maroon handwoven Kanchipuram silk saree with gold zari border"
              width={1600}
              height={1920}
              className="relative rounded-[120px_120px_24px_24px] sm:rounded-[220px_220px_24px_24px] object-cover shadow-luxe max-h-[500px] lg:max-h-[640px] w-full"
            />
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 lg:bottom-8 lg:left-0 lg:-translate-x-1/4 rounded-2xl border border-accent/30 bg-card/80 px-6 py-4 shadow-soft backdrop-blur-xl">
              <p className="eyebrow text-[9px]">Woven in Kanchipuram</p>
              <p className="mt-1.5 font-display text-lg text-foreground">by Murugan & family</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

