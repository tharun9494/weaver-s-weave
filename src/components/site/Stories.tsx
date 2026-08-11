import { Link } from "@tanstack/react-router";
import { categories } from "@/data/catalog";
import logo from "@/assets/logo.png";

export function Stories() {
  // Let's add an extra story for the weaver families
  const stories = [
    { name: "Our Weavers", to: "/weavers", image: logo, highlight: true },
    ...categories.map((c) => ({
      name: c.name.split(" ")[0], // Keep it short for mobile labels
      to: "/collections",
      image: c.image,
      highlight: false,
    })),
  ];

  return (
    <div className="lg:hidden w-full overflow-x-auto no-scrollbar pt-24 pb-4 border-b border-border/40 bg-card/45 backdrop-blur-md flex gap-4 px-5 snap-x snap-mandatory">
      {stories.map((story, i) => (
        <Link
          key={i}
          to={story.to}
          className="flex flex-col items-center justify-center shrink-0 snap-start text-center cursor-pointer"
        >
          {/* Circular avatar ring */}
          <div
            className={`size-16 rounded-full p-0.5 shadow-soft transition-transform duration-300 active:scale-95 ${
              story.highlight
                ? "bg-gradient-to-tr from-accent via-red-500 to-yellow-500 animate-pulse"
                : "border-2 border-accent"
            }`}
          >
            <div className="size-full overflow-hidden rounded-full bg-secondary">
              <img
                src={story.image}
                alt={story.name}
                className="size-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
          {/* Label */}
          <span
            className={`mt-1.5 text-[9px] uppercase tracking-wider font-semibold font-sans ${
              story.highlight ? "text-accent" : "text-muted-foreground"
            }`}
          >
            {story.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
