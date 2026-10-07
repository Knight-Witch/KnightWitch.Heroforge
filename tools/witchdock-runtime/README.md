# witchdock-runtime

Canonical source for the Cloudflare Worker behind `https://witchdock.knightwitch.dev`.

The Worker owns provider-independent Witch Dock delivery (`/dev`, `/stable`, `/dev-auto`, `/beta`, and immutable `/payloads`) and the additive `/HFJSON/` redirect aliases. `/beta` serves only the standalone Public Beta Tester and its moving manifest from the `beta/` directory on canonical Dev; beta module code remains pinned to immutable `/payloads/<sha>/...` URLs. GitHub remains the primary Witch Dock source and Bitbucket the recovery source.

HF JSON aliases are intentionally stable semantic URLs. They currently return temporary `307` redirects to Lob's GitGud raw scripts with `Cache-Control: no-store`, so future absorption can retarget an alias without changing links published by HF.Status. The route table does not claim ownership of Lob's source bytes.

Run `npm test` in this directory for the local route contract. Use Wrangler dry-run/preview validation before any live deployment; production deployment remains a deliberate release action.
