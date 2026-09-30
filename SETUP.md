# Khoim: setup checklist

## Already done (30 September 2026)
- [x] Domain khoim.in bought at GoDaddy, nameservers switched to Cloudflare (celeste and pranab.ns.cloudflare.com).
- [x] khoim.in added to the Pangolin Cloudflare account, free plan.
- [x] hello@khoim.in forwards to my work inbox (Cloudflare Email Routing, DNS records added).
- [x] Cloudflare Web Analytics on for khoim.in, set to inject itself automatically.
- [x] Design finished in Claude Design (in `design/`).

## 1. Accounts (you, once)
- [ ] GitHub: two-factor login on, recovery codes saved.
- [ ] GitHub Mobile app on your phone, notifications on. This is where you approve changes.
- [ ] Cloudflare: two-factor login on.

## 2. Your Mac (paste into Terminal, about 20 minutes)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# run the two "Next steps" lines Homebrew prints, then:
brew install node@24 gh
brew link --overwrite --force node@24
node -v      # should say v24.something
git --version && gh --version
gh auth login   # GitHub.com, HTTPS, Login with a web browser
git config --global user.name "Shashank"
git config --global user.email "YOUR-ID+USERNAME@users.noreply.github.com"   # from github.com/settings/emails
```
If `node -v` fails: `echo 'export PATH="/opt/homebrew/opt/node@24/bin:$PATH"' >> ~/.zshrc`, then open a new Terminal window.

## 3. First Claude Code session
Unzip this folder to somewhere like ~/Projects/khoim. In Terminal, `cd` into it, run `claude`, and say:
"Read CLAUDE.md and SETUP.md, then do the first-session tasks."
Approve the prompt to create the GitHub repo.

## 4. Connect Cloudflare to GitHub (you, 10 minutes, after the repo exists)
1. Cloudflare dashboard, Workers & Pages, Create, Import a repository.
2. Authorise the Cloudflare GitHub app for **only the khoim repository**.
3. Project name `khoim`. Build command `npm run build`. Deploy command `npx wrangler deploy`. Turn on builds for non-production branches.
4. After the first deploy: the Worker, Settings, Domains & Routes, Add, choose `khoim.in` (and `www.khoim.in` if you want it to redirect).

## 5. Protect main (you, 3 minutes)
GitHub repo, Settings, Rules, Rulesets, New branch ruleset, target `main`. Tick "Require a pull request before merging" and "Block force pushes". Leave the bypass list empty.

## How every change ships after that
Claude Code opens a pull request, Cloudflare posts a preview link on it within about 2 minutes, you check it on your phone, tap "Squash and merge" in GitHub Mobile, and khoim.in updates about 2 minutes later.

## Later
- Auto-renew for khoim.in at GoDaddy (currently off; expires 30 September 2029).
- Konkani reviewers for village names (`data/village_names_review.xlsx`).
- R2 storage in Cloudflare when recordings arrive.
