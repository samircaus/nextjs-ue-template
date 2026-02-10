This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It fetches WKND content from Adobe Experience Manager (AEM) via persisted GraphQL queries.

## Environment (AEM)

Copy `.env.example` to `.env.local` and set:

- **`AEM_PUBLISH_URL`** – AEM Publish base URL for GraphQL and image/asset URLs. If unset, the app shows fallback text instead of AEM content.
- **Preview mode:** To use AEM **Author** for draft content, set **`AEM_PREVIEW_MODE=true`** and **`AEM_AUTHOR_URL`**, then start the server. Production uses Publish only.

See [docs/PERSISTED_QUERIES.md](docs/PERSISTED_QUERIES.md) for all persisted query names, variables, and response shapes.

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

## Deploy on Cloudflare (OpenNext)

This app uses [OpenNext for Cloudflare](https://opennext.js.org/cloudflare) and deploys as a Cloudflare Worker. The `.open-next/worker.js` file is **generated at build time**; it is not committed (see `.gitignore`).

**You must run the OpenNext build before deploy.** If you see *"The entry-point file at '.open-next/worker.js' was not found"*, your Cloudflare build is not running the OpenNext build step.

- **Locally:** `npm run deploy` runs `opennextjs-cloudflare build` then `opennextjs-cloudflare deploy`.
- **Cloudflare Workers Builds / CI:**  
  - **Build command:** `npx opennextjs-cloudflare build`  
  - **Deploy command:** `npx opennextjs-cloudflare deploy`  

Do not use `npm run build` (Next.js only) or `wrangler deploy` alone as the only build step; that does not create `.open-next/`. See [docs/CLOUDFLARE_DEPLOY.md](docs/CLOUDFLARE_DEPLOY.md) for full settings.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
