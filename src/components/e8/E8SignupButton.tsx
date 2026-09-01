import { ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import { E8AffiliateLink } from "@/components/e8/E8AffiliateLink";
import { E8_SIGNUP } from "@/lib/e8-partner";

export function E8SignupButton({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div>
      <E8AffiliateLink>
        <Button variant="e8" size={size}>
          {E8_SIGNUP.cta}
          <ExternalLink className="h-4 w-4" />
        </Button>
      </E8AffiliateLink>
      <p className="mt-2 text-xs leading-relaxed text-[#C9C2D6]">{E8_SIGNUP.codeHint}</p>
    </div>
  );
}
