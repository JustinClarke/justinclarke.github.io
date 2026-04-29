/**
 * Tooltip copy. Dry, professional, occasionally cheeky.
 * Calibrated for UK / UAE readers. Understated humour, no slapstick.
 */

export const TOOLTIPS = {
  // ── Career / Timeline ─────────────────────────────────
  vns: "Where 'we'll automate it next quarter' actually became a quarter.",
  litestorework: "Sole engineer on a SaaS, through two degrees. Sleep optional.",
  drop: "First taste of standup at 9am sharp. Survived. Mostly.",
  mba: "Where engineers learn to speak boardroom.",
  msc: "Distinction, against the better judgement of my sleep schedule.",
  btech: "Algorithms, all-nighters, and the occasional revelation.",
  graduationcap: "Papers read, code shipped, coffee by the litre.",

  // ── Stack & tools ─────────────────────────────────────
  powerbi: "Dashboards that survive the boardroom.",
  microsoftfabric: "Microsoft's everything-warehouse. Yes, even the kitchen sink.",
  sql: "Fluent in databases. Less so in small talk.",
  python: "The Swiss Army knife of analytics. Mostly the screwdriver bit.",
  dbt: "Transformations with version control. Revolutionary, apparently.",
  snowflake: "A warehouse with a meter on the door.",
  bigquery: "Petabytes by lunch. The bill arrives by tea.",
  typescript: "JavaScript, with adult supervision.",
  react: "The framework that came back round to server rendering.",
  nextjs: "React, but with the back end attached.",
  tailwind: "Utility-first CSS. Feels like cheating until the bundle ships.",
  ga4: "Google Analytics, redesigned by people who enjoy a challenge.",
  vercel: "Deploys in seconds. Bills in dollars.",
  mysql: "The reliable cousin who turns up to every wedding.",
  olap: "The grown-up way to slice numbers.",
  datamodeling: "Drawing rectangles for a living. With great seriousness.",
  scikitlearn: "Machine learning for people with deadlines.",
  vectormodeling: "Where meaning becomes maths.",
  geminiai: "Google's LLM. Confident about most things. Sometimes correctly.",
  firestore: "Scales beautifully. Until the invoice arrives.",
  wacc: "The number that makes finance decks look serious.",
  excel: "The original database. Still undefeated.",
  dcf: "A confident guess at the future, with footnotes.",
  sensitivityanalysis: "Asking 'but what if?' a thousand times, politely.",
  aws: "Amazon's everything-shop, but for servers.",
  azure: "Microsoft's cloud, slightly more enterprise-flavoured.",
  ml: "Machine learning. Sometimes machine, sometimes learning.",
  strategy: "Where the slides outnumber the answers, but the answers matter most.",
  research: "Where 'further work needed' lives, in perpetuity.",
  analytics: "Numbers, made comprehensible to humans.",
  algorithms: "Big-O notation. Bigger headaches.",
  maths: "The cause of, and solution to, most analytics problems.",
  cc: "C and C++. Where I learned to respect memory.",

  // ── Projects ──────────────────────────────────────────
  sqlDisaster: "What happens when production meets a confident DROP statement.",
  litestore: "Lightweight by name. Three in the morning, by nature.",
  spotifyEngine: "Turns out taste is harder to model than physics.",
  hrArchetype: "Personality, classified by an LLM. Mostly tactfully.",
  capital: "A 581-million dirham question, answered in a spreadsheet.",

  // ── Navigation / UI ───────────────────────────────────
  scrolldown: "There's a fair bit more, if you can be bothered.",
  contactme: "Yes, the email actually works.",
  github: "Where the receipts live.",
  linkedin: "The professional one. Allegedly.",
  instagram: "Mostly café signage and questionable lighting.",
  email: "Replies usually arrive faster than you'd think.",
  viewcode: "Code, in its natural habitat.",
  livedemo: "Live, against my better judgement.",
  archive: "The long version. Bring a cuppa.",
  resume: "PDF, because that's what recruiters insist on.",
  record: "The full timeline. Dates and everything.",
  timeline: "The full career and academic timeline.",
  everythingelse: "Marginalia and after-hours projects. Essays, beliefs, and hobbies.",
  expertise: "What I'm actually any good at.",
  projects: "The one I'd talk about in an interview.",
  shipping: "Currently shipping. Touch wood.",
  getintouch: "Reply guaranteed. Within the working week.",
  stepback: "Back the way you came. No harm done.",
  accessallprojects: "Including the ones that didn't quite land.",
  sourcemanifest: "Yes, the site itself is open source. Read at your peril.",
  jclogo: "It's a J and a C. Groundbreaking, I know.",
  livestatus: "Online. Coffee in hand.",
  notfoundbadge: "404. The page took the day off.",

  // ── General ───────────────────────────────────────────
  loading: "Working on it. Promise.",
  error: "Something gave way. Blame the architecture, not the engineer.",
  success: "Right then. That worked.",
  architecture: "Rectangles, with intent.",

  // ── Easter eggs ───────────────────────────────────────
  easter: "Nicely spotted. Have a digestive.",
  secret: "About as secret as your Slack DMs.",
} as const;

export type TooltipKey = keyof typeof TOOLTIPS;

/**
 * Normalise a label ("Microsoft Fabric", "Next.js", "C/C++") to a TOOLTIPS key.
 * Strips everything that isn't a-z or 0-9, lowercases.
 */
export const tooltipKey = (label: string): string =>
  label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, '');

export const getTooltip = (label: string): string | undefined =>
  TOOLTIPS[tooltipKey(label) as keyof typeof TOOLTIPS];
