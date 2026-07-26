# Social Media App

A modern Instagram-style MERN application with a React/Vite frontend, Chakra UI, TanStack React Query, an Express/MongoDB backend, Redis-backed caching/rate limiting, and Docker support for local and production environments.

## Architecture

The frontend is organized around reusable `components`, route-level `pages`, `layouts`, auth `context`, API `services`, query `hooks`, theme configuration, and constants. React Query owns server state for auth-aware posts, profile data, search, comments, and follow/unfollow flows.

The backend now uses `controllers`, `services`, `routes`, `middleware`, `models`, `validators`, `utils`, and `config` folders. MongoDB remains the source of truth; Redis is used only for feed/profile/search caching and distributed rate limiting when `REDIS_URL` is configured.

## Key Features

- Chakra UI responsive app shell with collapsible sidebar.
- Light/dark theme persisted through Chakra color mode.
- Login, register, and forgot-password placeholder screens.
- Modern post feed with loading skeletons, comments, likes, edit, and delete.
- Custom image upload controls with filename and preview.
- Profile editing for name, username, bio, and avatar.
- User profile pages with optimistic follow/unfollow updates.
- Search across post title/body and usernames with sorting.
- Framer Motion page/card motion and GSAP sidebar animation.
- Helmet, CORS, validation, JWT auth, centralized errors, and rate limiting.
- Production Docker deployment with separate frontend and backend services.

## Verification

```bash
cd server && npm run check
cd client && npm run lint
cd client && npm run build
```

## Live Demo

Frontend: https://social-media-frontend-8k8k.onrender.com

Backend: https://social-media-backend-6a1n.onrender.com

### Demo Login Credentials

| Email | Password |
| --- | --- |
| sam@gmail.com | sandeep |
| rock@gmail.com | sandeep |
