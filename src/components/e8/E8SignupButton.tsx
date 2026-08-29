import { ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import { E8_SIGNUP, getE8ReferralUrl } from "@/lib/e8-partner";

export function E8SignupButton({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const href = getE8ReferralUrl();

  if (!href) {
    return (
      <Button variant="secondary" size={size} disabled>
        {E8_SIGNUP.pendingCta}
      </Button>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Button variant="gold" size={size}>
        {E8_SIGNUP.cta}
        <ExternalLink className="h-4 w-4" />
      </Button>
    </a>
  );
}
