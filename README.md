# JobPilot — Job Application Tracker

A modern, elegant frontend for tracking job applications — from wishlist to offer.
Built with **React 18 + Vite**, styled with **Tailwind CSS**, animated with
**Framer Motion**, drag-and-drop kanban powered by **dnd-kit**, and icons from
**lucide-react**.

## Features

- **Pipeline kanban board** — 5 stages (Wishlist, Applied, Interview, Offer, Rejected)
  with drag-and-drop cards; dragging a card updates its status
- **Animated stats dashboard** — count-up cards for totals, interviews, offers,
  rejections and response rate
- **Upcoming interviews strip** — interview-stage applications sorted by date
- **Weekly activity chart** — custom SVG bar chart of applications per week
- **Pipeline summary** — per-stage distribution bars
- **Search + status filter chips** across the whole board
- **Add / edit modal** with validation (company & role required)
- **Detail drawer** — click any card for the full picture, edit or delete
- **Delete with confirmation**
- **Cloud backend (Firebase)** — Email/Password authentication and per-user
  Firestore storage; data syncs across devices and is seeded with 8 realistic
  fictional applications on first sign-in
- Fully responsive, light theme, Linear/Vercel-inspired aesthetic

## Backend

JobPilot uses **Firebase Authentication** (Email/Password) and **Cloud Firestore**
on the free Spark plan. Each user's applications live under
`users/{uid}/applications`, so data is fully isolated per account.

The Firebase web config lives in `src/lib/firebase.js` (public client config —
safe to commit). Firestore access is locked down with these security rules
(set them in the Firebase console under Firestore Database > Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/applications/{applicationId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Getting started

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build
```

## Deploying to Vercel

1. Push this folder to a GitHub repository
2. Import the repo in Vercel (framework preset: **Vite**)
3. Deploy — no environment variables or build configuration needed

## Screenshots

> Screenshots will be added here after the first deployment.
>
> - `docs/screenshots/dashboard.png` — dashboard with stats, interviews and chart
> - `docs/screenshots/kanban.png` — drag-and-drop pipeline board
> - `docs/screenshots/detail.png` — application detail drawer

## Tech stack

| Tool | Purpose |
| --- | --- |
| React 18 + Vite | UI + build |
| Tailwind CSS | Styling |
| Framer Motion | Animations & transitions |
| dnd-kit | Drag-and-drop kanban |
| lucide-react | Icons |
| Firebase | Auth (Email/Password) + Firestore database |
