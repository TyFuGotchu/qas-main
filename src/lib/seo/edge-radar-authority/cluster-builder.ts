import {
  EDGE_RADAR_CHECKOUT_URL,
  EDGE_RADAR_NAME,
  EDGE_RADAR_PATH,
  EDGE_RADAR_PRICE,
} from "@/lib/edge-radar";
import {
  HIGH_VOLUME_SPORT_IDS,
  PUBLISHED_AT,
  SEO_BOOKS,
  SEO_SPORTS,
  SEO_TOPICS,
  type BookSlug,
  type TopicSlug,
} from "@/lib/seo/edge-radar-authority/data";
import type {
  AuthoritySection,
  EdgeRadarClusterPage,
} from "@/lib/seo/edge-radar-authority/types";

const EDGE_RADAR_CTA = `${EDGE_RADAR_NAME} (${EDGE_RADAR_PRICE}) scans live injury news and cross-book prop lines on DraftKings, FanDuel, and BetMGM — subscribe at ${EDGE_RADAR_CHECKOUT_URL}.`;

function buildSportPage(sport: (typeof SEO_SPORTS)[number]): EdgeRadarClusterPage {
  const slug = `${sport.id}-player-props-scanner`;
  const propList = sport.propTypes.join(", ");
  const triggerList = sport.injuryTriggers.join(", ");

  const sections: AuthoritySection[] = [
    {
      heading: `Why ${sport.label} Player Props Lag Behind News`,
      level: 2,
      paragraphs: [
        `${sport.label} prop lines move fastest on star-player news — but US books rarely adjust every market simultaneously. When a ${triggerList.toLowerCase()} hits, DraftKings may reprice points before FanDuel updates receiving or rushing alternates.`,
        `Peak ${sport.label} betting runs ${sport.peakSeason.toLowerCase()}. Edge windows are shortest on game days and injury report windows when recreational volume spikes and books batch-update correlated props.`,
      ],
    },
    {
      heading: `High-Impact ${sport.label} Prop Markets`,
      level: 2,
      paragraphs: [
        `Focus on markets with the tightest correlation to injury news: ${propList}. These markets see the largest line moves when usage or role changes.`,
      ],
      listItems: sport.propTypes.map(
        (p) => `${sport.label} ${p} — repriced within 2–8 minutes on major news, longer on alt books`
      ),
    },
    {
      heading: `Injury Triggers to Watch`,
      level: 2,
      paragraphs: [
        `Train your workflow around ${sport.label}-specific signals: ${triggerList}. Each trigger maps to predictable usage shifts — the lag window exists between headline publication and full book repricing.`,
      ],
      orderedItems: [
        `Monitor injury/lineup feed for ${triggerList.toLowerCase()} tags`,
        `Check ${sport.shortLabel} player props on DraftKings vs FanDuel within 60 seconds`,
        `Flag lines that haven't moved when correlated markets already shifted`,
        `Size bets before the slowest book catches up (typically 2–6 minute window)`,
      ],
    },
    {
      heading: "Automate With Edge Radar",
      level: 2,
      paragraphs: [
        `Manual scanning across ${sport.label} props and three books breaks down during busy slates. ${EDGE_RADAR_CTA}`,
      ],
      listItems: [
        `Live ${sport.label} filter in the Edge Radar terminal`,
        "News impact scores (1–100) on every injury headline",
        "Cross-book line lag alerts when DK/FD diverge",
        "Auto-refresh feed every 30 seconds",
      ],
    },
  ];

  const faqs = [
    {
      question: `What are the best ${sport.label} player props to bet?`,
      answer: `The highest-edge ${sport.label} props correlate directly with injury news: ${propList}. When a starter is ruled OUT, backup ${sport.propTypes[0]} and ${sport.propTypes[1] ?? sport.propTypes[0]} lines lag most often.`,
    },
    {
      question: `How fast do ${sport.label} prop lines move after injury news?`,
      answer: `Major US books typically adjust primary markets within 2–8 minutes. Alternate and derivative props (${sport.propTypes.slice(2).join(", ") || propList}) can lag 5–15 minutes — that's the Edge Radar window.`,
    },
    {
      question: `Does Edge Radar cover ${sport.label}?`,
      answer: `Yes. Filter the live terminal to ${sport.label} for prop alerts, news impact scores, and cross-book line lag detection. ${EDGE_RADAR_PRICE} — cancel anytime.`,
    },
  ];

  const related = SEO_SPORTS.filter((s) => s.id !== sport.id)
    .slice(0, 4)
    .map((s) => `${s.id}-player-props-scanner`);

  return {
    slug,
    title: `${sport.label} Player Props Scanner — Live Line Lag & +EV Alerts | Edge Radar`,
    metaDescription: `Scan ${sport.label} player props for line lag on DraftKings & FanDuel. Live injury news, +EV alerts, and impact scores — ${EDGE_RADAR_PRICE}.`,
    h1: `${sport.label} Player Props Scanner — Catch Line Lag Before Books Adjust`,
    directAnswer: `The fastest ${sport.label} prop edges appear in the 2–8 minute window after ${triggerList.toLowerCase()} news — when one sportsbook has repriced ${propList} but another hasn't.`,
    variant: "sport",
    sportId: sport.id,
    sportLabel: sport.label,
    topicSlug: null,
    bookSlug: null,
    bookName: null,
    intro: `${sport.label} bettors who react to injury news before books fully adjust capture +EV on ${propList}. This guide covers the ${sport.shortLabel} prop markets, lag patterns, and how Edge Radar automates the scan.`,
    sections,
    faqs,
    relatedSlugs: related,
    publishedAt: PUBLISHED_AT,
    keywords: [
      `${sport.label} player props`,
      `${sport.label} prop betting`,
      `${sport.label} injury props`,
      `${sport.shortLabel} line movement`,
      `+EV ${sport.label} props`,
    ],
  };
}

