---
title: "Changelog — Crosspost"
description: "Update history for Crosspost: service status, new features, and notes on what changed and why."
canonical: "https://tweet.mikedemo.dev/changelog"
last-updated: "2026-10-03"
---

# Changelog

What changed in Crosspost, newest first, with notes on why.

## 2026-09-26 — Agent card and agent policy (New)

- A machine-readable agent card now lives at /.well-known/agent.json, linking the docs, terms, privacy and sitemap.
- llms.txt and robots.txt now state the policy plainly: reading and indexing are welcome, and there is no public API.

## 2026-09-09 — Security page (New)

- A new Security guide explains what is stored, how keys are encrypted, who can use them, and how to delete them.
- A short summary of the same now sits on the home page, and the guide links to Lovable's own security documentation.

## 2026-09-07 — Documentation pages (New)

- Four guides were published: Setup, Posting, Tokens & keys, and Troubleshooting.
- They are linked from the Resources section of the menu and cross-link to each other.

## 2026-09-07 — Faster pages and a few polish items (Improved)

- Light or dark now follows your device by default, and the logo's arrows switch to white in dark mode.
- The footer carries switches for appearance and the design system's server-rendered mode.
- Pages load ahead of time when you open the menu, so moving between pages is near-instant.
- Added a keyboard 'Skip to content' shortcut and a proper page for addresses that don't exist.
- Signing in with Google now completes correctly instead of returning to the home page.

## 2026-09-07 — tweet.app now needs your own connection (Status)

- tweet.app changed its API so it no longer answers public requests — reading your posts now requires a signed-in token.
- Setup step 1 is new: paste your own tweet.app access token, with a guide for finding it and a Test connection button.
- Your token is stored encrypted and never sent back to your browser; clearing it stops all reading immediately.
- Errors now read in plain language, and automatic posting pauses instead of retrying every hour when a connection is broken.

## 2026-09-05 — New logo, social cards and app icons (Improved)

- The Crosspost mark — the repeat arrows around a bird — now appears in the header, browser tab, and installed app icons.
- Shared links show a proper preview image.

## 2026-09-04 — Menu, terms and privacy pages (New)

- A menu was added with sign in, register and every public page.
- Terms of Service and Privacy Policy pages were published, along with the independence disclaimer in the footer.

## 2026-09-03 — One set of X keys with a mode you choose (Improved)

- Crosspost now keeps a single set of X developer keys and lets you say whether they came from Development, Staging or Production.
- Detailed key guidance moved into a collapsible section, with a recommendation to test in Development first.

## 2026-09-02 — Security hardening (Fixed)

- Stored X keys are unreachable from any browser — only trusted server code can use them.
- Dependency updates closed known vulnerabilities, and the two-factor code entry no longer blocks the sixth digit.
