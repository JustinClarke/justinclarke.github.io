/**
 * Funny tooltip messages for portfolio
 * Mix of technical humor, self-deprecation, and industry in-jokes
 */

export const TOOLTIPS = {
  // Career/Timeline
  vns: "Where I learned that 'we'll automate that next quarter' actually happened",
  litestorework: "Where I learned that 'lightweight' is a state of mind",
  drop: "My first rodeo with agile chaos",
  mba: "Proof that data scientists can do business too",
  msc: "I survived the thesis. Did you?",
  btech: "Where it all began (algorithms, regret, coffee)",
  graduationcap: "Proof that I can read papers AND commit code",

  // Skills/Tech
  powerbi: "Making dashboards that executives pretend to understand",
  fabric: "Microsoft's answer to 'but can it do warehousing?'",
  sql: "The only language that lets you speak fluently to databases",
  python: "For when SQL isn't slow enough",
  dbt: "Making bad data transformations at scale",
  snowflake: "Data warehouse that costs $5 per snowflake",
  bigquery: "Google's way of saying 'just use our cloud'",
  typescript: "JavaScript with training wheels and a philosophy degree",
  react: "Building SPAs since we forgot how to do server-side rendering",
  nextjs: "React with training wheels, but make it full-stack",
  tailwind: "CSS so abstracted it feels like cheating",
  ga4: "Google Analytics v4: Because we needed MORE complexity",
  vercel: "Where serverless dreams come true (and crash at scale)",
  mysql: "The reliable workhorse of the database world",
  olap: "Online Analytical Processing: the 'big brain' table layout",
  datamodeling: "Making data look respectable through strategic relationships",
  'scikit-learn': "The 'ML-lite' framework for people who don't want PhD-level pain",
  vectormodeling: "Turning words and songs into squiggly math",
  'gemini-api': "Google's LLM that occasionally hallucinates less than Geminis",
  firestore: "NoSQL database that scales automatically (until it doesn't)",
  wacc: "Weighted Average Cost of Capital: make finance nerds sound smart",
  excel: "The spreadsheet that conquered the world through stubbornness",
  dcf: "Discounted Cash Flow: guessing the future with a spreadsheet",
  'sensitivity-analysis': "What if we're all wrong? Let's run it 100 times.",

  // Project names/descriptions
  sqlDisaster: "A tale of truncation, tears, and terminal velocity",
  litestore: "Lightweight ≠ lightweight on my anxiety",
  spotifyEngine: "Why predicting music taste is harder than rocket science",
  hrArchetype: "Figuring out if you're a 'person' or a 'problem'",
  capital: "Making machines weigh ethical concerns (they don't)",

  // UI Elements
  scrolldown: "Scroll, you coward. There's more content below.",
  contactme: "Yes, I'm actually here. Email address and everything.",
  github: "Where I pretend I know what I'm doing",
  linkedin: "LinkedIn: Because GitHub doesn't pay the bills",
  viewcode: "Warning: Contains code written at 11 PM",
  livedemo: "Pray it doesn't crash in production",
  archive: "The vault of my past mistakes, curated for your amusement",

  // General wisdom
  loading: "Processing your request... (spinning wheel of death)",
  error: "Something went wrong. Let's blame it on Mercury retrograde.",
  success: "You did it! No take-backsies now.",
  analytics: "Measuring things so executives can ignore the data",
  architecture: "Boxes within boxes within diagrams",

  // Easter eggs
  easter: "You found it! Have a cookie 🍪",
  secret: "This is as secret as my browser history",
} as const;

export type TooltipKey = keyof typeof TOOLTIPS;
