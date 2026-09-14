import Button from "@/components/ui/Button";
import {
  TOURNAMENT,
  TRALENT_SIGNUP_URL,
  TRALENT_TOURNAMENT_URL,
} from "@/lib/tournaments";

export default function DashboardTournamentsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-[#F3F5F7]">{TOURNAMENT.h1}</h1>
      <p className="text-sm text-[#C9C2D6]">
        {TOURNAMENT.host}. ID {TOURNAMENT.id}. {TOURNAMENT.market}, {TOURNAMENT.duration}.{" "}
        {TOURNAMENT.start} → {TOURNAMENT.end} ({TOURNAMENT.timeNote}). {TOURNAMENT.entry}
      </p>
      <p className="text-sm text-[#C9C2D6]">{TOURNAMENT.prize}</p>
      <p className="text-sm text-[#C9C2D6]">{TOURNAMENT.quantityNote}</p>
      <p className="text-sm text-[#C9C2D6]">{TOURNAMENT.usNote}</p>
      <p className="text-sm text-[#C9C2D6]">{TOURNAMENT.custody}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a href={TRALENT_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="primary">Create Tralent account</Button>
        </a>
        <a href={TRALENT_TOURNAMENT_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary">Open tournament lobby</Button>
        </a>
      </div>
      <p className="text-sm text-[#C9C2D6]">{TOURNAMENT.howTo}</p>
      <p className="font-mono text-[11px] text-[#9AA3B2]">{TOURNAMENT.disclaimer}</p>
    </div>
  );
}
