---
title: "Setup guide — Crosspost docs"
description: "Step-by-step setup for Crosspost: connect your tweet.app account, choose the account to watch, add your own X developer keys, and pick how posting behaves."
canonical: "https://tweet.mikedemo.dev/docs/setup"
last-updated: "2026-10-03"
---

# Setup

Four steps, all on the Setup tab of your dashboard. Expect about ten minutes the first time, most of it spent in your X developer account.

Crosspost never uses a shared account. You bring your own tweet.app account and your own X developer app, so everything posts as you and stays under your control.

## Before you start

- A Crosspost account — register on the home page and confirm your email.
- A tweet.app account you can sign into in a browser.
- An X developer account with an app set to **Read and Write**. See the [tokens and keys guide](https://tweet.mikedemo.dev/docs/tokens).

## 1. Connect your tweet.app account

tweet.app closed its public API, so Crosspost can only read your posts with a token from your own signed-in session. Paste that token on the Setup tab and press **Save token**. It is encrypted before storage and never sent back to any browser.

1. Sign in at tweet.app in Chrome and open developer tools (F12).
2. Open the **Network** tab, tick **Preserve log**, filter to **Fetch/XHR**, then reload your feed.
3. Click any request to `api.tweet.app/api/…` and, under **Request Headers**, copy the value after `Authorization: Bearer`.
4. Paste it into **tweet.app access token**, save, then press **Test connection**.

Tokens expire. When one does, reading pauses and the dashboard asks you to paste a fresh one — nothing is lost in the meantime.

## 2. Choose the account to watch

Enter the tweet.app username whose posts should be mirrored — usually your own — and press **Connect**. Only posts published after you connect are considered, so connecting never floods X with your back catalogue.

## 3. Add your X developer keys

Crosspost keeps one set of keys: API Key, API Secret, Access Token and Access Token Secret. Tell it which environment those keys came from — Development, Staging or Production — and press **Check and save**. The keys are verified with X before they are stored, so a typo is caught immediately.

Start with Development keys, confirm one real post goes out as expected, then swap in Production. Full details are in the [tokens and keys guide](https://tweet.mikedemo.dev/docs/tokens).

## 4. Decide how it should behave

Leave automatic posting off at first: everything lands in **Waiting** for your approval so you can see exactly what would have gone out. Turn it on once you trust the result. The choices for replies, quotes and long posts are explained in the [posting guide](https://tweet.mikedemo.dev/docs/posting).
