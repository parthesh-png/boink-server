# Boink Server

Express/Mongoose API for the Boink social app.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `MONGO_URI` and a strong `JWT_SECRET`.
3. Run `npm run dev`. The API listens on port 5000 by default.

## Deploy to Render

Create a Web Service from this repository, using the repository root, build command `npm install`, and start command `npm start`. Set these service environment variables in Render:

- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — strong, unique secret
- `JWT_EXPIRES_IN` — `7d` (optional; this is the default)
- `CLIENT_URL` — exact deployed frontend origin, such as `https://your-site.vercel.app` (no `/api`)
- `NODE_ENV` — `production`

Render provides `PORT`. The health endpoint is `/api/health`. Keep `.env` and all credentials out of Git.