function buildTopicPage(topic: (typeof SEO_TOPICS)[number]): EdgeRadarClusterPage {
  const topicContent: Record<
    TopicSlug,
    { directAnswer: string; intro: string; sections: AuthoritySection[]; faqs: { question: string; answer: string }[] }
  > = {
    "line-lag-detection": {
      directAnswer:
        "Line lag is when one sportsbook updates player prop odds after injury news while another book still shows stale lines — typically a 2–8 minute window on DraftKings vs FanDuel.",
      intro:
        "Line lag detection is the core edge in player prop betting. When injury or lineup news breaks, books don't reprice simultaneously. Scanning cross-book divergence before the market catches up is how sharp bettors find +EV.",
      sections: [
        {
          heading: "What Is Sportsbook Line Lag?",
          level: 2,
          paragraphs: [
            "Line lag occurs when correlated prop markets on different books are out of sync. DraftKings might drop a star's points line from 28.5 to 25.5 while FanDuel still shows 28.5 for 3–6 minutes.",
            "The lag exists because books use different pricing engines, batch-update schedules, and risk thresholds. Recreational volume on game days slows manual trader reaction — automation wins.",
          ],
        },
        {
          heading: "How to Detect Line Lag Manually",
          level: 2,
          orderedItems: [
            "Open the same player prop on DraftKings and FanDuel side by side",
            "When injury news hits, note which book moved first",
            "Bet the stale book before it catches up (unders on OUT players, overs on usage bumps)",
            "Exit or hedge when lines converge",
          ],
          paragraphs: [],
        },
        {
          heading: "Automate Line Lag With Edge Radar",
          level: 2,
          paragraphs: [EDGE_RADAR_CTA],
          listItems: [
            "LINE LAG signal when DK/FD diverge on the same prop",
            "News impact scores rank which headlines will move lines",
            "Every major US sport in one terminal",
          ],
        },
      ],
      faqs: [
        {
          question: "How long does sportsbook line lag last?",
          answer:
            "Typically 2–8 minutes on primary player props during NFL and NBA slates. Alternate lines and smaller books can lag 10–15 minutes.",
        },
        {
          question: "Which books have the most line lag?",
          answer:
            "DraftKings and FanDuel usually move first; lag is measured between them and slower books like Caesars or ESPN BET on derivative props.",
        },
      ],
    },
    "injury-prop-betting": {
      directAnswer:
        "Injury prop betting exploits the delay between injury report publication and full sportsbook repricing — bet unders on ruled-OUT players and overs on usage beneficiaries before lines adjust.",
      intro:
        "Injury news is the #1 driver of player prop line movement. OUT tags, limited practice reports, and late scratches create predictable usage shifts — the edge is speed and cross-book awareness.",
      sections: [
        {
          heading: "Injury News That Moves Props",
          level: 2,
          listItems: [
            "Game-time decision → minutes/rebounds uncertainty",
            "Ruled OUT → immediate under value on points/yards before full reprice",
            "Returning from injury → lines often start conservative (over value)",
            "Lineup change → teammate usage props lag 3–10 minutes",
          ],
          paragraphs: [
            "Not every injury headline matters. Focus on starters and high-usage players whose absence shifts team volume to specific teammates.",
          ],
        },
        {
          heading: "The Injury Prop Workflow",
          level: 2,
          orderedItems: [
            "Confirm injury source (official team report > beat reporter > aggregator)",
            "Identify usage beneficiaries (backup RB, #2 WR, sixth man)",
            "Check if primary AND derivative props moved on both DK and FD",
            "Bet stale lines; size down on questionable tags",
          ],
          paragraphs: [],
        },
        {
          heading: "News Impact Scores",
          level: 2,
          paragraphs: [
            "Edge Radar ranks every headline 1–100 by projected prop impact so you prioritize OUT tags over noise. High-impact news auto-spawns prop watch alerts.",
            EDGE_RADAR_CTA,
          ],
        },
      ],
      faqs: [
        {
          question: "Should you bet player props on questionable tags?",
          answer:
            "Questionable tags have wider variance. Size smaller and prefer markets that benefit from reduced minutes (unders) rather than locking overs on beneficiaries before confirmation.",
        },
        {
          question: "What injury news moves lines fastest?",
          answer:
            "Star player ruled OUT within 90 minutes of tip-off or kickoff. NBA late scratches and NFL inactive lists create the sharpest, shortest windows.",
        },
      ],
    },
    "ev-player-props-scanner": {
      directAnswer:
        "A +EV player props scanner compares live lines to fair value after news events — flagging mispriced overs and unders before sportsbooks fully adjust.",
      intro:
        "+EV (positive expected value) prop betting requires speed, cross-book comparison, and news context. A scanner automates what manual bettors can't sustain across every sport and slate.",
      sections: [
        {
          heading: "What Makes a Player Prop +EV?",
          level: 2,
          paragraphs: [
            "A prop is +EV when your estimated true probability exceeds the implied probability of the posted line. Injury-driven lag creates temporary +EV when stale books haven't incorporated new usage data.",
          ],
          listItems: [
            "Cross-book price divergence (one book off-market)",
            "News not yet in the line (OUT tag, lineup change)",
            "Correlated market moved but derivative hasn't",
          ],
        },
        {
          heading: "Scanner vs Manual Tracking",
          level: 2,
          paragraphs: [
            "During a 10-game NBA slate or Sunday NFL slate, manually checking every injury and every book is impossible. Edge Radar runs 24/7 on Quicksilver infrastructure.",
            EDGE_RADAR_CTA,
          ],
        },
      ],
      faqs: [
        {
          question: "Can a prop scanner guarantee profit?",
          answer:
            "No. Edge Radar surfaces statistical edges and line inefficiencies. Bankroll management and bet selection remain your responsibility.",
        },
      ],
    },
    "draftkings-fanduel-line-movement": {
      directAnswer:
        "DraftKings and FanDuel rarely move player prop lines at the same instant — compare both books within 60 seconds of injury news to catch the slower book.",
      intro:
        "DK vs FD line movement is the most actionable cross-book signal in US player prop betting. Both books lead market pricing, but their lag between each other creates daily edge opportunities.",
      sections: [
        {
          heading: "Typical DK vs FD Lag Patterns",
          level: 2,
          paragraphs: [
            "DraftKings often moves first on NBA points and NFL receiving yards. FanDuel can lag on assists, rebounds, and anytime TD alternates. Patterns shift by sport and slate — consistency matters less than real-time comparison.",
          ],
        },
        {
          heading: "Cross-Book Workflow",
          level: 2,
          orderedItems: [
            "Pin the same prop on DK and FD",
            "On news, identify which book moved",
            "Bet the stale side before convergence",
            "Log which book lagged for sport-specific patterns",
          ],
          paragraphs: [],
        },
        {
          heading: "Edge Radar Cross-Book Alerts",
          level: 2,
          paragraphs: [EDGE_RADAR_CTA],
        },
      ],
      faqs: [
        {
          question: "Does DraftKings or FanDuel move lines first?",
          answer:
            "It varies by sport and market. NBA points often move on DK first; NFL anytime TD can lag on FD. Edge Radar logs LINE LAG signals regardless of which book is slow.",
        },
      ],
    },
    "news-impact-betting": {
      directAnswer:
        "News impact betting prioritizes headlines by how likely they are to move player prop lines — star OUT tags score 80+, minor updates score below 40.",
      intro:
        "Not every headline deserves a bet. News impact scoring filters injury noise so you act on the 10% of news that actually reprices DraftKings and FanDuel lines.",
      sections: [
        {
          heading: "Impact Score Tiers",
          level: 2,
          listItems: [
            "75–100: Act immediately — star OUT, starting QB change, late scratch",
            "45–74: Monitor — limited practice, questionable tags, lineup notes",
            "1–44: Background noise — minor updates, unrelated team news",
          ],
          paragraphs: [
            "Edge Radar computes impact scores on every RSS headline across 18 sports. Scores above 75 auto-spawn prop watch alerts.",
          ],
        },
        {
          heading: "Build a News-First Prop Process",
          level: 2,
          paragraphs: [EDGE_RADAR_CTA],
        },
      ],
      faqs: [
        {
          question: "How is news impact score calculated?",
          answer:
            "Edge Radar scores headlines by keyword signals (OUT, inactive, DNP, limited), player prominence hints, and sport context. Higher scores mean faster recommended action.",
        },
      ],
    },
    "live-prop-alerts": {
      directAnswer:
        "Live player prop alerts notify you when cross-book line lag or high-impact injury news creates a bettable edge — before lines fully correct.",
      intro:
        "Live prop alerts replace Discord channels and manual Twitter monitoring. Edge Radar pushes LINE LAG and NEWS WATCH signals to your hosted terminal in real time.",
      sections: [
        {
          heading: "Alert Types in Edge Radar",
          level: 2,
          listItems: [
            "LINE LAG — DK/FD divergence on the same player prop",
            "NEWS WATCH — high-impact headline with prop monitoring prompt",
            "EV % estimate on flagged opportunities",
          ],
          paragraphs: [],
        },
        {
          heading: "Alert Latency Matters",
          level: 2,
          paragraphs: [
            "Alerts refresh every 30 seconds on the client; ingest runs every 10 minutes for RSS and 4 leagues per run for SportsGameOdds prop data.",
            EDGE_RADAR_CTA,
          ],
        },
      ],
      faqs: [
        {
          question: "How fast are Edge Radar prop alerts?",
          answer:
            "News alerts appear within one ingest cycle (≤10 min). Line lag alerts depend on SportsGameOdds API polling. Client feed refreshes every 30 seconds.",
        },
      ],
    },
    "sportsbook-arbitrage-props": {
      directAnswer:
        "Player prop arbitrage on US books is rare but line lag creates soft arb opportunities — bet stale overs/unders across DraftKings and FanDuel before lines converge.",
      intro:
        "True risk-free prop arbitrage is uncommon in regulated US markets. Practical 'arb' is betting the slow book's mispriced side when news has moved the fast book — a latency edge, not a locked arb.",
      sections: [
        {
          heading: "Lag Arb vs True Arb",
          level: 2,
          paragraphs: [
            "True arb requires opposite sides at prices that guarantee profit. Line lag 'arb' is directional — you bet the stale line expecting convergence, not a locked payout.",
          ],
        },
        {
          heading: "When Lag Arb Works",
          level: 2,
          listItems: [
            "Star ruled OUT — under on stale over line",
            "Backup elevated — over on stale under line for usage bump",
            "Pitching change — strikeout props lag on slower book",
          ],
          paragraphs: [EDGE_RADAR_CTA],
        },
      ],
      faqs: [
        {
          question: "Is player prop arbitrage legal?",
          answer:
            "Betting on licensed US sportsbooks is legal in regulated states. Edge Radar does not facilitate account sharing or bonus abuse — it surfaces line inefficiencies.",
        },
      ],
    },
    "same-game-parlay-edge": {
      directAnswer:
        "SGP edge comes from correlated props that books misprice after injury news — e.g., star OUT + teammate over points bundled before the parlay engine fully adjusts.",
      intro:
        "Same game parlays (SGPs) multiply correlation errors after lineup changes. When injury news shifts usage, individual props lag — and SGP pricing lags even further.",
      sections: [
        {
          heading: "SGP Lag After Injury News",
          level: 2,
          paragraphs: [
            "When a starter is ruled OUT, books first move straight props, then adjust SGP correlation matrices. The window between straight prop reprice and SGP update can present value on correlated overs.",
          ],
        },
        {
          heading: "Use Edge Radar for Straight Props First",
          level: 2,
          paragraphs: [
            "Edge Radar focuses on straight player prop line lag — the fastest, most liquid edge. Use straight prop alerts to inform SGP construction on your book.",
            EDGE_RADAR_CTA,
          ],
        },
      ],
      faqs: [
        {
          question: "Does Edge Radar build SGPs?",
          answer:
            "Edge Radar flags straight prop line lag and news impact. You build SGPs on DraftKings or FanDuel using the intel from the terminal.",
        },
      ],
    },
  };

  const content = topicContent[topic.slug as TopicSlug];
  const related = [
    "nfl-player-props-scanner",
    "nba-player-props-scanner",
    "line-lag-detection" !== topic.slug ? "line-lag-detection" : "injury-prop-betting",
    "draftkings-fanduel-line-movement" !== topic.slug
      ? "draftkings-fanduel-line-movement"
      : "ev-player-props-scanner",
  ].filter((s) => s !== topic.slug);

  return {
    slug: topic.slug,
    title: `${topic.h1Keyword} — ${EDGE_RADAR_NAME} Guide`,
    metaDescription: `${topic.h1Keyword} for DraftKings & FanDuel player props. Live scanner, injury alerts, +EV signals — ${EDGE_RADAR_PRICE}.`,
    h1: topic.h1Keyword,
    directAnswer: content.directAnswer,
    variant: "topic",
    sportId: null,
    sportLabel: null,
    topicSlug: topic.slug,
    bookSlug: null,
    bookName: null,
    intro: content.intro,
    sections: content.sections,
    faqs: content.faqs,
    relatedSlugs: related,
    publishedAt: PUBLISHED_AT,
    keywords: [topic.keyword, "player props", "sports betting edge", EDGE_RADAR_NAME],
  };
}

