---
type: runbook
title: "DeArrow oriz-fork — pull upstream updates"
description: "Step-by-step: add ajayyy/DeArrow as upstream remote, fetch + rebase, resolve conflicts in the 3 patched files, push to chirag127/DeArrow."
tags: [fork, dearrow, rebase, runbook]
timestamp: 2026-06-24
format_version: okf-v0.1
status: active
related:
  - index
  - divergence
---

# Rebase oriz-fork onto upstream/master

Run from `projects/c127/forks/prod/bs-ext/DeArrow/` inside the workspace clone.

## One-time setup

```bash
cd projects/c127/forks/prod/bs-ext/DeArrow
git remote add upstream https://github.com/ajayyy/DeArrow.git
```

## Periodic rebase

```bash
git fetch upstream
# Optionally check what's new
git log --oneline master..upstream/master | head -20

# Rebase our fork on top of upstream
git checkout master
git rebase upstream/master
```

## Expected conflict surface

Per [`divergence.md`](./divergence.md), conflicts will arise ONLY in these 3 files:

| File | Conflict likelihood | Resolution hint |
|---|---|---|
| `src/config/config.ts` | low | Lines insert near `hideDetailsWhileFetching`. If upstream renamed it, re-anchor near a new sibling boolean. |
| `src/titles/titleRenderer.ts` | medium | The hot path. If upstream changed the `setCustomTitle(formattedTitle, ...)` line or the surrounding async branch, port the `oriz-fork:` block to wrap the new equivalent. |
| `public/options/options.html` | low | New toggle block sits between two existing ones — re-insert in the same relative position if upstream reordered. |

All oriz changes are marked with `// oriz-fork:` (.ts) or `<!-- oriz-fork: -->` (.html) — `git grep oriz-fork` finds every divergence point.

## After rebase

```bash
# Verify our 3 changes are still applied
git grep oriz-fork
# Should return ~5 hits across 3 files

# Build + test
npm install
npm run build
# Smoke-test by loading the unpacked extension and visiting a YouTube video

# Push to chirag127/DeArrow
git push origin master --force-with-lease
```

## Bumping the workspace pointer

After the fork is updated, bump the submodule pointer in the umbrella:

```bash
cd c:/D/oriz
cd projects/c127/forks/prod/bs-ext/DeArrow && SHA=$(git rev-parse HEAD) && cd -
git add projects/c127/forks/prod/bs-ext/DeArrow
git commit -m "chore(forks): bump DeArrow to ${SHA:0:7} after upstream rebase"
```
