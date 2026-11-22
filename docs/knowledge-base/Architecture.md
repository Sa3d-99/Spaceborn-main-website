# Architecture

[[README]] · [[Homepage]]

## Purpose and entry points

Spaceborn's public website introduces its autonomous systems platform and
products. It uses Next.js App Router, React, TypeScript, and vanilla CSS.

- `app/page.tsx` renders `components/HomePage.tsx` and owns homepage metadata.
- `app/layout.tsx` owns shared metadata, global styles, and `PageTransition`.
- `components/HomePage.module.css` scopes the homepage design.
- `components/Navbar.tsx`, `Footer.tsx`, and `ResumeModal.tsx` provide shared UI.
- Other route trees cover company, systems, platforms, industries, simulation,
  DERYK, launches, and certificate verification.
- `app/api/` contains certificate and resume endpoints. Their implementations
  were outside the homepage task.

## Homepage dependencies

Framer Motion handles animated transitions, Lucide supplies line icons, and
IntersectionObserver controls reveal and video behavior. Product media lives at
existing Cloudinary URLs; fonts and partner logos live under `public/`.
`LazyVideo` mounts simulation sources when the viewport approaches.

## Setup and verification

Use a current Node.js version compatible with the pinned Next.js release. CI
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
