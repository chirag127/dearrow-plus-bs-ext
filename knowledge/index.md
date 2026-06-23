---
type: index
title: "DeArrow oriz-fork — what we changed and why"
description: "One-feature fork: show the original YouTube title in parentheses after the DeArrow-replaced title. Togglable via a new options setting (default ON). Minimum-diff: 3 files, ~15 lines added."
tags: [fork, dearrow, browser-extension, title-display]
timestamp: 2026-06-24
format_version: okf-v0.1
status: active
related:
  - divergence
  - rebase
---

# DeArrow oriz-fork

## Why

DeArrow replaces YouTube video titles with crowdsourced cleaner alternatives. That's the whole point of the extension. But you sometimes want to know what the original title WAS — for context, for searching, for verifying the DeArrow title isn't editorializing too hard.

This fork adds an option to display the original alongside the replacement:

```
Better Title For The Video (original: 10 SHOCKING Things You WON'T BELIEVE!!!)
```

## What

One new setting `showOriginalAlongsideTitle` (default ON) on the options page. When ON, and DeArrow has a replacement title to show, the rendered title is `${apiTitle} (original: ${originalTitle})` instead of just `${apiTitle}`.

When OFF, behavior is identical to upstream DeArrow.

## API impact

**Zero extra API calls.** DeArrow's `replaceTitle` function already has the original YouTube title in scope (`const originalTitle = getOriginalTitleText(originalTitleElement, brandingLocation).trim();` — line 78 of `src/titles/titleRenderer.ts`). We reuse that variable.

## Files touched

3 files, ~15 lines added (no deletions of upstream lines):

1. `src/config/config.ts` — added `showOriginalAlongsideTitle: boolean` to the `SBConfig` interface (1 line) + `true` to the defaults (1 line).
2. `src/titles/titleRenderer.ts` — wrapped the `setCustomTitle(formattedTitle, ...)` call with the optional concatenation (5 lines).
3. `public/options/options.html` — added a new toggle block right after the `hideDetailsWhileFetching` toggle (~16 lines).

See [`divergence.md`](./divergence.md) for the exact diff context.

## Minimum-diff discipline

Per `[[fork-discipline]]`, every change minimizes the chance of merge conflicts when upstream evolves:

- All added lines are **adjacent** to existing related lines (so upstream changes in distant parts of the file don't conflict).
- All added lines are marked with `// oriz-fork:` or `<!-- oriz-fork: -->` comments so they're trivial to identify when resolving conflicts.
- No upstream code lines were **modified** — only **inserted**. The original `setCustomTitle(formattedTitle, ...)` call was replaced with `setCustomTitle(displayTitle, ...)` where `displayTitle` is a new local variable; if upstream later changes the call site, the conflict is small.
- No i18n strings added — toggle label is inline English. When/if upstream's translations submodule supports oriz strings, migrate then.

## How to rebase

See [`rebase.md`](./rebase.md).
