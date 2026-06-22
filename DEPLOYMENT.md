# Deploying jabberdimmy to Render with a GoDaddy domain

This guide walks through publishing the site on **Render** (free static hosting)
and pointing **jabberdimmy.com** (registered at **GoDaddy**) at it, including
automatic HTTPS. No prior Render experience required.

---

## 0. Overview / what you'll end up with

- The site running on Render's free Static Site tier.
- A temporary Render URL like `https://jabberdimmy.onrender.com` (always works).
- Your real domain `https://jabberdimmy.com` pointing at it.
- `https://www.jabberdimmy.com` automatically redirecting to the apex.
- A free, auto-renewing SSL certificate (the padlock) on all of the above.

There is **no build step** — the repo is plain HTML/CSS/JS served as-is. The
included `render.yaml` tells Render exactly how to host it.

---

## 1. Prerequisites

1. The code is on GitHub at `lalooola/jabberdimmy` (it is).
2. Decide which branch Render deploys from. **`main` is recommended.** Render
   redeploys automatically every time that branch changes, so merge the PR to
   `main` before/after connecting (either order works).
3. A Render account — sign up free at <https://render.com> using "Sign in with
   GitHub" so Render can see the repo.
4. Access to the GoDaddy account that owns `jabberdimmy.com`.

---

## 2. Deploy on Render

You can deploy either via the **Blueprint** (uses `render.yaml`, fewest clicks)
or as a **manual Static Site**. Both are below; do one.

### Option A — Blueprint (recommended, uses render.yaml)

1. Go to <https://dashboard.render.com>.
2. Click **New +** (top right) → **Blueprint**.
3. If prompted, click **Connect GitHub** / **Configure account** and grant
   Render access to the `lalooola/jabberdimmy` repository (you can limit it to
   just this repo).
4. Select the `lalooola/jabberdimmy` repo from the list.
5. Render reads `render.yaml` and shows a service named **jabberdimmy** of type
   **static**. Pick the branch (**main**).
6. Click **Apply** / **Create**. Render provisions the static site.
7. Wait ~1–2 minutes for the first deploy to finish (status goes to **Live**).
8. At the top of the service page you'll see the live URL, e.g.
   `https://jabberdimmy.onrender.com`. Open it to confirm the videos play.

### Option B — Manual Static Site (if you prefer not to use the blueprint)

1. <https://dashboard.render.com> → **New +** → **Static Site**.
2. Connect/select the `lalooola/jabberdimmy` repo.
3. Fill in:
   - **Name:** `jabberdimmy`
   - **Branch:** `main`
   - **Build Command:** leave **blank**
   - **Publish Directory:** `.` (a single dot = repo root)
4. Click **Create Static Site** and wait for the first deploy to go **Live**.

> Either way, the temporary `*.onrender.com` URL keeps working forever — it's a
> good way to test before the domain is wired up.

---

## 3. Add your custom domains in Render

1. Open the **jabberdimmy** service in Render.
2. Left sidebar → **Settings**.
3. Scroll to **Custom Domains** → **Add Custom Domain**.
4. Add **both**, one at a time:
   - `jabberdimmy.com`   (the apex / root domain)
   - `www.jabberdimmy.com`   (the www subdomain)
5. After adding each, Render shows a **"Verify"** state and the **exact DNS
   record** you must create. Render typically gives you:
   - For the **apex** `jabberdimmy.com`: an **A record** pointing to a Render IP
     address (commonly `216.24.57.1` — **use the value Render shows you**, not
     this one, in case it changes).
   - For **www**: a **CNAME** pointing to your `jabberdimmy.onrender.com`
     hostname.
6. Leave this Render tab open — you'll copy these exact values into GoDaddy next.

> Why an A record for the apex and a CNAME for www? DNS does not allow a CNAME
> on the root of a domain, and **GoDaddy specifically forbids it**. So the apex
> uses an A record (an IP), and only `www` uses a CNAME. Render is designed for
> exactly this split.

---

## 4. Set the DNS records in GoDaddy

1. Sign in at <https://dcc.godaddy.com/control/portfolio> (or GoDaddy →
   **My Products** → find `jabberdimmy.com` → **DNS** / **Manage DNS**).
