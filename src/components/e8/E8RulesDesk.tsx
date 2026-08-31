"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { E8SignupButton } from "@/components/e8/E8SignupButton";
import {
  E8_MARKETS,
  E8_MARKET_NOTE,
  E8_MAX_DD_OPTIONS,
  E8_PRODUCTS,
  E8_RULES_CONFIRM,
  E8_SIZE_OPTIONS,
  getE8Product,
  getWorkedExample,
  signatureMaxDd,
  type E8Market,
  type E8ProductId,
} from "@/lib/e8-rules";

export function E8RulesDesk() {
  const [productId, setProductId] = useState<E8ProductId>("one");
  const [market, setMarket] = useState<E8Market>("forex");
  const [size, setSize] = useState("100K");
  const [maxDd, setMaxDd] = useState("6%");

  const product = getE8Product(productId);
  const sizes: string[] = [...E8_SIZE_OPTIONS[productId]];
  const maxDdOptions: string[] | null =
    productId === "signature" ? null : [...E8_MAX_DD_OPTIONS[productId]];

  const selectedSize = sizes.includes(size) ? size : sizes[0];
  const selectedMaxDd =
    productId === "signature"
      ? signatureMaxDd(selectedSize)
      : maxDdOptions && maxDdOptions.includes(maxDd)
        ? maxDd
        : maxDdOptions?.[0] ?? maxDd;

  const example = useMemo(
    () => getWorkedExample(productId, selectedSize, selectedMaxDd),
    [productId, selectedSize, selectedMaxDd]
  );

  const signatureDdNote =
    productId === "signature"
      ? `${selectedSize} max DD: ${selectedMaxDd}`
      : product.maxDdRange;

  const challengeRows = [
    ["Drawdown type", product.drawdownType],
    ["Max DD", signatureDdNote],
    ["Daily DD", product.dailyDd],
    ["Profit target", product.profitTarget],
    ["Daily profit cap", product.dailyProfitCap],
    ["Pass", product.pass],
    ["Activation", product.activationFee],
  ];

  const performanceRows = [
    ["Consistency", product.consistency],
    ["First payout", product.firstPayout],
    ["Payout split", product.payoutSplit],
    ...(product.extra ? [["Performance note", product.extra] as [string, string]] : []),
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-[#9AA3B2]">
        Educational E8 One / Pro / Signature maps for TradeLocker evaluation planning.{" "}
        {E8_MARKET_NOTE} {E8_RULES_CONFIRM}
      </p>

      <Switcher
        options={E8_PRODUCTS.map((p) => ({ id: p.id, label: p.name.replace("E8 ", "") }))}
        value={productId}
        onChange={(id) => {
          const next = id as E8ProductId;
          setProductId(next);
          const nextSizes: string[] = [...E8_SIZE_OPTIONS[next]];
          if (!nextSizes.includes(selectedSize)) setSize(nextSizes[0]);
          if (next !== "signature") {
            const opts: string[] = [...E8_MAX_DD_OPTIONS[next]];
            if (!opts.includes(selectedMaxDd)) setMaxDd(opts[0]);
          }
        }}
      />

      <Switcher
        options={E8_MARKETS}
        value={market}
        onChange={(id) => setMarket(id as E8Market)}
      />

      <ChipRow
        label="Size"
        values={[...sizes]}
        value={selectedSize}
        onChange={setSize}
      />

      {maxDdOptions && (
        <ChipRow
          label="Max DD"
          values={[...maxDdOptions]}
          value={selectedMaxDd}
          onChange={setMaxDd}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <RuleColumn title="Challenge Rules" rows={challengeRows} />
        <RuleColumn title="Performance Rules" rows={performanceRows} />
      </div>

      <p className="rounded-[6px] border border-white/[0.08] bg-[#141A24] px-4 py-3 text-sm text-[#F3F5F7]">
        Quicksilver preset: {product.preset}
      </p>

      {example && <p className="text-xs leading-relaxed text-[#9AA3B2]">{example}</p>}

      <E8SignupButton />
    </div>
  );
}

function Switcher({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-[6px] border border-white/[0.08]">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "px-4 py-2 text-sm tracking-tight transition-colors",
            value === opt.id
              ? "bg-white/[0.06] text-[#F3F5F7]"
              : "text-[#9AA3B2] hover:text-[#F3F5F7]"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ChipRow({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA3B2]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              "rounded-[6px] border px-3 py-1.5 text-xs tracking-tight transition-colors",
              value === item
                ? "border-[#7FE7DC]/40 bg-[#7FE7DC]/10 text-[#F3F5F7]"
                : "border-white/[0.08] text-[#9AA3B2] hover:text-[#F3F5F7]"
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function RuleColumn({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-[6px] border border-white/[0.08] bg-[#141A24] p-4">
      <h3 className="text-sm font-semibold tracking-tight text-[#F3F5F7]">{title}</h3>
      <dl className="mt-3 space-y-2.5">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9AA3B2]">
              {k}
            </dt>
            <dd className="mt-0.5 text-sm text-[#F3F5F7]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
