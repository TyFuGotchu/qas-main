import Link from "next/link";
import {
  buildSupportMailto,
  SUPPORT_EMAIL,
  SUPPORT_HOURS,
  SUPPORT_RESPONSE_SLA,
  SUPPORT_TOPICS,
} from "@/lib/support";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Clock, Mail, MessageCircle } from "lucide-react";

interface SupportContactPanelProps {
  variant?: "full" | "compact";
  accountEmail?: string | null;
}

export function SupportContactPanel({
  variant = "full",
  accountEmail,
}: SupportContactPanelProps) {
  const defaultBody = accountEmail
    ? `Account email: ${accountEmail}\n\nDescribe your issue:\n`
    : "Describe your issue:\n";

  if (variant === "compact") {
    return (
      <Card className="border-cyan-accent/20">
        <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10">
            <Mail className="h-6 w-6 text-cyan-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm font-semibold text-slate-200">
              Email support
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {SUPPORT_EMAIL} · {SUPPORT_HOURS}
            </p>
          </div>
          <a href={buildSupportMailto("General", defaultBody)}>
            <Button variant="primary">Contact Support</Button>
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-cyan-accent/30 bg-gradient-to-br from-slate-950 to-cyan-accent/5">
        <CardContent className="py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10">
              <Mail className="h-7 w-7 text-cyan-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <Badge variant="success" className="mb-3">
                Official support channel
              </Badge>
              <h2 className="font-mono text-xl font-bold text-slate-100 sm:text-2xl">
                {SUPPORT_EMAIL}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                All support requests — billing, technical issues, TradeLocker,
                academy access, and account help — go to this address. We respond
                during {SUPPORT_HOURS}.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-accent" />
                  Premium: {SUPPORT_RESPONSE_SLA.premium}
                </span>
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-slate-500" />
                  Free: {SUPPORT_RESPONSE_SLA.free}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={buildSupportMailto("General", defaultBody)}>
                  <Button variant="primary" size="lg">
                    <Mail className="h-4 w-4" />
                    Email Support
                  </Button>
                </a>
                <Link href="/faq">
                  <Button variant="secondary" size="lg">
                    Browse FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPORT_TOPICS.map((topic) => (
          <Card key={topic.subject} className="transition-colors hover:border-cyan-accent/20">
            <CardHeader>
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                {topic.title}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">{topic.description}</p>
              <a
                href={buildSupportMailto(topic.subject, defaultBody)}
                className="mt-4 inline-block font-mono text-xs text-cyan-accent hover:underline"
              >
                Email about {topic.subject.toLowerCase()} →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}