function buildSportBookPage(
  sport: (typeof SEO_SPORTS)[number],
  book: (typeof SEO_BOOKS)[number]
): EdgeRadarClusterPage {
  const slug = `${sport.id}-${book.slug}-player-props`;
  const otherBooks = SEO_BOOKS.filter((b) => b.slug !== book.slug)
    .map((b) => b.name)
    .join(" and ");

  const sections: AuthoritySection[] = [
    {
      heading: `${book.name} ${sport.label} Prop Lag Patterns`,
      level: 2,
      paragraphs: [
        `${book.name} ${sport.label} player props (${sport.propTypes.slice(0, 3).join(", ")}) can lag ${otherBooks} by 2–8 minutes after ${sport.injuryTriggers[0].toLowerCase()} and ${sport.injuryTriggers[1]?.toLowerCase() ?? "lineup"} news.`,
        `During ${sport.peakSeason.toLowerCase()}, ${sport.shortLabel} volume peaks and ${book.shortName} risk engines batch-update correlated markets — creating predictable delay on derivative props.`,
      ],
    },
    {
      heading: `Workflow: ${book.name} ${sport.shortLabel} Props`,
      level: 2,
      orderedItems: [
        `Open ${sport.label} player props on ${book.name}`,
        `Compare to ${otherBooks} on the same player market`,
        `On injury news, bet ${book.name} if it's the stale book`,
        `Track which ${sport.shortLabel} markets ${book.shortName} reprices slowest`,
      ],
      paragraphs: [],
    },
    {
      heading: "Automate Cross-Book Scanning",
      level: 2,
      paragraphs: [EDGE_RADAR_CTA],
    },
  ];

  const faqs = [
    {
      question: `Does Edge Radar scan ${book.name} ${sport.label} props?`,
      answer: `Yes. Edge Radar compares ${book.name} against other major US books for ${sport.label} line lag and injury-driven mispricing.`,
    },
    {
      question: `Which ${sport.label} props lag most on ${book.name}?`,
      answer: `Alternate ${sport.propTypes[1] ?? sport.propTypes[0]} and ${sport.propTypes[2] ?? sport.propTypes[0]} markets often lag primary lines after ${sport.injuryTriggers[0].toLowerCase()} news.`,
    },
  ];

  return {
    slug,
    title: `${book.name} ${sport.label} Player Props — Line Lag Scanner | Edge Radar`,
    metaDescription: `Find ${book.name} ${sport.label} player prop line lag vs ${otherBooks}. Live injury alerts & +EV scanner — ${EDGE_RADAR_PRICE}.`,
    h1: `${book.name} ${sport.label} Player Props — Line Lag & +EV Scanner`,
    directAnswer: `${book.name} ${sport.label} props often lag ${otherBooks} by minutes after injury news — bet ${book.shortName} stale lines on ${sport.propTypes[0]} and ${sport.propTypes[1] ?? "usage"} markets before repricing.`,
    variant: "sport-book",
    sportId: sport.id,
    sportLabel: sport.label,
    topicSlug: null,
    bookSlug: book.slug,
    bookName: book.name,
    intro: `${book.name} bettors on ${sport.label} ${sport.propTypes.join(", ")} need cross-book awareness. This guide covers ${book.shortName} lag patterns and how Edge Radar flags stale ${sport.shortLabel} lines.`,
    sections,
    faqs,
    relatedSlugs: [
      `${sport.id}-player-props-scanner`,
      "draftkings-fanduel-line-movement",
      ...SEO_BOOKS.filter((b) => b.slug !== book.slug)
        .slice(0, 1)
        .map((b) => `${sport.id}-${b.slug}-player-props`),
    ],
    publishedAt: PUBLISHED_AT,
    keywords: [
      `${book.name} ${sport.label} props`,
      `${book.shortName} ${sport.shortLabel} player props`,
      `${sport.label} prop betting`,
      `${book.name} line movement`,
    ],
  };
}

