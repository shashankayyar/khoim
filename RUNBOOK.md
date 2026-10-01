# Khoim runbook

One page for running khoim.in. Written for Shashank; no coding needed for anything here.

## How a change goes live
1. Ask Claude Code for the change (open this folder in Claude Code and describe it in plain words).
2. Claude Code makes the change on a separate copy (a "branch") and opens a **pull request** on GitHub.
3. Within about 2 minutes Cloudflare adds a **preview link** to the pull request. Open it on your phone and on a computer and check the change.
4. If it is right, tap **Squash and merge** in GitHub (the mobile app works), or type "ship it" to Claude Code.
5. khoim.in updates about 2 minutes later.

Nothing reaches khoim.in without step 4. If a preview looks wrong, say what is wrong and it gets fixed on the same pull request.

## How to update a name

**A district or taluka (Goa, the 3 districts, the 12 talukas)**
These live in two files that must say the same thing: `design/components/data/places.js` and `data/names_districts_talukas.csv`. Tell Claude Code the place, the new spelling and where it comes from (the source). It updates both files and `docs/names-research.md`. If only one file is changed, the build stops and says so.

**A village's Konkani name**
1. A Konkani reviewer fills in the review sheet, `data/village_names_review.xlsx`.
2. For each village they have checked, the name goes into `data/villages_lgd.csv` in the columns `konkani_deva`, `romi`, `say`, with the reviewer's name in `reviewer` and the date in `reviewed_on`.
3. The site shows a village's Konkani name **only** when the name, the reviewer and the date are all filled in. A name without a reviewer and date stops the build.

Ask Claude Code to copy reviewed rows from the sheet into the CSV; send it the updated sheet.

**The rules that never bend**
- Names come from a source or a reviewer. Nobody, and no tool, makes up or transliterates a name, a pronunciation or a speaker.
- A say-it guide shows "Not yet checked by a speaker" until a speaker has checked it.
- Villages are matched to the government list by LGD code, never by name.

## Contributions from the public
- **Reviewing:** open `khoim.in/admin`, type your email, enter the code. Each item shows what was sent, the automatic checks and Claude's note. Press Allow, Edit and allow, or Reject. Only a reviewer who reads Konkani can allow.
- **Getting allowed items onto the site:** on the Allowed tab, press "Download the allowed items that are not on the site yet" and give the file to Claude Code. It opens a pull request; you check the preview and merge as usual.
- **Someone wants their contribution removed:** on the Allowed tab press Remove, then Remove for good. If it is already on khoim.in, also tell Claude Code to take it off.
- **What people can send:** names, spellings, how a name is said, corrections, and, for the parts of the map that are not built yet, a recording of the name (up to ten seconds), crops, food, music and landmarks. The second group is kept until that part of the map opens. People can send several things in one go (two crops, three dishes); each arrives as its own item. On the admin page a recording has a play button.
- **Claude's note on each item:** a scheduled job in the Claude app on your Mac ("Khoim queue reader") reads new items every morning and leaves a note for the reviewer. It runs only while the Claude app is open. It cannot allow or reject anything.
- **Adding or removing a reviewer, or setting it all up the first time:** `docs/contributions-setup.md`.
- **Cost:** nothing. If a free daily limit is ever reached, the form stops taking submissions until the next day.

## When the government list changes
The official village list is `data/raw/lgd_all_villages_goa_<date>.xlsx`, cleaned into `data/villages_lgd.csv`. If LGD publishes a new list, give the new file to Claude Code. The build checks the village count (429 today) and will stop until the change is looked at.

If a Survey of India outline and an LGD village turn out to be the same place, add the pair to `data/town_outline_matches.csv` with who confirmed it and when.

## If something breaks
- **khoim.in looks wrong after a merge:** on GitHub, open the pull request you just merged and press **Revert**, then merge the revert. The site goes back in about 2 minutes. Then tell Claude Code what happened.
- **A pull request shows a red cross:** tell Claude Code. If the cross is on "Workers Builds: khoim", the reason is in the Cloudflare log: open the link in the Cloudflare comment, scroll to the bottom, and paste the last lines.
- **The site is down but nothing changed:** check https://www.cloudflarestatus.com.

## Who has access
| What | Where | Who |
| --- | --- | --- |
| The code and data | github.com/shashankayyar/khoim (public to read) | Shashank (owner). Nobody else can change `main`. |
| Hosting, khoim.in, email forwarding, visitor numbers | Cloudflare, Pangolin account | Shashank |
| The domain name | GoDaddy (expires 30 September 2029; auto-renew is off) | Shashank |
| hello@khoim.in | Forwards to Shashank's work inbox | Shashank |

To give someone else access, add them on GitHub (repository Settings, Collaborators) and in Cloudflare (Manage Account, Members). Keep two-step login on for both.

No passwords or secret keys are stored in the code. The contribution form's settings are Secrets in Cloudflare (Worker "khoim", Settings, Variables and Secrets). One of them, the queue key, is also kept in the Keychain on Shashank's Mac so the queue reader can use it (`docs/contributions-setup.md`, step 6).

## Useful to know
- **Preview links** look like `https://<branch-name>-khoim.pangolin-account-fb7.workers.dev`.
- **Visitor numbers:** Cloudflare dashboard, Analytics & Logs, Web Analytics, khoim.in.
- **Licences:** code is MIT (`LICENSE`); data licences are in `DATA-LICENSE.md`.
- **The brief** for Claude Code is `CLAUDE.md`. If a rule about names or the design changes, change it there so it is not undone later.
