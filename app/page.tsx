import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-6 py-24 text-center">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Find the right product, backed by real reviews
      </h1>
      <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Browse the catalogue, check what is in stock, and see what other shoppers think.
      </p>
      <Link
        href="/products"
        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Browse products
      </Link>
    </section>
  );
}
