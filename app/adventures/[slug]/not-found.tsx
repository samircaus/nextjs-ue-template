import Link from "next/link";

export default function AdventureNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Adventure not found
      </h1>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        This adventure doesn’t exist or has been removed.
      </p>
      <Link
        href="/adventures"
        className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        View all adventures
      </Link>
    </div>
  );
}
