# AI Accelerator

React and Vite demo for compliance scanning and workspace assistance.

## Run locally

```sh
npm install
npm run dev
```

## OpenRouter chat

1. Copy `.env.example` to `.env.local`.
2. Set `OPENROUTER_API_KEY` in `.env.local` to your OpenRouter key. Keep this file local; do not commit or paste the key into frontend code.
3. Restart the Vite dev server and open **Ask AI** in the sidebar.

Chat requests pass through a Vite server middleware at `/api/chat`; the key stays on the server side. The default model is OpenRouter Auto Router (`openrouter/auto`). Set `OPENROUTER_MODEL` in `.env.local` to select another OpenRouter model.

For Vercel deployments, `api/chat.js` provides the production `/api/chat` serverless function and `vercel.json` configures the Vite build. In the Vercel project, add `OPENROUTER_API_KEY` under **Settings > Environment Variables** (Production and Preview as needed), optionally add `OPENROUTER_MODEL`, then redeploy. Never use a `VITE_` prefix for the key; it must stay server-side.

The Vite middleware is for local development. The client reports a clear message if a deployment serves an HTML 404 page instead of the chat API JSON.
