# LinkedIn Launch — Market Research

Research and strategy notes for posting the portfolio (justinclarke.github.io) on LinkedIn, gathered June 2026.

---

## Context

Portfolio is finished and deployed. Remaining step before outreach push: post it on LinkedIn. Plan is a Premiere Pro–edited screen-capture video showcasing the interactive pieces (terminal, AI agent replies, smooth scrolling, F1 telemetry widget) rather than static screenshots.

Core tension going in: reach vs. conversion. A post optimized purely for algorithmic reach (carousels, engagement bait, broad hooks) isn't the same post that gets the right 10–20 people — Toshan Wickramanayake, the VCARB/Pirelli threads, recruiters like Arlene and Taha — to actually click through and register what was built. Conclusion: these aren't fully opposed, video resolves a lot of the tension, but the targeting question still determines what "success" means for this post.

---

## What the goal actually is

For this specific situation, a post doesn't need to go viral. Its job is one of three things:

1. Get seen by the specific people who could move the job search forward.
2. Get found later when someone searches the name before/during an interview process.
3. Be a concrete artifact to attach when reaching out directly.

20 likes can fully satisfy all three. Reach and outcome are not the same metric here — comparing follower count (900) to accounts that "blew up" is comparing against the wrong baseline, since those accounts were optimizing for a different goal entirely.

The post should be paired with direct outreach (DMs to 5–10 people who actually matter), not left to do all the work alone. The post becomes the artifact; the DM is the actual outreach mechanism.

---

## LinkedIn Algorithm — 2026 findings

Sourced from multiple independent 2026 algorithm guides (dsmn8, growleads.io, Visla, dataslayer.ai, designACE, thinklikeapublisher, tryordinal, resumevera). One source (dsmn8) is a partial outlier on video performance; otherwise findings converge.

### Native video has a real distribution edge
The 2026 algorithm prioritizes native video, dwell time, and educational content over promotional posts and anything with an external link. Video drives up to 5x higher interaction rates than text posts for awareness-stage content. Optimal length: **30–90 seconds for discovery**; longer (2–5 min) only works for audiences who already know you.

→ Validates the screen-capture video plan. Keep it tight, under 90 seconds.

### External links get penalized — hard
Posts with external links see up to 30% less organic reach, since the algorithm deprioritizes anything pulling users off-platform. One source frames the on-platform-time weighting as a 60% distribution penalty for off-platform redirects.

→ **Do not put the portfolio URL in the post body.** Put it in the first comment, or say "link in comments."

### The first 60–90 minutes decide everything after
The algorithm reads early engagement to learn who the content is for (job titles, industries, seniority) and decides distribution based on that signal. Posts with sustained engagement get continued distribution for 48–72 hours; everything else gets suppressed regardless of initial numbers.

→ Line up a small group of people to engage **within the first hour** of posting, not whenever they happen to see it.

### Comments outweigh likes, but only if they're substantive
The algorithm explicitly rewards real discussion (e.g., "12 real comments, 200+ likes") and penalizes shallow reactions or no discussion. A specific question lands better than a generic "nice work."

→ When priming people to engage, ask them to comment something specific (a real question about the causal decomposition approach, the architecture, etc.), not just react.

### Authenticity signals outperform polish
A post with a real face on camera outperforms a purely templated graphic; the algorithm has gotten better at detecting content that feels artificial or AI-generated.

→ Consider opening the video with a few seconds of you on camera before cutting to the screen capture, rather than pure screen-recording throughout.

### Document/carousel posts are a contested counter-signal
One source claims document posts (PDF carousels) hit ~6.6% engagement, the highest of any format, well above plain video or text. This is a real tension in the data — but a carousel can't demonstrate motion or interactivity, which is the actual selling point here (AI replying live, scroll-driven reveals, the telemetry widget animating). Video is the right call specifically because of what's being shown, not despite the carousel benchmark.

### Broad reach is structurally harder now; narrow targeting is not a workaround, it's aligned with the platform
Overall LinkedIn engagement is down industry-wide (one source: views down 50%, engagement down 25% YoY), and the platform is explicitly getting better at narrowing distribution to relevant cohorts rather than rewarding generic broad content. A niche, specific post aimed at a small relevant audience isn't fighting the algorithm — in 2026 that's what the algorithm is built to reward.

---

## Action items derived from this research

- [ ] Keep video to 30–90 seconds; open with a few seconds on-camera before the screen capture
- [ ] No portfolio link in the post body — link goes in the first comment
- [ ] Identify 5–10 people (Toshan, warm contacts from VCARB/Pirelli/Siemens threads, friends who'd genuinely engage) and message them *before* posting, asking them to comment with something substantive in the first hour
- [ ] Write hook-first opening line (first 2 lines before "see more" matter disproportionately)
- [ ] Add on-screen captions for muted viewers, highlighting causal inference / built solo / live AI agent — not just "dashboards"
- [ ] Generate/refresh the LinkedIn banner via the site's `/linkedin-banner` route to match the post's visual language
- [ ] Verify Umami analytics is firing correctly in prod *before* posting, since this is the highest-traffic moment to date and the richest source of signal on what people actually click
- [ ] Fix the two outstanding repo issues (README model count, stale "missing frontend" line in limitations) before driving traffic to the repo

---

## Open question

Post copy and Premiere shot list/caption sequence still need drafting — next step once the above is locked in.
