import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-zinc-900 dark:text-zinc-50">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
          Article Not Found
        </h2>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Sorry, we couldn't find the article you're looking for.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/blog"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Back to Blog
          </Link>
          <Link
            href="/"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
