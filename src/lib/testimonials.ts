export interface TraderTestimonial {
  name: string;
  role: string;
  tag: string;
  quote: string;
  rating: number;
}

export const TRADER_TESTIMONIALS: TraderTestimonial[] = [
  {
    name: "Marcus D.",
    role: "TradeLocker Desktop / 50k evaluation",
    tag: "Consistency",
    quote:
      "I wasn’t losing because my entries were garbage. I was losing because Day 2 would go too well and then the consistency rule killed me. The playbook caps and the tracker made that obvious fast.",
    rating: 5,
  },
  {
    name: "Elena V.",
    role: "XAUUSD + EURUSD",
    tag: "Manual + bot",
    quote:
      "I use Quant Protocol on the sessions I actually want automated and keep the rest manual. The important part is it stays flat when the tape is dead. That alone cut my overtrading.",
    rating: 5,
  },
  {
    name: "Jay R.",
    role: "NAS100 / funded-challenge hopper",
    tag: "Daily loss",
    quote:
      "The live risk tools are the reason I stayed in the account. I finally had a hard view of heat before I clicked. The bot is extra. The risk layer is the product.",
    rating: 5,
  },
  {
    name: "Sofia K.",
    role: "First prop attempt",
    tag: "Education",
    quote:
      "Chart Academy is actually usable. Short lessons, no 4-hour guru speech. I went through BOS and session structure before I even turned the bot on.",
    rating: 5,
  },
  {
    name: "Andre P.",
    role: "Systematic trader",
    tag: "Filters",
    quote:
      "Most marketplace bots just spam entries. This one is picky. When HTF is off, it holds. That matches how I already trade silver and NAS.",
    rating: 5,
  },
  {
    name: "Riley M.",
    role: "100k 2-step",
    tag: "Process",
    quote:
      "I wanted a system I could run like a desk, not a signal group. Playbook in the morning, engines for size, journal at night. $150 is cheaper than another reset fee.",
    rating: 5,
  },
];

export const TRADER_PULL_QUOTES = [
  "It stayed out of the lunch chop. That’s the feature.",
  "Not magic. Just fewer stupid trades.",
  "Desktop-only annoyed me at first. Then I realized that’s why the execution tools work.",
] as const;

export const TESTIMONIALS_DISCLAIMER =
  "Reviews reflect individual experiences. They are not typical and not a guarantee.";
