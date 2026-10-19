'use client'
import React, { useActionState } from 'react';
import { addReviewAction, ReviewFormState } from './actions';
import { addReview } from '@/app/lib/review-store';

const initialState: ReviewFormState = { ok: false }

const ReviewForm = ({ productId }: { productId: string }) => {
  console.log({ productId });
  const [state, formAction, pending] = useActionState(addReviewAction.bind(null, productId), initialState)
  return (
    <form action={formAction}>
      <label htmlFor="reviewerName">Name</label>
      <input className='border rounded' type="text" id="reviewerName" name='reviewerName' aria-invalid={Boolean(state.errors?.reviewerName)}
        aria-describedby='reviewerName-error ' />
      <p id='reviewerName-error'>{state.errors?.reviewerName?.[0]}</p>
      <label htmlFor="rating">Rating</label>
      <select id="rating" name="rating" defaultValue="5">
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <label htmlFor="comment">Comment</label>
      <textarea
        id="comment" className='border rounded'
        name="comment"
        aria-invalid={Boolean(state.errors?.comment)}
        aria-describedby="comment-error"
      />
      <p id="comment-error">{state.errors?.comment?.[0]}</p>

      <button className='border rounded' type="submit" disabled={pending}>
        {pending ? 'Submitting…' : 'Submit review'}
      </button>

      <p aria-live="polite">{state.message}</p>
    </form>
  );
};

export default ReviewForm;