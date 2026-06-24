import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { DISCORD_INVITE_URL } from "@/lib/constants";
import { MessageSquare, Shield, Users, Radio } from "lucide-react";

export default function DiscordPortalPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          Discord Verification Portal
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          VIP community access — Premium ($149.99/mo) only
        </p>
      </div>

      <Card className="border-cyan-500/20">
        <CardContent className="flex items-center gap-6 py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
            <MessageSquare className="h-8 w-8 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-mono text-lg font-semibold text-slate-200">
              Quicksilver VIP Discord
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Connect your account to unlock private channels including live
              trade commentary, preset releases, and direct quant support.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary">
                  <Shield className="h-4 w-4" />
                  Connect to Discord
                </Button>
              </a>
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary">Open Discord Server</Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Radio,
            title: "Live Signals",
            desc: "Real-time market commentary during London & NY sessions",
            status: "Active",
          },
          {
            icon: Users,
            title: "Quant Lounge",
            desc: "Private channel for Premium members",
            status: "Verified",
          },
          {
            icon: Shield,
            title: "Preset Drops",
            desc: "Monthly configuration and strategy releases",
            status: "Scheduled",
          },
        ].map((channel) => {
          const Icon = channel.icon;
          return (
            <Card key={channel.title}>
              <CardHeader className="flex flex-row items-center gap-3">
                <Icon className="h-5 w-5 text-cyan-400" />
                <h3 className="font-mono text-sm font-semibold text-slate-200">
                  {channel.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">{channel.desc}</p>
                <Badge variant="success" className="mt-3">
                  {channel.status}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <TerminalPanel title="Verification Status" status="online">
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Server Invite</span>
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              discord.gg/2Sw63dNKgk
            </a>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tier Access</span>
            <span className="text-emerald-400">Premium Channels Unlocked</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Connection</span>
            <span className="text-slate-400">Use invite link to join</span>
          </div>
        </div>
      </TerminalPanel>
    </div>
  );
}