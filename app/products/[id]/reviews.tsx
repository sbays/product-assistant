import React from 'react';
import ReviewForm from './review-form';
import { getReviews } from '@/app/lib/catalogue';

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: 'UTC'
})
const Reviews = async ({ params }: { params: PageProps<'/products/[id]'>['params'] }) => {
  const { id } = await params
  const reviews = await getReviews(id)
  return (
    <div>
      <ReviewForm productId={id} />
      <ul>
        {reviews.map(review => (
          <li>
            <p>{review.reviewerName} - <span>{review.comment}</span> - <span>{review.rating} Star{review.rating > 1 ? 's' : ''}</span> - <time dateTime={review.date}>{dateFormatter.format(new Date(review.date))}</time>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;