# Architecture

[[README]] · [[Homepage]] · [[Redesign-trial-1]]

## Purpose and entry points

Spaceborn's public website introduces its autonomous systems platform and
products. It uses Next.js App Router, React, TypeScript, and vanilla CSS.

- `app/page.tsx` renders `components/HomePage.tsx` and owns homepage metadata.
- `app/layout.tsx` owns shared metadata, global styles, and `PageTransition`.
- `components/HomePage.module.css` scopes the homepage design.
- `app/home-daisyui.css` builds prefixed daisyUI components via Tailwind and
  `postcss.config.mjs`. The `spaceborn` theme applies to the homepage. Tailwind Preflight is omitted to preserve other route styles.
- `components/Navbar.tsx`, `Footer.tsx`, and `ResumeModal.tsx` provide shared UI.
- Other route trees cover company, systems, platforms, industries, simulation,
  DERYK, launches, and certificate verification.
- `app/api/` contains certificate and resume endpoints. Their implementations
  were outside the homepage task.

## Homepage dependencies

On `redesign/trial-1`, CSS controls entrance and motion preferences. The
homepage loads Font Awesome from `all.min.css` for navigation and UI icons.
The homepage uses checked-in Spaceborn media and existing Cloudinary URLs.
Product card video loads on hover or keyboard focus in view. Simulation video
uses native playback controls.

## Setup and verification

Use Node.js 20.9 or newer for the pinned Next.js release. CI
uses Node 20; the November 2026 homepage checks ran on Node 22.

```sh
npm ci
npm run dev
npx tsc --noEmit
npm run build
npm run start
```

`.github/workflows/ci.yml` runs dependency installation, typechecking, and a
production build on pushes and pull requests to `main`.

Application configuration, credentials, and upload content must remain outside
knowledge extraction. No secrets are needed to render the homepage.
