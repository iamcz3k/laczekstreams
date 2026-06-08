## What to change

### 1. Metadata cleanup (tiny)
The site title/branding is already "LACZEK STREAM" everywhere. Only stray "Lovable" reference is `twitter:site: "@Lovable"` in `src/routes/__root.tsx` — change it to `@laczekstream`. No favicon changes (keeping existing icons as requested).

### 2. Announcement images (admin uploads + URL)

**DB migration** — add columns to `admin_changelog`:
- `image_url TEXT` — public URL of the preview pic (nullable)
- `image_path TEXT` — storage path for uploaded files (nullable, so we can delete from storage on row delete)

**Storage** — create a new public bucket `changelog-images` with admin-only write policy (signed via existing `czek2991` admin password through a server function — same pattern as existing admin storage signing route).

**Server functions** (`src/lib/changelog-admin.functions.ts`):
- Extend `adminCreateChangelog` to accept optional `image_url` + `image_path`.
- Add `adminSignChangelogUpload` returning a signed upload URL for the bucket (reuse pattern from `api.public.admin-storage-sign.ts`).
- Extend `listChangelog` to return `image_url`.

**Admin UI** (`src/components/AdminPanel.tsx` ChangelogPanel):
- New "Image" row in the compose form with two tabs: "Upload" (file picker → signed upload → store path+public URL) and "Paste URL" (plain input).
- Show thumbnail preview before publish.

**User UI** (`src/components/ChangelogOverlay.tsx`):
- Render `image_url` as a rounded preview image above the title when present, with `loading="lazy"` and a fallback that hides the `<img>` on error.

### 3. Guided tour ("Preview") — full coverage per tab

**New library** `src/lib/tour/`:
- `types.ts` — `TourStep = { target: string (CSS selector or data-tour key); title: string; body: string; placement?: "auto"|"top"|"bottom"|"left"|"right"; action?: "click"|"none"; route?: string }`.
- `tours.ts` — registry keyed by route + global. Tours for: home (`/`) tabs (Movies, TV, Live Sports, YouTube, CCTV, Radio, Podcasts), More menu, Surprise me, Search, Watch page (`/watch/...`: server switch, next episode, fullscreen, download), Downloads, Radio, Podcasts, Live Sports / Match chat, Speedtest, Party, Anime, Library/Genres. Each step uses `[data-tour="key"]` selectors.
- `TourProvider.tsx` — context + overlay component. Highlights the target with a cut-out spotlight (full-screen dark overlay with a transparent rounded rectangle around target rect), shows a tooltip card ("Next button — tap this to go to the next episode…"), Next / Back / Skip controls, auto-scrolls target into view, repositions on resize.
- Auto-advances to the next route when a step has `route` set.

**Wire-up**:
- Mount `<TourProvider />` inside `__root.tsx` (alongside `BroadcastOverlay`).
- Add `data-tour="..."` attributes to the relevant elements (tabs in `Header.tsx`, More menu items, Surprise Me, MediaCard, player controls in `IframePlayer`/`HlsPlayer`/`watch.$kind.$id.tsx`, Downloads buttons, etc.).
- `MoreMenu.tsx` gets a new "Take a tour" item that opens the tour for the current route (or the global home tour).

### 4. No business-logic changes elsewhere — review delivery, 2-hour gate, TV mode etc. all stay as-is.

## Out of scope
- Translating tour copy
- Persisting "tour completed" per user (we'll just remember in `localStorage` so it doesn't auto-replay)
- Mobile-optimised special variant of spotlight (single responsive tooltip is enough)

Ready to build?