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
            Send the exact parameters per instrument (e.g. XAUUSD, NAS100, EURUSD) and they
            will be published in this panel with values and descriptions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {assets.map((asset) => (
        <Card
          key={asset.asset}
          className="overflow-hidden border-cyan-500/20 bg-gradient-to-br from-slate-950 via-slate-950 to-cyan-500/[0.04]"
        >
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 bg-slate-950/60">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-mono text-lg font-bold tracking-wide text-slate-100">
                  {asset.asset}
                </h3>
                {asset.name ? (
                  <span className="font-mono text-xs text-slate-500">{asset.name}</span>
                ) : null}
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-600">
                Quant Protocol · recommended parameters
              </p>
            </div>
            <Badge variant="success">Premium setup</Badge>
          </CardHeader>

          <CardContent className="p-0">
            <ul className="divide-y divide-slate-800/50">
              {asset.settings.map((row) => (
                <li
                  key={`${asset.asset}-${row.label}`}
                  className="px-5 py-4 transition-colors hover:bg-cyan-500/[0.03] sm:px-6"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {row.label}
                    </p>
                    <p className="shrink-0 font-mono text-base font-bold tabular-nums text-cyan-300 sm:text-right">
                      {row.value}
                    </p>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
                    {row.description}
                  </p>
                </li>
              ))}
            </ul>

            {asset.notes ? (
              <div className="border-t border-slate-800/60 bg-slate-950/40 px-5 py-4 sm:px-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
                  Notes
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{asset.notes}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
