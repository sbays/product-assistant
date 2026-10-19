'use client'
import React, { useActionState } from 'react';
import { addReviewAction, ReviewFormState } from './actions';

const initialState: ReviewFormState = { ok: false }

const fieldClass = 'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-300'
const labelClass = 'mb-1 block text-sm font-medium'
const errorClass = 'mt-1 text-sm text-red-600 dark:text-red-400'

const ReviewForm = ({ productId }: { productId: string }) => {
  const [state, formAction, pending] = useActionState(addReviewAction.bind(null, productId), initialState)
  return (
    <form
      action={formAction}
      aria-labelledby="review-form-heading"
      className="flex h-fit flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 id="review-form-heading" className="text-lg font-semibold">Write a review</h2>

      <div>
        <label htmlFor="reviewerName" className={labelClass}>Name</label>
        <input
          className={fieldClass}
          type="text"
          id="reviewerName"
          name="reviewerName"
          aria-invalid={Boolean(state.errors?.reviewerName)}
          aria-describedby="reviewerName-error"
        />
        <p id="reviewerName-error" className={errorClass}>{state.errors?.reviewerName?.[0]}</p>
      </div>

      <div>
        <label htmlFor="rating" className={labelClass}>Rating</label>
        <select id="rating" name="rating" defaultValue="5" className={fieldClass}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="comment" className={labelClass}>Comment</label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          className={fieldClass}
          aria-invalid={Boolean(state.errors?.comment)}
          aria-describedby="comment-error"
        />
        <p id="comment-error" className={errorClass}>{state.errors?.comment?.[0]}</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? 'Submitting…' : 'Submit review'}
      </button>

      <p
        aria-live="polite"
        className={`text-sm ${state.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
      >
        {state.message}
      </p>
    </form>
  );
};

export default ReviewForm;
