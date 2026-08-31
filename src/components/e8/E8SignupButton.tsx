import { ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import { E8_SIGNUP, getE8ReferralUrl } from "@/lib/e8-partner";

export function E8SignupButton({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const href = getE8ReferralUrl();

  return (
    <div>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Button variant="e8" size={size}>
          {E8_SIGNUP.cta}
          <ExternalLink className="h-4 w-4" />
        </Button>
      </a>
      <p className="mt-2 text-xs leading-relaxed text-[#C9C2D6]">{E8_SIGNUP.codeHint}</p>
    </div>
  );
}