2. You'll see a **DNS Records** table. First, **remove conflicting records**:
   - GoDaddy usually ships a **Parked** / **Forwarding** **A record** on `@`
     pointing at a GoDaddy IP, and sometimes a `www` CNAME pointing to
     `@`/parking. Delete (or edit) those so they don't fight the new ones.
   - Do **not** delete unrelated records you rely on (e.g. `MX` for email,
     `TXT` for verification). Only clear the `@` A record and the `www` record.
3. **Add the apex A record:**
   - Click **Add** (or **Add New Record**).
   - **Type:** `A`
   - **Name / Host:** `@`   (means the root, jabberdimmy.com)
   - **Value / Points to:** the Render IP shown in step 3 (e.g. `216.24.57.1`)
   - **TTL:** `1 Hour` (or the lowest GoDaddy offers, e.g. 600 seconds, to speed
     up propagation)
   - **Save.**
4. **Add the www CNAME record:**
   - **Type:** `CNAME`
   - **Name / Host:** `www`
   - **Value / Points to:** `jabberdimmy.onrender.com`
     (your exact Render hostname — include the trailing context GoDaddy expects;
     GoDaddy may auto-append the domain, that's fine)
   - **TTL:** `1 Hour`
   - **Save.**
5. Your records should now read (values from Render may differ):

   | Type  | Name | Value                       | TTL    |
   |-------|------|-----------------------------|--------|
   | A     | `@`  | `216.24.57.1`               | 1 Hour |
   | CNAME | `www`| `jabberdimmy.onrender.com`  | 1 Hour |

---

## 5. Verify and wait for SSL

1. Back in the **Render → Custom Domains** panel, click **Verify** on each
   domain (Render also re-checks automatically every few minutes).
2. Once DNS resolves, each domain flips to **Verified**, then Render issues a
   **free Let's Encrypt SSL certificate** automatically (you don't do anything).
3. When both show a green/verified state with a certificate, visit:
   - <https://jabberdimmy.com>
   - <https://www.jabberdimmy.com>   (should redirect to the apex)

### How long does it take?
- Render deploy: ~1–2 minutes.
- DNS propagation: usually a few minutes, occasionally up to a couple of hours
  (depends on the old TTL GoDaddy had cached). Up to 24–48h is the theoretical
  worst case but is rare for a fresh record.
- SSL issuance: automatic, usually within minutes of DNS verifying.

### Check propagation yourself (optional)
From a terminal:
```bash
# Should return the Render A-record IP:
dig +short jabberdimmy.com A

# Should return your onrender.com hostname:
dig +short www.jabberdimmy.com CNAME
```
Or use the web tool <https://dnschecker.org> and search `jabberdimmy.com` (A)
and `www.jabberdimmy.com` (CNAME).

---

## 6. Ongoing: how updates deploy

- Every push/merge to the **main** branch triggers an automatic redeploy.
- To change the background videos, edit `videos.js` (add/remove lines in the
  array), commit, and push — Render redeploys within a minute or two.

---

## 7. Recommended hardening before "real" launch

The three background clips currently load from **Higgsfield CDN URLs**. For a
production domain it's better to **commit the MP4 files into the repo** (in a
`videos/` folder) and reference them locally:

- Pros: faster, no dependency on Higgsfield keeping those URLs alive, works even
  if the CDN link expires.
- To do this, the files must be downloaded into the repo. In this environment
  that requires adding `d8j0ntlcm91z4.cloudfront.net` to the network egress
  allowlist; then the clips can be saved to `videos/` and `videos.js` updated to
  point at `videos/<file>.mp4`.

---

## Troubleshooting

- **Site loads on `onrender.com` but not on `jabberdimmy.com`:** DNS hasn't
  propagated or a stale GoDaddy parking record is still present. Re-check the two
  records in section 4 and that the old `@` A record was removed.
- **"Not secure" / certificate warning:** the SSL cert hasn't been issued yet;
  wait a few minutes after the domain verifies. Don't visit via `http://` —
  Render auto-upgrades to `https://` once the cert exists.
- **www doesn't redirect:** make sure **both** domains were added in Render
  (section 3); the redirect is automatic only when both exist.
- **Videos don't play:** they load from external CDN URLs, so the visitor needs
  internet access and the URLs must still be valid (see section 7).
