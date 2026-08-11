import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { MapPin, Phone, Mail, MessageCircle, Instagram, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "sonner";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      });
      toast.success("Enquiry sent! A saree consultant will connect with you shortly.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("Firestore contact submission error: ", err);
      toast.error("Could not send enquiry. Please check database permissions.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 max-w-2xl text-3xl sm:text-6xl leading-[1.05] text-foreground">
          Speak to a <em className="text-gold-gradient not-italic">saree consultant</em>
        </h1>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal delay={0.08}>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border">
            {channels.map((channel) => (
              <li
                key={channel.label}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 bg-card p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 w-full">
                  <span className="inline-flex rounded-full bg-accent/12 p-2.5 sm:p-3 text-accent shrink-0">
                    <channel.icon className="size-4 sm:size-5" strokeWidth={1.4} />
                  </span>
                  <div className="min-w-0 w-full overflow-hidden">
                    <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground truncate">
                      {channel.label}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-foreground break-words font-sans">
                      {channel.value}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.16}>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border bg-card p-6 sm:p-9 shadow-soft"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contactName"
                  className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Name
                </label>
                <input
                  id="contactName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="contactEmail"
                  className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="contactMessage"
                className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                How can we help?
              </label>
              <textarea
                id="contactMessage"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 w-full flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer font-sans"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : "Send enquiry"}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
