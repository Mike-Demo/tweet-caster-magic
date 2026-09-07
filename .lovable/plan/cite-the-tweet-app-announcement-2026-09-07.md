# Cite the tweet.app announcement

Point people at the source of the outage: the tweet.app post from @punkrokk saying "2.) API locked down. No more (intentionally) public APIs ATM."

## What changes

- **Homepage status notice**: keep the current wording, and add the quote plus a link to the announcement (https://app.tweet.app/post/13b0e028-7164-429f-9045-9c264d741298), credited to @punkrokk, alongside the existing changelog link.
- **Changelog**: in the top entry ("tweet.app now needs your own connection"), add a note with the same quote, attribution, and link so the history records where the information came from.

Links open in a new tab.

## Technical notes

- `src/routes/index.tsx`: extend the status callout with the quoted line and an external anchor (`target="_blank" rel="noopener noreferrer"`).
- `src/routes/changelog.tsx`: the entry `notes` are plain strings; add an optional `source` field (label, quote, href) to the `Entry` type and render it beneath the notes for entries that have one.
- No token or styling values introduced; existing design-system tokens only.
