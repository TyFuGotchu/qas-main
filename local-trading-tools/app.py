"""Quicksilver Local Trading Tools — Flask service for Railway."""

from __future__ import annotations

import os
from typing import Any

from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder="static", static_url_path="/static")

PREMIUM_CHECKOUT_URL = os.environ.get(
    "PREMIUM_CHECKOUT_URL",
    "https://buy.stripe.com/fZufZhcWo4XY4L7727co00c?prefilled_promo_code=FIRST100",
)


def calculate_compounding_matrix(
    starting_balance: float,
    target_profit: float,
    win_rate: float,
    max_drawdown_pct: float,
    risk_reward: float = 2.0,
    trades: int = 10,
) -> list[dict[str, Any]]:
    """Build a 10-trade lot-sizing progression table for prop compounding."""
    if starting_balance <= 0:
        raise ValueError("Starting balance must be positive")
    if target_profit < 0:
        raise ValueError("Target profit cannot be negative")
    if not 0 < win_rate <= 100:
        raise ValueError("Win rate must be between 0 and 100")
    if not 0 < max_drawdown_pct <= 100:
        raise ValueError("Max drawdown must be between 0 and 100")

    target_balance = starting_balance + target_profit
    win_prob = win_rate / 100
    loss_prob = 1 - win_prob

    # Spread drawdown budget across the plan; floor at 0.25% risk per trade
    risk_pct = max(0.25, min(2.5, max_drawdown_pct / trades))

    rows: list[dict[str, Any]] = []
    balance = starting_balance
    peak = starting_balance

    for trade_num in range(1, trades + 1):
        risk_amount = round(balance * (risk_pct / 100), 2)
        # Simplified lot proxy: $10 per pip equivalent
        lot_size = round(max(risk_amount / 10, 0.01), 2)

        if_win = round(balance + risk_amount * risk_reward, 2)
        if_loss = round(max(balance - risk_amount, 0), 2)
        expected = round(
            balance + (win_prob * risk_amount * risk_reward) - (loss_prob * risk_amount),
            2,
        )

        pct_to_target = round(
            ((expected - starting_balance) / target_profit * 100) if target_profit else 0,
            1,
        )

        rows.append(
            {
                "trade": trade_num,
                "balance": round(balance, 2),
                "riskPct": round(risk_pct, 2),
                "riskAmount": risk_amount,
                "lotSize": lot_size,
                "ifWin": if_win,
                "ifLoss": if_loss,
                "expectedBalance": expected,
                "pctToTarget": pct_to_target,
                "targetReached": expected >= target_balance,
            }
        )

        balance = expected
        peak = max(peak, balance)

    return rows


@app.get("/health")
def health() -> tuple[dict[str, str], int]:
    return {"status": "ok", "service": "quicksilver-local-tools"}, 200


@app.get("/")
def index():
    return send_from_directory("static", "index.html")


@app.post("/api/compounding-matrix")
def compounding_matrix_api():
    payload = request.get_json(silent=True) or {}

    try:
        starting_balance = float(payload.get("startingBalance", 0))
        target_profit = float(payload.get("targetProfit", 0))
        win_rate = float(payload.get("winRate", 0))
        max_drawdown_pct = float(payload.get("maxDrawdownPct", 0))
        risk_reward = float(payload.get("riskReward", 2.0))
        trades = int(payload.get("trades", 10))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid numeric input"}), 400

    try:
        rows = calculate_compounding_matrix(
            starting_balance=starting_balance,
            target_profit=target_profit,
            win_rate=win_rate,
            max_drawdown_pct=max_drawdown_pct,
            risk_reward=risk_reward,
            trades=trades,
        )
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    return jsonify(
        {
            "rows": rows,
            "summary": {
                "startingBalance": starting_balance,
                "targetProfit": target_profit,
                "targetBalance": round(starting_balance + target_profit, 2),
                "projectedEndBalance": rows[-1]["expectedBalance"] if rows else starting_balance,
                "winRate": win_rate,
                "maxDrawdownPct": max_drawdown_pct,
            },
        }
    )


@app.get("/api/config")
def config():
    return jsonify({"premiumCheckoutUrl": PREMIUM_CHECKOUT_URL})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")