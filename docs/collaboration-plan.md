# Khoim: plan for contributions (1 October 2026)

How people send Khoim what it needs, how each thing is checked, and how it reaches the map. Written for Shashank. Stage 1 was built on the same day; `docs/contributions-setup.md` has the steps to switch it on. Two things differ from this plan as built: the form does not ask for an email address, and unused contributions are deleted after 60 days.

## The idea in one paragraph
Each place's card gets a "Tell us" form in place of today's email button. What people can send follows the roadmap: only the layers that are open take submissions, and the rest are shown as coming. Everything lands in a queue. Automatic checks run first, then Claude writes a note on each item, then a person presses Allow or Reject on a simple admin page. Allowed items come into the site through the same pull request and preview link you already use. Cost: nothing.

## 1. What people can send, and when
The form's first question is "What are you adding?". The choices are the roadmap. One choice is open at a time; the others are visible but cannot be picked.

| Choice | Roadmap status | In the form |
| --- | --- | --- |
| The Konkani name or spelling of a place | Names: open now | Open |
| How a name is said (a written guide) | Names: open now | Open |
| A correction to something on the card | Names: open now | Open |
| A recording of the name | Voices: next | Shown as "Next" until stage 2 |
| Crops, food, music, landmarks | Planned | Shown as "Planned" |

**How "not available" looks.** Not grey text. The design's rule is that a label is never dimmed, because grey text fails the AAA contrast we just checked. It already has a look for this, used on the Layers list: a dashed border, full-strength text, and the word "Next" or "Planned" on the right. The form uses the same look, so it matches and stays readable.

When a layer opens, its choice opens with it. One switch in the code (`LAYERS` in `src/data/khoim.ts`) controls both the Layers list and the form, so they cannot disagree.

## 2. The journey of one submission

| Step | Who | What happens |
| --- | --- | --- |
| 1. Send | Anyone, 18 or over | Fills in the form on a place's card. Ticks the consent box. A silent bot check runs. |
| 2. Automatic checks | The site | Ties it to the place by its code. Rejects empty or oversized entries, links and repeats. Notes the script used (Devanagari or Roman). No AI here. |
| 3. First read | Claude | Compares it with our sources and with other submissions for the same place. Flags a Marathi form offered as Konkani, a spelling that clashes with a source, or abuse. Writes two or three plain lines and a suggestion: looks fine, needs a speaker, or reject. |
| 4. Decision | A person | On the admin page, sees the submission, the checks and Claude's note. Presses Allow, Edit and allow, or Reject. Their name and the date are recorded. |
| 5. Onto the map | Claude, then Shashank | Claude collects the allowed items, writes them into the data files with the contributor and reviewer credited, and opens a pull request. Shashank checks the preview link and merges. |

Rules that do not change:
- Claude never allows a name, a say-it guide or a recording. Only a person does. Claude's note is advice.
- A Konkani name is allowed only by someone who reads Konkani. The admin page has two roles: "reviewer" (can decide on names) and "helper" (can clear spam, cannot allow names).
- Nothing reaches khoim.in without a merged pull request, as now.

## 3. Where it is kept, at no cost
Checked against Cloudflare's published limits on 1 October 2026.

| Need | What we use | Free allowance | Card needed |
| --- | --- | --- | --- |
| The queue (text) | Cloudflare D1, a small database | 5 GB, 100,000 writes and 5 million reads a day | No |
| The form and admin page | The existing "khoim" Worker | 100,000 requests a day. Map and page loads do not count. | No |
| Bot check | Cloudflare Turnstile | Unlimited checks | No |
| Admin login | Cloudflare Access | Free up to 50 people | Sources disagree. You will see when you switch it on. |
| Recordings waiting for review | The same database | One row holds up to 2 MB. A 10 second clip is about 0.1 MB. | No |
| Recordings that are live | Files in the GitHub repo, served like the fonts | No limit that matters | No |

- **If a free limit is ever hit,** the form stops taking submissions until the next day. Cloudflare's free plan does not bill.
- **Not used:** Cloudflare R2 file storage. Its free tier needs a card on file and charges if you go over.
- **Claude's first read** runs as a scheduled Claude Code job on your existing Claude plan. There is no separate AI bill and no AI key stored on the website.

**What changes in the rules.** `CLAUDE.md` says the site is static only and needs no secrets. Stage 1 changes that: the Worker gets a small server part, and two secrets live in Cloudflare's settings (never in the code): the bot-check key and a key that lets the scheduled Claude job read the queue.

## 4. The admin page
At `khoim.in/admin`, behind Cloudflare Access. A person on the allowed list types their email, gets a one-time code, and is in. No passwords to manage.

It shows one list, newest first, with a filter for Waiting, Allowed and Rejected. Each row shows:
- the place, and what kind of thing was sent
- what they sent, exactly as typed, and how they said they know
- the automatic checks and Claude's note
- for a recording: a play button
- **Allow**, **Edit and allow**, **Reject** (with a reason)

Also on the page: "Remove" for anything already allowed (for withdrawals), and a count of what is waiting.

## 5. Consent and privacy wording (draft)
I am not a lawyer and this is not legal advice. The drafts follow two things: how Mozilla's Common Voice asks for voice recordings, and India's Digital Personal Data Protection Act 2023 and its 2025 Rules as summarised in public sources. Have a lawyer read them before recordings open (stage 2). For text-only contributions (stage 1) the risk is low.

What the law asks for, in short: say plainly what you collect and why; get a clear yes; make saying no later as easy as saying yes; anyone under 18 needs a parent's verified consent. Verifying a parent is heavy, so Khoim takes contributions from adults only.

