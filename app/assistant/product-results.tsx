import Link from 'next/link';
import StarRating from '@/app/components/star-rating';
import type { ToolOutput } from './types';

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const cardClass =
  'flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900';
const linkClass =
  'font-medium underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-white';

export function SearchResults({ output }: { output: ToolOutput<'searchProducts'> }) {
  if (!output.products) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">No matching products in the catalogue.</p>;
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {output.products.length < output.total
          ? `Top ${output.products.length} of ${output.total} matches`
          : `${output.total} ${output.total === 1 ? 'match' : 'matches'}`}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {output.products.map((p) => (
          <li key={p.id} className={cardClass}>
            <span className="min-w-0">
              <Link href={`/products/${p.id}`} className={`${linkClass} block truncate`}>
                {p.title}
              </Link>
              {p.brand ? <span className="block text-xs text-zinc-500 dark:text-zinc-400">{p.brand}</span> : null}
            </span>
            <span className="flex shrink-0 flex-col items-end">
              <span className="font-semibold">{priceFormatter.format(p.price)}</span>
              <StarRating rating={p.rating} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductDetails({ output }: { output: ToolOutput<'getProducts'> }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {output.products.map((p) =>
        p.found ? (
          <li key={p.id} className={cardClass}>
            <span className="min-w-0">
              <Link href={`/products/${p.id}`} className={`${linkClass} block truncate`}>
                {p.title}
              </Link>
              <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'} · {p.reviews.length}{' '}
                {p.reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </span>
            <span className="flex shrink-0 flex-col items-end">
              <span className="font-semibold">{priceFormatter.format(p.price)}</span>
              <StarRating rating={p.rating} />
            </span>
          </li>
        ) : (
          <li key={p.id} className={`${cardClass} text-zinc-500 dark:text-zinc-400`}>
            Product #{p.id} isn&apos;t in the catalogue.
          </li>
        ),
      )}
    </ul>
  );
}
