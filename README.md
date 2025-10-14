# beije Assignment Workspace

Full-stack implementation for the beije case study using an Nx monorepo. The backend exposes the email verification workflow, while the frontend offers a Custom Package builder scaffold wired with global state management and a email api testing page (mongodb and api should be running to test from frontend).

## Stack

### Backend

- Node.js 20 · PNPM 10
- NestJS 11 on Nx
- MongoDB with Mongoose ODM
- Nodemailer (SMTP or JSON transport fallback)
- Jest + @nestjs/testing

### Frontend

- Next.js 15 App Router
- TypeScript, RTK Query, Redux Toolkit
- Material UI 7 + Tailwind CSS 3 utility layer
- React Testing Library + Jest (unit specs scaffolded)

## Backend setup

1. **Install dependencies**
   ```sh
   pnpm install
   ```

2. **Provision MongoDB**
   ```sh
   docker-compose up -d
   ```
   or bring your own MongoDB instance and update `MONGODB_URI`.

3. **Configure environment**
   ```sh
   cp .env.example .env
   # adjust values (SMTP credentials are optional in development)
   ```

4. **Run the API**
   ```sh
   pnpm nx serve api
   ```
   The server starts on `http://localhost:3333`.

## Frontend setup

1. **Environment variables** – ensure `NEXT_PUBLIC_API_URL` points at the backend base URL (defaults to `http://localhost:3333`).
2. **Start the dev server**
   ```sh
   pnpm nx dev frontend
   ```
   The builder runs on `http://localhost:4200` by default.

## Scripts

- `pnpm dev` – run the NestJS API (serves at port 3333)
- `pnpm web:dev` – run the Next.js dev server (serves at port 4200)
- `pnpm build` / `pnpm web:build` – production builds for backend / frontend
- `pnpm lint` / `pnpm web:lint` – ESLint for backend / frontend
- `pnpm test` / `pnpm web:test` – Jest test suites (Watchman disabled)

## Environment variables

| Name | Required | Default | Description |
| ---- | -------- | ------- | ----------- |
| `MONGODB_URI` | ✓ | `mongodb://localhost:27017/beije` | Mongo connection string |
| `APP_BASE_URL` | ✓ | `http://localhost:3333` | Used to compose verification links |
| `EMAIL_FROM` | ✓ | `no-reply@beije.local` | Sender address for outgoing emails |
| `EMAIL_SMTP_HOST` | – | – | SMTP host when sending real emails |
| `EMAIL_SMTP_PORT` | – | 587 | SMTP port |
| `EMAIL_SMTP_SECURE` | – | `false` | Use TLS when `true` |
| `EMAIL_SMTP_USER` | – | – | SMTP username |
| `EMAIL_SMTP_PASS` | – | – | SMTP password |
| `NEXT_PUBLIC_API_URL` | ✓ | `http://localhost:3333` | Base URL the Next.js app uses for RTK Query calls |

When SMTP settings are omitted, Nodemailer falls back to a JSON transport that logs message payloads, which is convenient for local development.

## API

`POST /user/register`
: Request body `{ "username": string, "email": string }`.  
  Creates a user, persists a verification token, and sends an email. Responds with the user summary and a status message. Duplicate usernames or emails return HTTP 409.

`GET /user/verify-email/:username/:token`
: Validates the token and marks the user as verified. Returns HTTP 404 if the user does not exist and 400 for invalid tokens.

`GET /user/check-verification/:username`
: Returns `{ isVerified: boolean, message: string }`, with HTTP 404 for unknown users.

## Project layout

```
apps/
  api/
    src/
      app/
        config/         # Config defaults and Joi validation
        email/          # Nodemailer integration
        users/          # User schema, service, controller, DTOs, tests
    webpack.config.js   # Nx build configuration
  frontend/
    src/
      app/              # App Router entry + providers
      features/         # Package builder state + components
      services/         # RTK Query slices
      store/            # Redux store wiring
    tailwind.config.ts
    postcss.config.js
.env.example
docker-compose.yml
```

## Notes

- A Nodemailer JSON transport is used by default so that the server can be exercised without SMTP credentials. Configure the SMTP variables for Gmail, Sendgrid, etc. when ready.
- The frontend ships with Tailwind utility classes layered beneath Material UI. Update the theme tokens or Tailwind config before applying bespoke styling to mirror the production site.
- RTK Query endpoints in `apps/frontend/src/services/userApi.ts` align with the Nest routes, so wiring the UI to the live backend is straightforward once styling is in place.

## AI assistance log

This solution was prepared with help from ChatGPT 5 Codex for project skeleton.
