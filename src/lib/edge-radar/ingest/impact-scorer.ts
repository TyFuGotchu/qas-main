const HIGH_IMPACT = [
  /\bruled out\b/i,
  /\bout\b/i,
  /\binactive\b/i,
  /\bwill not play\b/i,
  /\bwon't play\b/i,
  /\bseason[- ]ending\b/i,
  /\btorn\b/i,
  /\bsurgery\b/i,
  /\bplaced on ir\b/i,
  /\bsuspended\b/i,
  /\bwithdrew\b/i,
  /\bwithdrawn\b/i,
  /\bcancelled\b/i,
  /\bcanceled\b/i,
];

const MEDIUM_IMPACT = [
  /\bdoubtful\b/i,
  /\bquestionable\b/i,
  /\blimited\b/i,
  /\bdowngraded\b/i,
  /\bgame[- ]time decision\b/i,
  /\bprobable\b/i,
  /\binjury\b/i,
  /\bhamstring\b/i,
  /\bankle\b/i,
  /\bconcussion\b/i,
  /\btrade(d)?\b/i,
  /\blineup\b/i,
];

const LOW_IMPACT = [
  /\bpractice\b/i,
  /\bexpected to play\b/i,
  /\bcleared\b/i,
  /\bavailable\b/i,
  /\bprops\b/i,
  /\bodds\b/i,
];

export function scoreNewsImpact(headline: string, summary: string): number {
  const text = `${headline} ${summary}`;

  let score = 35;

  for (const pattern of HIGH_IMPACT) {
    if (pattern.test(text)) {
      score = Math.max(score, 82 + Math.floor(Math.random() * 12));
    }
  }

  for (const pattern of MEDIUM_IMPACT) {
    if (pattern.test(text)) {
      score = Math.max(score, 55 + Math.floor(Math.random() * 20));
    }
  }

  for (const pattern of LOW_IMPACT) {
    if (pattern.test(text)) {
      score = Math.max(score, 40 + Math.floor(Math.random() * 15));
    }
  }

  return Math.min(100, Math.max(15, score));
}

export function shouldSpawnPropWatch(impactScore: number): boolean {
  return impactScore >= 72;
}

export function extractPlayerHint(headline: string): string | null {
  const patterns = [
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s+(ruled|out|injured|questionable|doubtful|limited)/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s+(ruled out|will not play)/i,
  ];

  for (const pattern of patterns) {
    const match = headline.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return null;
}