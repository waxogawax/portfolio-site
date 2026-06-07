# Claude Instructions for this Project

This is an Astro personal portfolio site for waxogawa.

The site is deployed through this workflow:

Local editing
→ GitHub push
→ Vercel automatic deployment
→ Public website update

## Project structure

This site uses Astro and Markdown content collections.

### Pages

- `src/pages/index.astro` is the homepage.
- `src/pages/diary/index.astro` is the diary list page.
- `src/pages/diary/[slug].astro` is the diary detail page.
- Future works pages should use:
  - `src/pages/works/index.astro`
  - `src/pages/works/[slug].astro`
- Future writings pages should use:
  - `src/pages/writings/index.astro`
  - `src/pages/writings/[slug].astro`

### Content

- Diary Markdown files go in `src/content/diary/`.
- Work Markdown files should go in `src/content/works/`.
- Writing Markdown files should go in `src/content/writings/`.

Do not put `.astro` files inside `src/content/`.

Do not put `.md` content files inside `src/pages/`.

## Diary format

Diary entries should be created as Markdown files in:

```txt
src/content/diary/YYYY-MM-DD.md