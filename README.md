# mindcare

A React + Firebase landing page, built with Vite and Tailwind CSS v4.

## Stack

- **React 19** + **Vite** — app shell and dev server
- **Tailwind CSS v4** — utility styling, themed from CSS variables
- **Firebase** — Auth + Firestore (newsletter signup is wired to Firestore; auth helpers are ready for a future login/signup flow)

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Firebase project's config
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

The app renders and runs fine with `.env` left empty — only the newsletter form and any future auth actions require real Firebase credentials, since those modules are lazy-loaded on demand rather than at startup.

## Theming — one file controls all colors

Every color in the app is defined once in [src/styles/theme.css](src/styles/theme.css). To restyle the whole site, edit values there only:

- Tokens inside the `@theme` block (e.g. `--color-brand-orange`) are picked up automatically by Tailwind and become utility classes: `bg-brand-orange`, `text-brand-orange`, `border-brand-orange`, etc. Components should always use these utilities instead of hardcoded hex values.
- The `:root` block below it holds semantic aliases (`--color-cta-bg`, `--color-text-secondary`, ...) for the rare spots that need a raw CSS variable — inline styles, JS-driven styles. They just point back at the same tokens, so there's still only one source of truth.

## Project structure

```
src/
  components/
    layout/     Header, Footer, TopBanner
    sections/   One component per landing-page section
    ui/         Reusable primitives (Button, Container, Icon, ...)
  data/         Static content (nav links, FAQ, testimonials, ...) kept separate from markup
  firebase/     config.js (init), auth.js, firestore.js
  hooks/        useNewsletterSignup — drives the Firestore-backed signup form
  styles/       theme.css — the single color/design-token source
```

## Note on visual assets

The layout, spacing, and color scheme closely follow the reference design, but photography has been replaced with original illustrations/mockups to avoid using anyone else's copyrighted imagery or branding.
