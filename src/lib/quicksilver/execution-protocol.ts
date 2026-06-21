export interface ExecutionProtocolInput {
  direction: "long" | "short";
  entryPrice: number;
  stopPrice: number;
  accountSize: number;
  riskPercent: number;
  scaleOutLevels: number;
  useTrailingStop: boolean;
}

export interface ExecutionLevel {
  label: string;
  price: number;
  sizePercent: number;
  rMultiple: number;
  action: string;
}

export interface ExecutionProtocolResult {
  riskPerUnit: number;
  positionSize: number;
  dollarRisk: number;
  totalR: number;
  entryLadder: ExecutionLevel[];
  takeProfitLadder: ExecutionLevel[];
  invalidationPrice: number;
  breakEvenTrigger: number;
  trailingActivation: number;
  timeStopMinutes: number;
  protocolTier: "A" | "B" | "C";
  executionNotes: string[];
}

export function computeExecutionProtocol(
  input: ExecutionProtocolInput
): ExecutionProtocolResult {
  const {
    direction,
    entryPrice,
    stopPrice,
    accountSize,
    riskPercent,
    scaleOutLevels,
    useTrailingStop,
  } = input;

  const riskPerUnit = Math.abs(entryPrice - stopPrice);
  const dollarRisk = accountSize * (riskPercent / 100);
  const positionSize =
    riskPerUnit > 0 ? parseFloat((dollarRisk / riskPerUnit).toFixed(4)) : 0;

  const isLong = direction === "long";
  const sign = isLong ? 1 : -1;
  const totalR = riskPerUnit;

  const entryLadder: ExecutionLevel[] = [
    {
      label: "Primary Entry",
      price: entryPrice,
      sizePercent: 60,
      rMultiple: 0,
      action: "Execute at QS anchor zone",
    },
    {
      label: "Add-On Pullback",
      price: parseFloat((entryPrice - sign * riskPerUnit * 0.35).toFixed(4)),
      sizePercent: 25,
      rMultiple: -0.35,
      action: "Scale in on retest confirmation",
    },
    {
      label: "Final Scale",
      price: parseFloat((entryPrice - sign * riskPerUnit * 0.6).toFixed(4)),
      sizePercent: 15,
      rMultiple: -0.6,
      action: "Last add — abort if not filled before +1R",
    },
  ];

  const tpFractions = scaleOutLevels === 2 ? [0.6, 0.4] : [0.4, 0.35, 0.25];
  const tpMultiples =
    scaleOutLevels === 2 ? [1.5, 3] : [1, 2, 3.5];

  const takeProfitLadder: ExecutionLevel[] = tpMultiples.map((r, i) => ({
    label: `TP${i + 1}`,
    price: parseFloat((entryPrice + sign * riskPerUnit * r).toFixed(4)),
    sizePercent: Math.round(tpFractions[i] * 100),
    rMultiple: r,
    action: i === tpMultiples.length - 1 ? "Runner / trail remainder" : "Partial scale-out",
  }));

  const invalidationPrice = parseFloat(
    (stopPrice - sign * riskPerUnit * 0.15).toFixed(4)
  );
  const breakEvenTrigger = parseFloat(
    (entryPrice + sign * riskPerUnit * 0.8).toFixed(4)
  );
  const trailingActivation = parseFloat(
    (entryPrice + sign * riskPerUnit * 1.5).toFixed(4)
  );

  const protocolTier: ExecutionProtocolResult["protocolTier"] =
    riskPercent <= 1 ? "A" : riskPercent <= 2 ? "B" : "C";

  const executionNotes: string[] = [
    `QS Protocol Tier ${protocolTier}: ${scaleOutLevels}-stage scale-out ladder active.`,
    `Move stop to break-even at ${breakEvenTrigger} (+0.8R).`,
  ];

  if (useTrailingStop) {
    executionNotes.push(
      `Activate QS trailing engine at ${trailingActivation} (+1.5R) — 0.75R trail distance.`
    );
  }

  executionNotes.push(
    `Hard invalidation below ${invalidationPrice} — no re-entry same session.`
  );

  const timeStopMinutes =
    scaleOutLevels >= 3 ? 240 : 180;

  executionNotes.push(
    `Time stop: flatten if +1R not achieved within ${timeStopMinutes} minutes.`
  );

  return {
    riskPerUnit,
    positionSize,
    dollarRisk,
    totalR,
    entryLadder,
    takeProfitLadder,
    invalidationPrice,
    breakEvenTrigger,
    trailingActivation,
    timeStopMinutes,
    protocolTier,
    executionNotes,
  };
}