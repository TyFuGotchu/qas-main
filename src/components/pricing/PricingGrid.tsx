import { PRICING_TIERS } from "@/lib/pricing-tiers";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function PricingGrid() {
  return (
    <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
      {PRICING_TIERS.map((tier) => (
        <Card
          key={tier.id}
          glow={tier.recommended}
          className={cn(
            "relative flex flex-col transition-transform hover:scale-[1.02]",
            tier.recommended && "border-cyan-500/40"
          )}
        >
          {tier.recommended && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="success">Highly Recommended</Badge>
            </div>
          )}

          <CardHeader className="text-center">
            <h3 className="font-mono text-lg font-bold text-slate-200">
              {tier.name}
            </h3>
            <div className="mt-4">
              <span className="font-mono text-4xl font-bold text-cyan-terminal">
                {tier.price}
              </span>
              <span className="ml-1 font-mono text-sm text-slate-500">
                {tier.period}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col">
            <ul className="mb-8 flex-1 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-400">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-terminal" />
                  {feature}
                </li>
              ))}
            </ul>

            {tier.ctaLink ? (
              <a
                href={tier.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant={tier.recommended ? "primary" : "secondary"}
                  size="lg"
                  className="w-full"
                >
                  Subscribe via Stripe
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            ) : (
              <p className="text-center font-mono text-[10px] uppercase tracking-widest text-slate-600">
                No payment required
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}