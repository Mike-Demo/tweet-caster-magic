---
title: "Posting — Crosspost docs"
description: "How Crosspost turns tweet.app posts into posts on X: automatic or review-first, replies and quotes, long posts, the waiting queue, and history."
canonical: "https://tweet.mikedemo.dev/docs/posting"
last-updated: "2026-10-03"
---

# Posting

What Crosspost sends to X, when it sends it, and how to stay in control of the result.

## The cycle

1. Crosspost checks the watched tweet.app account on a regular schedule.
2. Anything published after you connected, and not seen before, becomes an item.
3. With automatic posting on, the item goes straight to X. With it off, the item waits in **Waiting** until you approve or dismiss it.
4. Every attempt lands in **History** with its result.

Each post is remembered, so a post is never sent to X twice — even if a check runs again or a connection is repaired later.

## Automatic or review first

Review-first is the default and the safer starting point: nothing reaches X until you press approve. Switch on **Post to X automatically** once a few approvals have looked right. You can turn it back off at any moment; items already sent are not recalled.

## What gets skipped

- **Replies** — skipped by default. A reply usually makes no sense outside the thread it belongs to.
- **Quotes** — sent by default. Turn them off if the quoted post will not exist on X.
- **Long posts** — tweet.app allows more characters than X. Choose *Shorten them to fit* to trim the text, or *Leave them out* to skip anything too long rather than publish a cut-off version.

Text only, for now. Images, videos and threads are not carried across, and posts are not edited or deleted on X when they change on tweet.app.

## Waiting and History

**Waiting** shows every item held for approval, with the text exactly as it would be published. **History** keeps the record: what was sent, what was skipped and why, and what failed. If posting stops unexpectedly, History is the first place to look, then the [troubleshooting guide](https://tweet.mikedemo.dev/docs/troubleshooting).

## Your responsibilities

Posts published through Crosspost are published by you, with your own X app. Automated posting is subject to the [X Developer Terms](https://docs.x.com/developer-terms), the [X Terms of Service](https://x.com/en/tos) and the [tweet.app Terms of Service](https://tweet.app/terms-of-service/), including their rules on duplicate and automated content.
