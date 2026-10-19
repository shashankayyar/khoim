/* When each row of a data file last changed, from the project's git history. Used for the sitemap's dates:
   a page's date is the day its own data last changed, not the day the site was built.

   Cloudflare's build machine may fetch only the latest commit. If so, the full history is fetched first. If git
   or its history cannot be reached, dates are left out of the sitemap (allowed, and better than a wrong date). */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/* A row as compared between versions: empty fields left out, so adding a blank column changes no row. */
const same = row => JSON.stringify(Object.entries(row).filter(([, v]) => v !== '' && v != null));

export function openHistory(root) {
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] });
  let ok = false, why = '';
  try {
    if (git('rev-parse', '--is-shallow-repository').trim() === 'true') {
      try { execFileSync('git', ['fetch', '--unshallow', '--quiet'], { cwd: root, stdio: 'ignore', timeout: 120_000 }); }
      catch { why = 'only the latest commit is here and the rest could not be fetched'; }
    }
    if (!why) ok = git('rev-parse', '--is-shallow-repository').trim() === 'false';
  } catch { why = 'git is not available'; }

  /* Commits that touched a file, oldest first, with the day each landed. */
  const commits = file => {
    if (!ok) return [];
    return git('log', '--reverse', '--format=%H %cI', '--', file).trim().split('\n').filter(Boolean)
      .map(line => { const [hash, iso] = line.split(' '); return { hash, day: iso.slice(0, 10) }; });
  };

  return {
    ok,
    why,
    /** The day the file last changed in any way. */
    fileDay(file) { const c = commits(file); return c.length ? c[c.length - 1].day : null; },

    /** key -> the day that row last changed. `rowsOf(text)` turns one version of the file into [key, row] pairs. */
    rowDays(file, rowsOf) {
      const days = new Map();
      let before = new Map();
      for (const { hash, day } of commits(file)) {
        let now;
        try { now = new Map(rowsOf(git('show', `${hash}:${file}`)).map(([k, row]) => [k, same(row)])); }
        catch { continue; } // a version that cannot be read is skipped
        for (const [k, row] of now) if (before.get(k) !== row) days.set(k, day);
        before = now;
      }
      return days;
    },

    /** Like rowDays, for a binary file (the review spreadsheet): each version is written to a scratch file and
        `rowsOf(path)` lists its rows. */
    binaryRowDays(file, rowsOf) {
      const days = new Map();
      let before = new Map();
      if (!ok) return days;
      const dir = mkdtempSync(join(tmpdir(), 'khoim-history-'));
      try {
        for (const [i, { hash, day }] of commits(file).entries()) {
          let now;
          try {
            const copy = join(dir, `v${i}` + file.slice(file.lastIndexOf('.')));
            writeFileSync(copy, execFileSync('git', ['show', `${hash}:${file}`], { cwd: root, maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] }));
            now = new Map(rowsOf(copy).map(([k, row]) => [k, same(row)]));
          } catch { continue; }
          for (const [k, row] of now) if (before.get(k) !== row) days.set(k, day);
          before = now;
        }
      } finally { rmSync(dir, { recursive: true, force: true }); }
      return days;
    },

    /** Like rowDays, for a JavaScript data file: each version is loaded and `rowsOf(module)` lists its rows. */
    async moduleRowDays(file, rowsOf) {
      const days = new Map();
      let before = new Map();
      const dir = mkdtempSync(join(tmpdir(), 'khoim-history-'));
      try {
        for (const [i, { hash, day }] of commits(file).entries()) {
          let now;
          try {
            const copy = join(dir, `v${i}.mjs`);
            writeFileSync(copy, git('show', `${hash}:${file}`));
            now = new Map(rowsOf(await import(pathToFileURL(copy).href)).map(([k, row]) => [k, same(row)]));
          } catch { continue; }
          for (const [k, row] of now) if (before.get(k) !== row) days.set(k, day);
          before = now;
        }
      } finally { rmSync(dir, { recursive: true, force: true }); }
      return days;
    }
  };
}
