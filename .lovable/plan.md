## Goal
Production-ready offline download system for movies, series, and anime files hosted in Lovable Cloud Storage, with a modern Downloads Manager UI.

## Phase 1 — Stabilize (required before feature work)
1. Generate proper DB schema (Phase 2 migration) so types regenerate and ~60 TS errors in `admin.functions.ts`, `tracker.functions.ts`, `feature-flags.ts`, `AdminPanel.tsx`, `MatchChat.tsx` resolve.
2. Fix runtime crash in `tracker.functions.ts:31` (null `id` on insert) — guard with `.maybeSingle()` + early return.

## Phase 2 — Backend (Lovable Cloud)
**Storage bucket:** `downloads` (private, signed URLs only, 5GB file limit).
**Tables:**
- `downloadable_titles` — admin-uploaded catalogue: `id, kind (movie|tv|anime), tmdb_id, title, season, episode, storage_path, size_bytes, mime, poster_url, created_at`. Public read.
- `user_downloads` — per-user record: `user_id, title_id, status, started_at, completed_at`. RLS: own rows only. Used to prevent duplicates across devices and surface "previously downloaded".
- Also fixes: `feature_flags`, `featured_events`, `visitor_sessions`, `match_chats` (the tables existing code already references).

**Server functions:**
- `getSignedDownloadUrl(titleId)` — auth-required, returns a 1-hour signed URL to the storage object.
- `listDownloadableTitles(kind?, tmdbId?)` — public catalogue lookup, used by Title page to decide if a Download button shows.
- `recordUserDownload`, `markDownloadComplete`, `removeUserDownload`.

**Admin upload:** extend AdminPanel with an "Upload video" form (file picker → storage upload → `downloadable_titles` insert) so you have a path to add content. Source: you supply the MP4s (legal way to "find" files).

## Phase 3 — Web / PWA Download Engine
`src/lib/downloads/` module:
- **Storage:** IndexedDB (videos as Blobs in object store `files`, metadata in `meta`). One DB, versioned.
- **Engine:** `fetch()` with HTTP `Range` requests in 4MB chunks → append to Blob. Enables pause / resume / retry / cancel and survives tab reloads (resume from last byte offset stored in metadata).
- **Queue:** max 2 concurrent, FIFO, persisted.
- **Progress:** EventTarget emitting `{ id, loaded, total, speedBps, etaSec, status }`. Speed = EWMA over last 5s.
- **Quota check:** `navigator.storage.estimate()` before enqueue; warn if file > free quota; request `navigator.storage.persist()` so OS doesn't evict.
- **Duplicate prevention:** check IndexedDB `meta` + `user_downloads` table.
- **Network resilience:** `online`/`offline` listeners auto-pause and auto-resume; exponential backoff on fetch errors (3 retries → "Retry" button).
- **Playback offline:** `URL.createObjectURL(blob)` fed into existing `HlsPlayer`/`<video>`.

## Phase 4 — Native (Android + iOS via Capacitor)
- Add `@capacitor/core`, `@capacitor/filesystem`, `@capacitor/network`, `capacitor.config.ts` (don't run native build here — that requires a local Android Studio / Xcode).
- `downloads/native-adapter.ts`: when `Capacitor.isNativePlatform()`, write chunks via `Filesystem.appendFile` into `Directory.Data` (private app storage, not user-deletable Downloads folder, so files stay tied to the app). Offline playback uses `Capacitor.convertFileSrc(path)`.
- README section explaining how to run `npx cap add android && npx cap sync` after exporting to GitHub.

## Phase 5 — UI
- **`DownloadsTab.tsx`** (new tab next to Library): grouped by status (Downloading / Paused / Completed / Failed), per-item card with poster, title, progress bar, speed, ETA, size, action buttons (pause/resume/retry/cancel/delete/play).
- **Storage meter** at top: used / available / quota, with "Free up space".
- **`useDownload(titleId)` hook** for buttons; **Download button** added to `TitleDetails` (only when title is in `downloadable_titles`).
- Toast notifications on complete / fail via existing sonner.
- Add `/downloads` route + nav entry.

## Phase 6 — PWA polish
Manifest already exists. Add `navigator.storage.persist()` request on first download. No service worker for offline (kept out per PWA guidance — IndexedDB blobs are enough).

## Technical notes
- All Supabase storage URLs are signed and short-lived; tokens never sit in IndexedDB.
- Downloads stream chunk-by-chunk so a 4GB movie never lives twice in RAM.
- Cancelling deletes the partial blob + meta row immediately.
- "Find a way" for catalogue: only files YOU upload to the bucket can be downloaded. The streaming catalogue (TMDB/iframes) stays as-is for online viewing; downloadable items are a curated subset surfaced via `downloadable_titles`.

## Out of scope
- DRM (Widevine/FairPlay) — not possible without studio licensing.
- Saving to the user-visible system Downloads folder on iOS (Apple sandbox forbids it).
- Building/signing the native APK/IPA (requires your machine).

## File map (new)
- `supabase/migrations/<ts>_downloads_and_tracking.sql`
- `src/lib/downloads/{engine.ts,db.ts,types.ts,native-adapter.ts,index.ts}`
- `src/lib/downloads.functions.ts`
- `src/hooks/useDownload.ts`, `src/hooks/useDownloadsList.ts`
- `src/components/DownloadsTab.tsx`, `src/components/DownloadButton.tsx`, `src/components/StorageMeter.tsx`
- `src/routes/downloads.tsx`
- `src/components/admin/UploadVideoForm.tsx` (added inside AdminPanel)
- `capacitor.config.ts` + README section
