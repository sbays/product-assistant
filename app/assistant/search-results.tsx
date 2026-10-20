import Link from "next/link";
import StarRating from "../components/star-rating";
import { cardClass, linkClass, priceFormatter } from "./product-results";
import { ToolOutput } from "./types";


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