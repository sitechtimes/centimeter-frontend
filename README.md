<p align="center">
	<img src="centimeter/public/logo/logoWithWords.svg" alt="Centimeter" width="420" />
</p>

# Centimeter

Centimeter is a Nuxt 3 frontend for creating presentations, editing slides, and running live audience sessions with real-time participation and poll support.

The runnable app lives in the [centimeter/](centimeter/) directory.

> [!IMPORTANT]
> This app depends on a working backend API. Configure `.env` before you try the editor, session, or poll flows, and make sure the backend server is running. Then, follow the readme on centimeter-backend to get the API running.

## About Centimeter

Centimeter covers the full presentation workflow from draft creation to live audience delivery.

### Main Screens

- Landing page and join entry point.
- Authentication pages for sign up and login.
- Dashboard for presentations and sessions.
- Presentation editor for slide creation and updates.
- Live session host and participant views.
- User profile and appearance settings.

## Key Features

### Presentation Editing

- Slide canvas with editor panels and drag-friendly component workflows.
- Presentation hydration from backend data.
- Automatic persistence after edits.
- Reusable slide and component structures for content, questions, and polls.

### Live Sessions

- Open and join sessions with a short join code.
- Fullscreen host mode for presenting.
- WebSocket-driven updates for slide changes and participant activity.
- Waiting-room and live-session screens for different stages of the presentation flow.

### Polls and Interaction

- Create multiple-choice poll slides.
- Close active polls and fetch results.
- Broadcast poll state and participant responses during a live session.

### Account and UI

- Sign up, log in, and sign out.
- Protected routes through Nuxt middleware.
- Persisted theme selection.
- Profile and account settings pages.

## Configuration

### Environment Variables

Create `centimeter/.env` before starting the app.

```env
VITE_BACKEND_URL=
VITE_URL=
```

- `VITE_BACKEND_URL` points to the API server used for auth, presentations, sessions, participants, and polls.
- `VITE_URL` is the public frontend origin used for SEO metadata and social previews.

### Important Notes

- Set up `.env` before starting the app. The frontend depends on `VITE_BACKEND_URL` for API calls and `VITE_URL` for metadata.
- Most routes require a working backend, especially presentation editing, session hosting, and poll results.
- The app uses local storage to persist some auth and session state, so a hard refresh may still restore data from a previous run.

## Tech Stack

- Nuxt 3
- Vue 3
- Pinia
- TypeScript
- Tailwind CSS
- Chart.js / vue-chartjs
- lucide-vue-next

## Prerequisites

- Node.js 18+ recommended
- npm
- A backend that exposes the API endpoints used by the app

## Setup

1. Change into the app directory.

```sh
cd centimeter
```

2. Install dependencies.

```sh
npm install
```

3. Start the development server.

```sh
npm run dev
```

4. Optional: expose the dev server on your LAN.

```sh
npm run dev:expose
```

## Building and Previewing

```sh
npm run build
npm run preview
```

If you need a static build:

```sh
npm run generate
```

## Available Scripts

From inside `centimeter/`:

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Nuxt development server. |
| `npm run dev:expose` | Start the dev server on `0.0.0.0:3000` for device testing. |
| `npm run build` | Build the production app. |
| `npm run preview` | Preview the production build locally. |
| `npm run generate` | Generate a static build. |
| `npm run postinstall` | Prepare Nuxt after install. |

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Public landing page and join entry point. |
| `/auth/login` | Log in to an existing account. |
| `/auth/signup` | Create a new account. |
| `/app/dashboard` | Authenticated dashboard for presentations and sessions. |
| `/app/create/[id]` | Presentation editor for a specific presentation code. |
| `/session/[code]` | Session host / participant view for a live session. |
| `/session/live` | Live presentation screen used during active sessions. |
| `/session/waiting` | Waiting room before a session starts. |
| `/user/profile` | User profile and account settings. |

## Project Structure

```text
centimeter/
	assets/              Global styles and shared assets
	components/          UI, auth, dashboard, editor, and session components
	layouts/             App layout shell
	middleware/          Auth and token route middleware
	pages/               Nuxt routes
	stores/              Pinia stores for auth, presentations, sessions, and polls
	utils/               API helpers and shared types
	public/              Static assets such as logos
```
