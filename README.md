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

The middleware is for local development. Production hosting needs the same `/api/chat` handler deployed as a serverless function or backend endpoint, with `OPENROUTER_API_KEY` configured as a server secret.
