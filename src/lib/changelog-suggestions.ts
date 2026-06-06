// Curated catalog of recent features, fixes & improvements shipped on the site.
// The admin sees these as one-tap "publish" suggestions in the Fixes & Features
// panel, so they never have to retype titles for things that already exist.
// Add new entries to the TOP of the list as features ship.

export type ChangelogSuggestion = {
  key: string; // stable id, never reuse
  kind: "new" | "fix" | "improved" | "soon";
  title: string;
  detail: string;
};

export const CHANGELOG_SUGGESTIONS: ChangelogSuggestion[] = [
  {
    key: "tv-mode-2026-06",
    kind: "new",
    title: "Smart TV mode",
    detail:
      "We auto-detect Smart TVs, consoles and big-screen browsers and switch to a TV-friendly layout with bigger text, larger tap targets and a clear focus ring for remotes. You can also force it with ?tv=1.",
  },
  {
    key: "fixes-feed-2026-06",
    kind: "new",
    title: "What's new popup",
    detail:
      "A dismissible popup now shows our latest updates the first time you visit after we ship something. Tap X or 'Got it' to close — you won't see the same update twice.",
  },
  {
    key: "broadcast-system-2026-06",
    kind: "new",
    title: "Live admin notifications",
    detail:
      "Admin can now push site-wide notifications, questions and forced review prompts straight to your screen — with a 5-star rating and a 20-char minimum on reviews.",
  },
  {
    key: "review-targeting-2026-06",
    kind: "new",
    title: "Targeted review requests",
    detail:
      "From the visitor log, admin can send a review prompt to a specific account. People who already left a review won't be asked again.",
  },
  {
    key: "iphone-menu-fix-2026-06",
    kind: "fix",
    title: "iPhone menu now opens fully",
    detail:
      "Fixed the side menu on iPhone Safari — the bottom of the menu was getting cut off behind the browser bar. It now uses the full screen height and respects the safe area.",
  },
  {
    key: "admin-flicker-fix-2026-06",
    kind: "fix",
    title: "No more admin panel flicker",
    detail:
      "The admin panel no longer flashes a loading screen every time it refreshes data in the background.",
  },
  {
    key: "broadcast-age-gate-2026-06",
    kind: "improved",
    title: "Quieter first 2 hours",
    detail:
      "Brand-new accounts won't get review popups for their first 2 hours so people can browse the site in peace before being asked for feedback.",
  },
  {
    key: "changelog-suggestions-2026-06",
    kind: "improved",
    title: "One-tap update publishing",
    detail:
      "Admin panel now auto-lists every feature & fix we've shipped, so publishing an update is a single tap — no retyping.",
  },
];
