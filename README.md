This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI writing coach configuration

The writing coach calls Google's hosted Gemma model from the server-only
`POST /api/writing-assessment` route. Configure these variables in the Vercel
project environment:

```text
Gemma_API=your_google_ai_studio_api_key
GEMMA_MODEL=gemma-4-26b-a4b-it
```

- `Gemma_API` is required and must be a Google AI Studio / Gemini API key. Never
  prefix it with `NEXT_PUBLIC_` or expose it to browser code.
- `GEMMA_MODEL` is optional. The default is `gemma-4-26b-a4b-it`, a Gemma model
  supported by the Gemini API `v1beta` `generateContent` endpoint. Override it
  only with another model ID supported by that endpoint.
- Add the variables separately for each Vercel environment that needs coaching
  (Development, Preview, and Production), then redeploy.

For local development, provide the same names through your normal uncommitted
environment configuration. Do not commit a real API key.
