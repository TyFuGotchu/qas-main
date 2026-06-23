import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { RecommendedBrokerCard } from "@/components/broker/RecommendedBrokerCard";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <RecommendedBrokerCard />
        </div>
      </section>
      <Stats />
      <section className="border-t border-slate-800/60 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-mono text-2xl font-bold text-slate-200">
            Freemium Chart Academy
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Every lesson and guide is SEO-indexed with a free preview. Unlock
            full content and interactive QS Planning Modules as you upgrade —
            1 free lesson, 2 at Tier 1 ($24.99), unlimited at Premium
            ($199.99).
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/solutions">
              <Button variant="secondary" size="lg">
                Try Free Trading Demos
              </Button>
            </Link>
            <Link href="/lessons">
              <Button variant="ghost" size="lg">
                Lesson Previews
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="ghost" size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-mono text-2xl font-bold text-slate-200">
            Ready to Deploy?
          </h2>
          <p className="mt-4 text-slate-500">
            Create your profile to unlock access tier options and deploy the
            Quicksilver algorithmic infrastructure — from TradeLocker bot
            execution to the full institutional quant suite.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Create Profile to View Access Tiers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}