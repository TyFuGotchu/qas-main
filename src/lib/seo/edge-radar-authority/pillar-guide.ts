import {
  EDGE_RADAR_CHECKOUT_URL,
  EDGE_RADAR_NAME,
  EDGE_RADAR_PRICE,
} from "@/lib/edge-radar";
import { EDGE_RADAR_PILLAR_SLUG, PUBLISHED_AT } from "@/lib/seo/edge-radar-authority/data";
import type { EdgeRadarPillarPage } from "@/lib/seo/edge-radar-authority/types";

export const EDGE_RADAR_PILLAR_PAGE: EdgeRadarPillarPage = {
  slug: EDGE_RADAR_PILLAR_SLUG,
  title: "Ultimate Player Props Edge Playbook — Line Lag, Injury News & +EV Scanning",
  metaDescription:
    "The complete guide to player prop line lag, injury-driven betting, and +EV scanning on DraftKings & FanDuel. Powered by Quicksilver Edge Radar — $14.99/mo.",
  h1: "Ultimate Player Props Edge Playbook",
  directAnswer:
    "Player prop edges come from betting stale sportsbook lines in the 2–8 minute window after injury news — before DraftKings, FanDuel, and BetMGM fully reprice correlated markets.",
  publishedAt: PUBLISHED_AT,
  relatedClusterSlugs: [
    "line-lag-detection",
    "injury-prop-betting",
    "nba-player-props-scanner",
    "nfl-player-props-scanner",
    "draftkings-fanduel-line-movement",
    "ev-player-props-scanner",
  ],
  sections: [
    {
      heading: "The Player Prop Edge Stack",
      level: 2,
      paragraphs: [
        "Sharp prop bettors don't predict outcomes — they exploit latency. When injury news breaks, usage shifts are mathematically predictable. The edge is betting the slow book before lines converge.",
        "Three layers: (1) news speed, (2) cross-book comparison, (3) market selection. Miss any layer and you're betting into efficient lines.",
      ],
      orderedItems: [
        "Ingest injury/lineup news within 60 seconds of publication",
        "Compare the same prop on DraftKings, FanDuel, and BetMGM",
        "Bet stale lines on high-correlation markets (points, yards, strikeouts)",
        "Size by impact tier — star OUT > questionable tag",
        "Log which books lag by sport for pattern recognition",
      ],
    },
    {
      heading: "Line Lag Mathematics",
      level: 2,
      paragraphs: [
        "If Book A moves a line from 28.5 to 25.5 and Book B still shows 28.5, the under at 28.5 on Book B is temporarily +EV if true fair value is ≤25.5.",
        "Lag windows compress during primetime slates. NFL Sunday 1PM and NBA 7PM ET windows see 2–4 minute average lag; late-night slates can extend to 10 minutes on alternate props.",
      ],
    },
    {
      heading: "Injury News Impact Tiers",
      level: 2,
      listItems: [
        "Tier 1 (act now): Ruled OUT, inactive, starting QB change, late scratch",
        "Tier 2 (monitor): Limited practice, questionable, minutes restriction",
        "Tier 3 (ignore): Probable tags, maintenance rest, unrelated news",
      ],
      paragraphs: [
        "Edge Radar assigns impact scores 1–100 to every headline. Scores ≥75 auto-spawn prop watch alerts. This filters the 90% of news that doesn't move lines.",
      ],
    },
    {
      heading: "Sport-by-Sport Prop Markets",
      level: 2,
      paragraphs: [
        "NFL: receiving/rushing yards and anytime TD lag most on inactive list news. NBA: points and PRA move first; assists/rebounds lag. MLB: strikeout props after pitching changes. NHL: goalie confirmation drives saves and goal props.",
      ],
      listItems: [
        "NFL — yards, receptions, anytime TD",
        "NBA — points, PRA, threes",
        "MLB — strikeouts, total bases, hits",
        "NHL — goals, saves, shots on goal",
      ],
    },
    {
      heading: "Cross-Book Comparison Workflow",
      level: 2,
      paragraphs: [
        "DraftKings and FanDuel lead US prop pricing but rarely sync. Compare within 60 seconds of every Tier 1 headline. BetMGM and Caesars lag further on derivatives.",
        "Manual comparison breaks on multi-game slates. Automation is mandatory for consistent edge capture.",
      ],
    },
    {
      heading: "Automate With Edge Radar",
      level: 2,
      paragraphs: [
        `${EDGE_RADAR_NAME} (${EDGE_RADAR_PRICE}) runs 24/7 on Quicksilver infrastructure. Live terminal at quicksilveralgo.com — subscribe at ${EDGE_RADAR_CHECKOUT_URL}.`,
      ],
      listItems: [
        "18-sport filter (NFL, NBA, MLB, NHL, NCAA, UFC, and more)",
        "LINE LAG alerts when DK/FD diverge",
        "News impact feed with 1–100 scores",
        "SportsGameOdds integration for real prop line data",
        "30-second client refresh",
      ],
    },
    {
      heading: "Bankroll & Risk Rules",
      level: 2,
      paragraphs: [
        "No scanner guarantees profit. Cap prop exposure at 1–2% per play. Tier 1 news gets full size; Tier 2 gets half. Never chase stale lines after 10+ minutes — convergence risk dominates.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the best player prop betting strategy?",
      answer:
        "React to injury news faster than sportsbooks reprice. Cross-compare DraftKings and FanDuel, bet stale lines on high-correlation props, and automate scanning with Edge Radar.",
    },
    {
      question: "How much does Edge Radar cost?",
      answer: `Edge Radar is ${EDGE_RADAR_PRICE}. Subscribe via Stripe for instant access to the live hosted terminal. Cancel anytime.`,
    },
    {
      question: "Which sportsbooks does Edge Radar scan?",
      answer:
        "DraftKings, FanDuel, BetMGM, and cross-book line lag detection. Focus is US-regulated player prop markets.",
    },
    {
      question: "Is player prop betting profitable?",
      answer:
        "Edges exist in latency windows but shrink as books improve. Sustainable profit requires discipline, bankroll management, and speed — Edge Radar provides the speed layer.",
    },
    {
      question: "How is Edge Radar different from odds comparison sites?",
      answer:
        "Comparison sites show static lines. Edge Radar combines live injury news, impact scoring, and line lag alerts — built for action speed, not research browsing.",
    },
  ],
};