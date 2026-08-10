# Project instructions

## Dispatching Claude (ALWAYS follow this)

Whenever you send work to Claude (e.g. reviews, design fixes, feature builds, research),
always use the exact toolchain and conventions we set up:

- Tool: `/home/joe/.local/bin/pxclaude` (pxpipe — never plain `claude -p` for delegations).
- Write the full objective to a prompt file under `/tmp/` (e.g. `/tmp/xxx-prompt.md`),
  then invoke: `pxclaude "<short description>" <promptfile>`.
- Background it so it doesn't block: `setsid nohup ... > /tmp/xxx.log 2>&1 &`.
- Enable caveman compression so responses come back short: `CAVEMAN=1`.
- Set `MAX_TURNS` per task size (small reviews ~12, big feature builds ~80–100).
- Set `ALLOWED_TOOLS` deliberately per task (reviews: no browser, `Read WebSearch WebFetch Bash`;
  builders/designers: add `Write Edit Glob Grep mcp__playwright`).
- Redirect output to a log file (e.g. `/tmp/xxx.log`) and poll it; progress streams
  through pxpipe so the log stays thin — watch file changes / process state instead.
- Give Claude a skill pointer when relevant (e.g. design-taste-frontend) and a short
  "report back" list so its final message is structured.
- Do NOT have Claude commit to git; you handle commits only when the user asks.

## Project conventions

- Stack: Next.js 15 App Router, TypeScript, vanilla CSS in `app/globals.css`. No Tailwind.
- All site content is client-side CMS via localStorage (`app/content.ts` + `app/use-site-content.ts`).
  No backend. Admin at `/admin` (password `admin`).
- Two themes via `[data-theme="light"]` in globals.css: dark = purple `#6c5ce7` identity;
  light = slate/blue/teal (canvas `#F8FAFC`, cards white + `#E2E8F0` border + rounded-xl,
  CTA `#2563EB`, teal badges, dark terminal hero panel).
- After any change: `npm run build` must pass, then `rm -rf .next` and restart the dev
  server detached (`setsid /bin/sh -c 'cd /home/joe/Projects/Portfolio && exec npm run dev'
  </dev/null >/tmp/next-dev.log 2>&1 &`). Never use `pkill -f "next dev"` (kills your own shell);
  use `pkill -x next-server` by PID instead.
