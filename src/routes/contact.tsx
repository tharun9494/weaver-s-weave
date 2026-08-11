import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { MapPin, Phone, Mail, MessageCircle, Instagram } from "lucide-react";

const title = "Contact Sahaana — Atelier, WhatsApp & Store Visit";
const description =
  "Reach the Sahaana atelier by WhatsApp, phone or email, or visit our Kanchipuram showroom. Styling and bridal consultations by appointment.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Contact,
});

const channels = [
  { icon: MessageCircle, label: "WhatsApp", value: "+91 98400 12345" },
  { icon: Phone, label: "Call the atelier", value: "+91 44 2722 8890" },
  { icon: Mail, label: "Email", value: "care@sahaana.silk" },
  { icon: Instagram, label: "Instagram", value: "@sahaana.handloom" },
  { icon: MapPin, label: "Showroom", value: "17 Gandhi Road, Kanchipuram 631502" },
];

function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 max-w-2xl text-4xl leading-[1.05] text-foreground sm:text-6xl">
          Speak to a <em className="text-gold-gradient not-italic">saree consultant</em>
        </h1>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal delay={0.08}>
          <ul className="space-y-px overflow-hidden rounded-3xl bg-border">
            {channels.map((channel) => (
              <li key={channel.label} className="flex items-center gap-5 bg-card p-6">
                <span className="inline-flex rounded-full bg-accent/12 p-3 text-accent">
                  <channel.icon className="size-5" strokeWidth={1.4} />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {channel.label}
                  </p>
                  <p className="mt-1 text-sm text-foreground">{channel.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.16}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-3xl border border-border bg-card p-6 sm:p-9 shadow-soft"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
              ].map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    required
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5">
              <label
                htmlFor="message"
                className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                How can we help?
              </label>
              <textarea
                id="message"
                rows={5}
                required
                className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="mt-7 w-full rounded-full bg-primary px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5"
            >
              Send enquiry
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
