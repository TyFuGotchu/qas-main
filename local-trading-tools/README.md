# Quicksilver Local Trading Tools Funnel

Standalone Flask microservice for the three local trading calculators.

## Railway deployment

1. Create a **new Railway service** in the `qas-main` project.
2. Set **Root Directory** to `local-trading-tools`.
3. Railway will detect Python via `requirements.txt` and start with `gunicorn app:app`.
4. Optional env: `PREMIUM_CHECKOUT_URL` (defaults to Premium + FIRST100 Stripe link).

## Local dev

```bash
cd local-trading-tools
pip install -r requirements.txt
python app.py
# http://localhost:8000
```

## Tools

| Tool | Price | Stripe |
|------|-------|--------|
| Strategy Expectancy Validator | $6.99 | Client-side |
| Dynamic ATR Pip-Range Calculator | $12.99 | Client-side |
| Prop Firm Compounding Matrix | $14.99 | `/api/compounding-matrix` |