### 5a. On the form, above the Send button (all contributions)
> By sending this you confirm that you are 18 or older, that this is your own knowledge, and that it is not copied from a book or website that does not allow copying.
>
> A Konkani speaker will check it before anything changes on the map. If it is used, Khoim will publish it under the Creative Commons Attribution licence (CC BY 4.0), so that anyone can reuse it with credit. If you give your name, we will credit you next to it.
>
> You can ask us to correct or remove your contribution at any time: write to hello@khoim.in. [ ] I agree.

### 5b. Extra, for a recording (stage 2)
> Your voice is personal information. If your recording is approved, it will be played on khoim.in to anyone who visits, with your name and village if you gave them, or as "a speaker from [village]" if you did not.
>
> It will be published under CC BY 4.0. That means other people may copy and reuse it with credit, and we cannot call back copies they have already made.
>
> You can ask us to take it down at any time by writing to hello@khoim.in. We will remove it from khoim.in and from our data within 7 days.
>
> Please record only your own voice, and do not say anyone's name or private details. [ ] I am 18 or older and I agree to my recording being used this way.

### 5c. Privacy notice (a page linked from the form and from About)
> **Who we are.** Khoim is a non-profit initiative by Pangolin Marketing. Write to hello@khoim.in about anything on this page.
>
> **What we collect when you contribute.** What you send us (a name, a spelling, a note, a recording). Your name, if you choose to give it, for credit. Your email address, if you choose to give it, so we can ask you a question. Nothing else is asked for.
>
> **What we collect when you only visit.** Nothing that identifies you. Khoim itself sets no cookies. It remembers your choice of script and light or dark colours on your own device. Cloudflare, which hosts the site, counts visits without identifying visitors, and its bot check looks at your browser when you send the form.
>
> **Why.** To show how Goa's places are named and said, and to credit the people who tell us.
>
> **Who sees it.** Before review: only Khoim's reviewers. After approval: your contribution and, if you gave it, your name are public. Your email address is never published and never shared.
>
> **Where it is kept and for how long.** On Cloudflare's servers. Approved contributions are kept for as long as Khoim runs. Contributions we do not use are deleted within 90 days. Your email address is deleted once your contribution has been dealt with.
>
> **Your choices.** You can ask to see what we hold from you, to correct it, to remove it, or to withdraw your consent, by writing to hello@khoim.in. We will reply within 7 days. If you are not satisfied, you can complain to the Data Protection Board of India.
>
> **Children.** Khoim takes contributions only from people aged 18 or older.

Open points for the lawyer:
- Whether the 7 day and 90 day periods are right.
- Whether the notice must also be offered in Konkani. The Act speaks of offering notices in Indian languages. A Konkani version needs a translator; I will not write one.
- Whether "a speaker from [village]" is enough to keep someone who gave no name from being identified in a small village.
- Whether Cloudflare's bot check sets a cookie of its own. I have not confirmed this; if it does, the notice must say so.

## 6. Stages

**Stage 1: names, spellings, say-it guides, corrections (text only).**
- The form on each card, with the roadmap choices and the consent box. Wording for the fields, the thank-you and the errors already exists in `docs/copy.md` and is used as written.
- The queue, the automatic checks, the admin page with Allow and Reject, the scheduled first read by Claude.
- "Bring in what was allowed": Claude Code turns allowed items into a pull request.
- The privacy page.
- The email buttons stay as a fallback until the form has run for a few weeks.

**Stage 2: voices.**
- Recording in the browser: press, speak, listen back, send. 10 seconds at most.
- The extra consent, after a lawyer has read it.
- The card's "No recordings yet." gives way to credited recordings. The Voices layer switches to live.
- Needs a design for the recording screen before building.

**Stage 3: crops, food, music, landmarks.**
- Each needs a design for how it appears on the map and on the card before it is worth collecting. One layer at a time, in roadmap order.

## 7. What I need from you for stage 1
About 15 minutes in the Cloudflare dashboard, with steps I will write out one click at a time:
1. Create the bot check (Turnstile) for khoim.in and paste its secret into the Worker's settings.
2. Switch on Access for `khoim.in/admin` and list the emails that may log in.
3. Paste one more secret (I will generate it) for the scheduled Claude job.

The database is created automatically the first time the new version deploys.

And two decisions:
- Who the first reviewers are (emails), and which of them read Konkani.
- Whether the consent wording in 5a is good to go live for text. If you say nothing, I will use it as drafted.

## Sources
- Cloudflare D1 pricing and limits: https://developers.cloudflare.com/d1/platform/pricing/ and https://developers.cloudflare.com/d1/platform/limits/
- Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Cloudflare Turnstile plans: https://developers.cloudflare.com/turnstile/plans/
- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/ and https://community.cloudflare.com/t/why-using-r2-free-tier-involves-giving-card-info/945179
- Cloudflare Zero Trust free plan: https://zerometric.net/research/cloudflare-zero-trust-free-plan-limits-2026/
- Wrangler configuration (automatic database creation): https://developers.cloudflare.com/workers/wrangler/configuration/
- DPDP Act 2023 and Rules 2025: https://www.drishtiias.com/daily-updates/daily-news-analysis/dpdp-act-2023-and-dpdp-rules-2025 and https://www.medianama.com/2025/01/223-data-protection-rules-2025-children-data-india/
- Mozilla Common Voice privacy notice and terms: https://commonvoice.mozilla.org/privacy
