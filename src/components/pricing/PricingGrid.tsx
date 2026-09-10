import { CONSUMER_PLANS } from "@/lib/plans";
import { StripeBuyButton } from "@/components/billing/StripeBuyButton";
import Link from "next/link";

export function PricingGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {CONSUMER_PLANS.map((plan) => (
        <article
          key={plan.id}
          className="flex flex-col rounded-[16px] border border-white/[0.1] bg-[#0B0D12] p-6"
        >
          <h3 className="font-mono text-sm uppercase tracking-[0.14em] text-[#7FE7DC]">
            {plan.name}
          </h3>
          <p className="mt-3 text-3xl font-semibold text-white">
            {plan.price}
            <span className="ml-1 text-base font-normal text-[#9AA3B2]">{plan.period}</span>
          </p>
          <p className="mt-3 text-sm text-[#C9C2D6]">{plan.summary}</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-[#C9C2D6]">
            {plan.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-6">
            <StripeBuyButton buyButtonId={plan.buyButtonId} />
          </div>
        </article>
      ))}
      <p className="lg:col-span-3 text-sm text-[#9AA3B2]">
        No public coupons. Profit-split is request-only via{" "}
        <Link href="/arsenal" className="text-[#7FE7DC] hover:underline">
          Arsenal
        </Link>
        .
      </p>
    </div>
  );
}
