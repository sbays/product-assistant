import StarRating from '@/app/components/star-rating';
import type { Comparison } from '@/app/lib/agent/schemas';

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function PointList({ points }: { points: string[] }) {
  if (points.length === 0) return <span className="text-zinc-500 dark:text-zinc-400">None noted</span>;
  return (
    <ul className="list-disc space-y-1 pl-4">
      {points.map((point, i) => (
        <li key={`${i}-${point}`}>{point}</li>
      ))}
    </ul>
  );
}

const rowHeaderClass = 'bg-zinc-50 px-3 py-2 text-left align-top font-medium dark:bg-zinc-900';
const cellClass = 'px-3 py-2 align-top';

export default function ComparisonTable({ comparison }: { comparison: Comparison }) {
  const { products, recommendation } = comparison;
  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-md border-collapse bg-white text-sm dark:bg-zinc-950">
          <caption className="sr-only">Comparison of {products.map((p) => p.title).join(', ')}</caption>
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <td className={rowHeaderClass} />
              {products.map((p) => (
                <th key={p.id} scope="col" className="px-3 py-2 text-left align-bottom font-semibold">
                  {p.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            <tr>
              <th scope="row" className={rowHeaderClass}>Price</th>
              {products.map((p) => (
                <td key={p.id} className={`${cellClass} font-semibold`}>{priceFormatter.format(p.price)}</td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={rowHeaderClass}>Rating</th>
              {products.map((p) => (
                <td key={p.id} className={cellClass}>
                  <StarRating rating={p.rating} />
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={rowHeaderClass}>Pros</th>
              {products.map((p) => (
                <td key={p.id} className={cellClass}>
                  <PointList points={p.pros} />
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className={rowHeaderClass}>Cons</th>
              {products.map((p) => (
                <td key={p.id} className={cellClass}>
                  <PointList points={p.cons} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <figcaption className="text-sm">
        <span className="font-semibold">Recommendation: </span>
        {recommendation}
      </figcaption>
    </figure>
  );
}
