import React from 'react';
import ReviewForm from './review-form';
import { getReviews } from '@/app/lib/catalogue';
import StarRating from '@/app/components/star-rating';

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: 'UTC'
})
const Reviews = async ({ params }: { params: PageProps<'/products/[id]'>['params'] }) => {
  const { id } = await params
  const reviews = await getReviews(id)
  return (
    <section aria-labelledby="reviews-heading" className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div>
        <h2 id="reviews-heading" className="mb-4 text-2xl font-bold tracking-tight">
          Reviews <span className="text-zinc-500 dark:text-zinc-400">({reviews.length})</span>
        </h2>
        {reviews.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No reviews yet. Be the first!</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {reviews.map(review => (
              <li
                key={`${review.reviewerName}-${review.date}`}
                className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{review.reviewerName}</p>
                  <time dateTime={review.date} className="text-sm text-zinc-500 dark:text-zinc-400">
                    {dateFormatter.format(new Date(review.date))}
                  </time>
                </div>
                <StarRating rating={review.rating} />
                <p className="mt-2 text-zinc-700 dark:text-zinc-300">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ReviewForm productId={id} />
    </section>
  );
};

export default Reviews;
