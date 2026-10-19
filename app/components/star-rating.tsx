export default function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating)
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`} className="inline-flex text-amber-500">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true" className={n <= rounded ? '' : 'text-zinc-300 dark:text-zinc-700'}>
          ★
        </span>
      ))}
    </span>
  )
}
