(function () {
  "use strict";

  function parseNumberList(raw) {
    return raw
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => !Number.isNaN(n));
  }

  function formatR(value) {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(3)}R`;
  }

  function formatMoney(value) {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // ─── Tool 1: Strategy Expectancy ───────────────────────────────────────────
  function calcExpectancy() {
    const total = Number(document.getElementById("exp-total").value);
    const wins = Number(document.getElementById("exp-wins").value);
    const avgRR = Number(document.getElementById("exp-rr").value);
    const resultEl = document.getElementById("exp-result");
    const noteEl = document.getElementById("exp-note");

    if (!total || total <= 0 || wins < 0 || wins > total || avgRR < 0) {
      resultEl.textContent = "—";
      resultEl.className = "output-value neutral";
      noteEl.textContent = "Check inputs: wins must be ≤ total trades.";
      return;
    }

    const winRate = wins / total;
    const lossRate = 1 - winRate;
    const expectancy = winRate * avgRR - lossRate * 1;

    resultEl.textContent = formatR(expectancy);
    resultEl.className =
      "output-value " + (expectancy > 0 ? "" : expectancy < 0 ? "negative" : "neutral");

    const winPct = (winRate * 100).toFixed(1);
    if (expectancy > 0) {
      noteEl.textContent = `${winPct}% win rate @ ${avgRR}:1 R:R → positive edge.`;
    } else if (expectancy < 0) {
      noteEl.textContent = `${winPct}% win rate @ ${avgRR}:1 R:R → negative edge. Refine strategy.`;
    } else {
      noteEl.textContent = "Break-even expectancy at current parameters.";
    }
  }

  document.getElementById("exp-calc").addEventListener("click", calcExpectancy);

  // ─── Tool 2: ATR Pip-Range ─────────────────────────────────────────────────
  function calcAtrRange() {
    const highs = parseNumberList(document.getElementById("atr-highs").value);
    const lows = parseNumberList(document.getElementById("atr-lows").value);
    const pipMult = Number(document.getElementById("atr-pip-mult").value) || 10000;
    const resultEl = document.getElementById("atr-result");
    const noteEl = document.getElementById("atr-note");

    const len = Math.min(highs.length, lows.length);
    if (len < 2) {
      resultEl.textContent = "—";
      noteEl.textContent = "Need at least 2 matched high/low pairs.";
      return;
    }

    let sum = 0;
    for (let i = 0; i < len; i++) {
      const range = Math.abs(highs[i] - lows[i]);
      sum += range;
    }

    const avgRange = sum / len;
    const structuralPips = avgRange * pipMult;

    resultEl.textContent = `${structuralPips.toFixed(1)} pips`;
    noteEl.textContent = `Avg structural range over ${len} periods · multiplier ${pipMult.toLocaleString()}.`;
  }

  document.getElementById("atr-calc").addEventListener("click", calcAtrRange);

  // ─── Tool 3: Compounding Matrix (Flask API) ────────────────────────────────
  async function calcCompoundingMatrix() {
    const summaryEl = document.getElementById("cmp-summary");
    const tableWrap = document.getElementById("cmp-table-wrap");

    const payload = {
      startingBalance: Number(document.getElementById("cmp-balance").value),
      targetProfit: Number(document.getElementById("cmp-target").value),
      winRate: Number(document.getElementById("cmp-winrate").value),
      maxDrawdownPct: Number(document.getElementById("cmp-dd").value),
      trades: 10,
    };

    summaryEl.textContent = "Building matrix…";
    summaryEl.className = "loading";
    tableWrap.innerHTML = "";

    try {
      const res = await fetch("/api/compounding-matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      const { rows, summary } = data;
      const hitTarget = summary.projectedEndBalance >= summary.targetBalance;

      summaryEl.className = "output-note";
      summaryEl.innerHTML = `Projected end: <strong>${formatMoney(summary.projectedEndBalance)}</strong> · Target: <strong>${formatMoney(summary.targetBalance)}</strong> · ${hitTarget ? '<span style="color:#34d399">On pace</span>' : '<span style="color:#fbbf24">Below target</span>'}`;

      const table = document.createElement("table");
      table.className = "matrix";
      table.innerHTML = `
        <thead>
          <tr>
            <th>Trade</th>
            <th>Balance</th>
            <th>Risk %</th>
            <th>Risk $</th>
            <th>Lot</th>
            <th>If Win</th>
            <th>If Loss</th>
            <th>Expected</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const tbody = table.querySelector("tbody");
      rows.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>#${row.trade}</td>
          <td>${formatMoney(row.balance)}</td>
          <td>${row.riskPct}%</td>
          <td>${formatMoney(row.riskAmount)}</td>
          <td>${row.lotSize.toFixed(2)}</td>
          <td>${formatMoney(row.ifWin)}</td>
          <td>${formatMoney(row.ifLoss)}</td>
          <td>${formatMoney(row.expectedBalance)}</td>
        `;
        tbody.appendChild(tr);
      });

      tableWrap.appendChild(table);
    } catch (err) {
      summaryEl.className = "output-note";
      summaryEl.textContent = `Error: ${err.message}`;
    }
  }

  document.getElementById("cmp-calc").addEventListener("click", calcCompoundingMatrix);

  // ─── Premium CTA from API config (optional override) ───────────────────────
  fetch("/api/config")
    .then((r) => r.json())
    .then((cfg) => {
      if (cfg.premiumCheckoutUrl) {
        document.getElementById("premium-cta").href = cfg.premiumCheckoutUrl;
      }
    })
    .catch(() => {});

  // Auto-run calculators with defaults on load
  calcExpectancy();
  calcAtrRange();
})();