import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { QuantProtocolAssetSettings } from "@/lib/trading-bots";

interface QuantProtocolSettingsProps {
  assets: QuantProtocolAssetSettings[];
}

export function QuantProtocolSettings({ assets }: QuantProtocolSettingsProps) {
  if (assets.length === 0) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="py-6">
          <Badge variant="warning" className="mb-3">
            Settings pending
          </Badge>
          <p className="font-mono text-sm text-slate-300">
            Asset-specific Quant Protocol settings will appear here.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Send the exact parameters per instrument (e.g. XAUUSD, NAS100, EURUSD) —
            timeframe, risk, stop/target, session filters, and any notes — and they will
            be published in this panel.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <Card key={asset.asset} className="border-slate-800/60">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                {asset.asset}
                {asset.name ? (
                  <span className="ml-2 font-normal text-slate-500">{asset.name}</span>
                ) : null}
              </h3>
            </div>
            <Badge variant="success">Recommended</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <dl className="grid gap-2 sm:grid-cols-2">
              {asset.settings.map((row) => (
                <div
                  key={`${asset.asset}-${row.label}`}
                  className="rounded-lg border border-slate-800/50 bg-slate-950/40 px-3 py-2"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
                    {row.label}
                  </dt>
                  <dd className="mt-0.5 font-mono text-sm text-cyan-300">{row.value}</dd>
                </div>
              ))}
            </dl>
            {asset.notes ? (
              <p className="text-xs leading-relaxed text-slate-500">{asset.notes}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
