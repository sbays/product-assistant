import Link from 'next/link';
import StarRating from '@/app/components/star-rating';
import type { ToolOutput } from './types';

export const priceFormatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export const cardClass =
  'flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900';
export const linkClass =
  'font-medium underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-white';



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
