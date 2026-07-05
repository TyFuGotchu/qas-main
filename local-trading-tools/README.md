# Quicksilver Local Trading Tools Funnel (Deprecated)

> **Canonical hosting:** Tools are native on the main Next.js app at `/tools` and `/dashboard/tools/*`. Premium subscription unlocks all three calculators.

This Flask microservice is retained for reference only. New deployments should use the main Vercel site.

## Historical Railway deployment

1. Create a **new Railway service** in the `qas-main` project.
2. Set **Root Directory** to `local-trading-tools`.
3. Railway detects Python via `requirements.txt` and starts with `gunicorn app:app`.

## Local dev (legacy)

```bash
cd local-trading-tools
pip install -r requirements.txt
python app.py
# http://localhost:8000
```

## Tools (now Premium-included on main site)

| Tool | Access |
|------|--------|
| Strategy Expectancy Validator | Premium |
| Dynamic ATR Pip-Range Calculator | Premium |
| Prop Firm Compounding Matrix | Premium |