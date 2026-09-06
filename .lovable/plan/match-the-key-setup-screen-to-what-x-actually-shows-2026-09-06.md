# Match the key setup screen to what X actually shows

Short answer: yes, your app is the right kind — but the screen you're on only shows half of what's needed.

What the app needs (OAuth 1.0a, user context, so it can post as you):

- Consumer Key -> the "API key" field in this app
- Secret Key -> the "API key secret" field
- Access Token -> the "Access token" field
- Access Token Secret -> the "Access token secret" field

The Bearer Token is not used and can be ignored — it can only read, never post.

Two things to do in the X console first:

1. In Settings, set user authentication permissions to **Read and write**.
2. Back on Keys & Tokens, under **OAuth 1.0 Keys**, generate the **Access Token and Secret**. If you set the permission after generating them, regenerate them — otherwise posting fails with a permission error.

## Change to make in the app

On the key setup card, relabel and annotate the four fields so they read exactly like the X console:

- "API key" -> label stays, hint: "Consumer Key in the X console"
- "API key secret" -> hint: "Secret Key in the X console"
- "Access token" / "Access token secret" -> hint: "Under OAuth 1.0 Keys — generate after setting Read and write"

Add a short note above the four fields covering the Read-and-write requirement, the regenerate-after-changing-permissions gotcha, and that the Bearer Token isn't needed. No logic or storage changes — labels and help text only.
