---
type: reference
title: "DeArrow oriz-fork — exact files and lines we touched"
description: "Audit-friendly list of every divergence from upstream ajayyy/DeArrow. Use this to verify the fork is minimum-diff and to predict merge conflicts."
tags: [fork, dearrow, divergence, audit]
timestamp: 2026-06-24
format_version: okf-v0.1
status: active
related:
  - index
  - rebase
---

# Divergence from upstream

Upstream: `ajayyy/DeArrow@master` as of the fork base SHA.
Fork: `chirag127/DeArrow@master`.

## File 1: `src/config/config.ts`

**Why**: register the new config flag in the `SBConfig` interface + defaults.

```diff
   hideDetailsWhileFetching: boolean;
+  showOriginalAlongsideTitle: boolean; // oriz-fork
   firstThumbnailSubmitted: boolean;
```

and:

```diff
   hideDetailsWhileFetching: true,
+  showOriginalAlongsideTitle: true, // oriz-fork: default ON
   firstThumbnailSubmitted: false,
```

**Conflict risk**: low. Both insertions are adjacent to `hideDetailsWhileFetching` lines. Conflict only if upstream renames or removes `hideDetailsWhileFetching`.

## File 2: `src/titles/titleRenderer.ts`

**Why**: actually display the original title alongside the API title when the new flag is on.

Approximate area (line 95–100 in fork; will drift with upstream):

```diff
   if (onMobile()) {
       hideOriginalTitle(element, brandingLocation);
   }
   
-  setCustomTitle(formattedTitle, element, brandingLocation);
+  // oriz-fork: optionally append original YouTube title in parentheses
+  const displayTitle = Config.config!.showOriginalAlongsideTitle && originalTitle
+      ? `${formattedTitle} (original: ${originalTitle})`
+      : formattedTitle;
+  setCustomTitle(displayTitle, element, brandingLocation);
   countTitleReplacement(videoID);
```

**Conflict risk**: medium. This is the hot path of DeArrow's main feature. If upstream refactors the surrounding async logic, this insertion may conflict. The `// oriz-fork:` comment makes the patch easy to identify during rebase.

**Variable `originalTitle` is already in scope** (declared at line 78 of the same file in upstream). If upstream renames or removes `originalTitle`, our patch breaks but it'd be obvious because TypeScript won't compile.

## File 3: `public/options/options.html`

**Why**: expose the new flag in the options UI as a checkbox.

Inserted ~16 lines AFTER the `hideDetailsWhileFetching` toggle block, BEFORE the `ignoreTranslatedTitles` toggle block:

```diff
       <div class="small-description">__MSG_hideDetailsWhileFetchingDescription__</div>
   </div>

+  <!-- oriz-fork: show original alongside replaced title -->
+  <div data-type="toggle" data-sync="showOriginalAlongsideTitle">
+      <div class="sb-switch-container">
+          <label class="sb-switch">
+              <input id="showOriginalAlongsideTitle" type="checkbox" checked>
+              <span class="sb-slider sb-round"></span>
+          </label>
+          <label class="sb-switch-label" for="showOriginalAlongsideTitle">
+              Show original title alongside replacement
+          </label>
+      </div>
+
+      <div class="small-description">Append the original YouTube title in parentheses after the DeArrow-replaced title (oriz fork).</div>
+  </div>

   <div data-type="toggle" data-sync="ignoreTranslatedTitles">
```

**Conflict risk**: low. New block inserted between two existing toggle blocks — neither neighbor is modified.

## What we did NOT touch

- `manifest/` (extension manifest unchanged)
- `package.json` / `package-lock.json` (no new deps)
- `_locales/` (no new translation strings — toggle label is inline English)
- Any test under `test/` (no new tests yet — open follow-up)
- The fork's `LICENSE` (stays GPL-3.0)
- Internal submodules (`public/_locales`, `maze-utils`) — both still point at upstream `ajayyy/*`

## Rebase target

Pin to `upstream/master` HEAD or a specific tag. There is no released oriz-fork tag yet; main branch carries the divergence.
