# Block unwanted crawlers

Your site currently has one simple crawler rules file: everyone allowed, the private dashboard kept out, and the sitemap listed. This adds explicit blocks for the crawlers that take content without sending visitors, while keeping the ones that actually bring people to the site.

## What gets blocked

- Automated-action bots that browse and act on pages rather than just read them: Grokbot, GrokAgent, OpenAI Operator, ChatGPT-User agent traffic, Claude-User agent traffic, Perplexity-User, Browserbase, Bytespider agent modes, and similar agentic browsers. Ordinary AI training and content crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot, Applebot-Extended, PerplexityBot and the like) stay allowed.
- All X / xAI / SpaceX crawlers beyond the single one needed for link previews and API use: Twitterbot stays allowed so shared links render; xAI, Grok, X-Bot, and SpaceX-operated crawlers are blocked.

- Aggressive SEO and backlink scrapers: AhrefsBot, SemrushBot, MJ12bot, DotBot, BLEXBot, DataForSeoBot, rogerbot, Screaming Frog, SEOkicks, serpstatbot, Barkrowler, ZoominfoBot.
- The private dashboard stays disallowed for everyone.

## What stays allowed

- Google, Bing, DuckDuckGo, Yandex, Apple, and other real search engines — these are how people find you.
- Social link previews: Twitterbot, facebookexternalhit, LinkedInBot, Slackbot, Discordbot, WhatsApp, Telegram — needed so shared links show a proper preview card.
- AI answer engines that cite and link back (OAI-SearchBot, ChatGPT-User, Perplexity-User) are kept allowed, so your app can still show up as a cited source, while their training crawlers are blocked.

## Worth knowing

Crawler rules are voluntary. Well-behaved companies honor them; genuinely malicious bots ignore any rules file entirely, so this reduces scraping and server load but is not a security control. Blocking a crawler also removes your pages from anything that crawler powers.

## Technical notes

Rewrite `public/robots.txt` with one `User-agent` block per blocked crawler followed by `Disallow: /`, keeping the existing `User-agent: *` block (Allow `/`, Disallow `/app`) and the `Sitemap:` line at the end. No other files change; verify the file serves correctly in the preview afterwards.
