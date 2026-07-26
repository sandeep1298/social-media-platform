# Social Media App

A modern Instagram-style MERN application with a React/Vite frontend, Chakra UI, TanStack React Query, an Express/MongoDB backend, Redis-backed caching/rate limiting, and Docker support for local and production environments.

## Architecture

The frontend is organized around reusable `components`, route-level `pages`, `layouts`, auth `context`, API `services`, query `hooks`, theme configuration, and constants. React Query owns server state for auth-aware posts, profile data, search, comments, and follow/unfollow flows.

The backend now uses `controllers`, `services`, `routes`, `middleware`, `models`, `validators`, `utils`, and `config` folders. MongoDB remains the source of truth; Redis is used only for feed/profile/search caching and distributed rate limiting when `REDIS_URL` is configured.

## Local Development

Run the full stack with Docker:

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`

Backend health: `http://localhost:5000/api/health`

Detailed Docker guides:

- [DOCKER_LOCAL_SETUP.md](./DOCKER_LOCAL_SETUP.md)
- [DOCKER_PRODUCTION_SETUP.md](./DOCKER_PRODUCTION_SETUP.md)

Manual setup is still supported:

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

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
- Local Docker Compose and separate production Dockerfiles.

## Verification

```bash
cd server && npm run check
cd client && npm run lint
cd client && npm run build
```

Production deployment details are in [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md).