const sportPages = SEO_SPORTS.map(buildSportPage);
const topicPages = SEO_TOPICS.map(buildTopicPage);
const sportBookPages = HIGH_VOLUME_SPORT_IDS.flatMap((sportId) => {
  const sport = SEO_SPORTS.find((s) => s.id === sportId)!;
  return SEO_BOOKS.map((book) => buildSportBookPage(sport, book));
});

export const EDGE_RADAR_CLUSTER_PAGES: EdgeRadarClusterPage[] = [
  ...sportPages,
  ...topicPages,
  ...sportBookPages,
];

export const EDGE_RADAR_CLUSTER_COUNT = EDGE_RADAR_CLUSTER_PAGES.length;

export function getEdgeRadarClusterBySlug(slug: string): EdgeRadarClusterPage | undefined {
  return EDGE_RADAR_CLUSTER_PAGES.find((p) => p.slug === slug);
}

export function getClustersBySport(sportId: string): EdgeRadarClusterPage[] {
  return EDGE_RADAR_CLUSTER_PAGES.filter((p) => p.sportId === sportId);
}

export function getClustersByTopic(topicSlug: string): EdgeRadarClusterPage[] {
  return EDGE_RADAR_CLUSTER_PAGES.filter((p) => p.topicSlug === topicSlug);
}

export function getSportBookClusters(sportId: string): EdgeRadarClusterPage[] {
  return EDGE_RADAR_CLUSTER_PAGES.filter(
    (p) => p.variant === "sport-book" && p.sportId === sportId
  );
}