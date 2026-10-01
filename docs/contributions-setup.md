# Switching on contributions (about 15 minutes, once)

Until these steps are done, nothing changes for visitors: place cards keep their email buttons. When they are done, "Tell us" and "Suggest a correction" open the form, and `khoim.in/admin` is the reviewers' page.

Everything below is in the Cloudflare dashboard, in the Pangolin account. Nothing here costs money.

## 1. Check the database exists
Workers & Pages, then **D1 SQL Database** in the left menu. You should see **khoim-contributions**. Cloudflare creates it the first time the new version of the site deploys.

If it is not there, press **Create database**, name it `khoim-contributions`, and tell Claude Code. One line in the code then needs its ID.

## 2. Create the bot check
1. In the left menu, **Turnstile**. Press **Add widget**.
2. Name: `Khoim`. Hostname: `khoim.in`. Mode: **Managed**. Create.
3. You are shown a **Site Key** and a **Secret Key**. Keep the page open.

## 3. Switch on the admin login
1. In the left menu, **Zero Trust** (it may ask you to pick a team name the first time; choose the free plan).
2. **Access**, **Applications**, **Add an application**, **Self-hosted**.
3. Name: `Khoim admin`.
4. Add two addresses: domain `khoim.in` with path `admin`, and domain `khoim.in` with path `api/admin`.
5. Add a policy. Name: `Reviewers`. Action: **Allow**. Include: **Emails**, and type each reviewer's email address.
6. Login method: **One-time PIN**. Save.
7. Open the application again and copy its **Application Audience (AUD) Tag**, a long string of letters and numbers.
8. Note your team name: in Zero Trust, **Settings**, **Custom Pages**, the address shown as `something.cloudflareaccess.com`. The team name is the `something`.

## 4. Give the site its six settings
Workers & Pages, **khoim**, **Settings**, **Variables and Secrets**, **Add**. For each one choose type **Secret** (not Text: a Text value is wiped the next time the site deploys).

| Name | Value |
| --- | --- |
| `TURNSTILE_SITE_KEY` | the Site Key from step 2 |
| `TURNSTILE_SECRET` | the Secret Key from step 2 |
| `ACCESS_TEAM` | the team name from step 3 |
| `ACCESS_AUD` | the AUD Tag from step 3 |
| `REVIEWERS` | who may review, in the format below |
| `QUEUE_KEY` | a long random string, 40 characters or more. Any password generator will do. Keep a copy: the scheduled Claude job needs it. |

`REVIEWERS` is one line. Each person is `email | name | konkani`, with people separated by `;`. Leave off `| konkani` for a helper, who can clear spam but cannot allow a name:

```
you@example.com | Shashank ; reviewer@example.com | Their Name | konkani
```

The name is what gets credited as the reviewer, so write it the way they want it shown.

Press **Deploy** when asked. The settings take effect in about a minute.

## 5. Check it works
1. Open khoim.in, open any village, tap "All names", then "Tell us". A form should open. Send a test.
2. Open `khoim.in/admin`. It should ask for your email, send a code, and then show your test under Waiting.
3. Press Reject on your test.

## 6. Claude's first read
Tell Claude Code: "set up the queue reader". It will ask you to paste the `QUEUE_KEY` into the scheduled job's own settings (not into the chat and not into the code). After that, a scheduled run reads new items, compares them with the sources, and leaves a note on each for the reviewer.

## Later: adding or removing a reviewer
Two places, both in the dashboard: the Access policy (step 3.5) so they can log in, and `REVIEWERS` (step 4) so the site knows their name and whether they read Konkani.
