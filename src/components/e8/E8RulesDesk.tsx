"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { E8SignupButton } from "@/components/e8/E8SignupButton";
import {
  E8_CHOOSER,
  E8_DEFAULT_MARKET,
  E8_DEFAULT_PRODUCT,
  E8_DEFAULT_SIZE,
  E8_MARKETS,
  E8_MARKET_NOTE,
  E8_PRODUCTS,
  E8_RULES_CONFIRM,
  E8_SIZE_OPTIONS,
  getE8Product,
  signatureMaxDd,
  type E8Market,
  type E8ProductId,
} from "@/lib/e8-rules";

export function E8RulesDesk() {
  const [productId, setProductId] = useState<E8ProductId>(E8_DEFAULT_PRODUCT);
  const [market, setMarket] = useState<E8Market>(E8_DEFAULT_MARKET);
  const [size, setSize] = useState(E8_DEFAULT_SIZE);

  const product = getE8Product(productId);
  const sizes: string[] = [...E8_SIZE_OPTIONS[productId]];
  const selectedSize = sizes.includes(size) ? size : sizes[0];
  const selectedMaxDd =
    productId === "signature" ? signatureMaxDd(selectedSize) : product.maxDdRange;

  function selectProduct(next: E8ProductId) {
    setProductId(next);
    const nextSizes: string[] = [...E8_SIZE_OPTIONS[next]];
    if (!nextSizes.includes(size)) setSize(next === "signature" ? "25K" : E8_DEFAULT_SIZE);
  }

  const challengeRows: [string, string][] = [
    ["Drawdown type", product.drawdownType],
    ["Max DD", productId === "signature" ? `${selectedSize}: ${selectedMaxDd}` : product.maxDdRange],
    ["Daily DD", product.dailyDd],
    ["Profit target", product.profitTarget],
    ["Daily profit cap", product.dailyProfitCap],
    ["Pass", product.pass],
    ["Activation fee", product.activationFee],
  ];

  const performanceRows: [string, string][] = [
    ["Consistency", product.consistency],
    ["First payout", product.firstPayout],
    ["Payout split", product.payoutSplit],
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89BB8]">
          Account chooser
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {E8_CHOOSER.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectProduct(item.id)}
              className={cn(
                "rounded-[6px] border px-3 py-2.5 text-left text-sm tracking-tight transition-colors",
                productId === item.id
                  ? "border-[#7FE7DC]/40 bg-[#7FE7DC]/10 text-[#F3F5F7]"
                  : "border-white/[0.08] text-[#C9C2D6] hover:text-[#F3F5F7]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-[#C9C2D6]">
        {E8_MARKET_NOTE} {E8_RULES_CONFIRM}
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,0.95fr)]">
        <div className="space-y-4 rounded-[6px] border border-white/[0.08] bg-[#141A24] p-4">
          <Field label="Product">
            <Switcher
              options={E8_PRODUCTS.map((p) => ({ id: p.id, label: p.name }))}
              value={productId}
              onChange={(id) => selectProduct(id as E8ProductId)}
            />
          </Field>
          <Field label="Market">
            <Switcher
              options={E8_MARKETS}
              value={market}
              onChange={(id) => setMarket(id as E8Market)}
            />
          </Field>
          <ChipRow label="Size" values={sizes} value={selectedSize} onChange={setSize} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <RuleColumn title="Challenge Rules" rows={challengeRows} />
          <RuleColumn title="Performance Rules" rows={performanceRows} />
        </div>

        <div className="space-y-4 rounded-[6px] border border-white/[0.08] bg-[#141A24] p-4">
          <SideBlock title="Best for" body={product.bestFor} />
          <SideBlock title="Kill-rule" body={product.killRule} />
          <SideBlock
            title="Mapped preset"
            body={`${product.presetCode} = ${product.preset}`}
          />
          <E8SignupButton />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89BB8]">
        {label}
      </p>
      {children}
    </div>
  );
}

function SideBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89BB8]">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[#F5F3FA]">{body}</p>
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
    <div className="flex flex-wrap overflow-hidden rounded-[6px] border border-white/[0.08]">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "flex-1 px-3 py-2 text-xs tracking-tight transition-colors sm:text-sm",
            value === opt.id
              ? "bg-white/[0.06] text-[#F3F5F7]"
              : "text-[#C9C2D6] hover:text-[#F3F5F7]"
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
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#A89BB8]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              "rounded-[6px] border px-2.5 py-1.5 text-xs tracking-tight transition-colors",
              value === item
                ? "border-[#7FE7DC]/40 bg-[#7FE7DC]/10 text-[#F3F5F7]"
                : "border-white/[0.08] text-[#C9C2D6] hover:text-[#F3F5F7]"
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
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A89BB8]">
              {k}
            </dt>
            <dd className="mt-0.5 text-sm text-white">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
