'use server'

import { addReview } from "@/app/lib/review-store"
import { updateTag } from "next/cache"
import { z } from "zod"



const ReviewSchema = z.object({
  reviewerName: z.string().trim().min(1, 'Name is required'),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(1, 'Comment is required')
})

export type ReviewFormState = {
  ok: boolean,
  message?: string,
  errors?: Partial<Record<keyof z.infer<typeof ReviewSchema>, string[]>>
}

export async function addReviewAction(
  productId: string,
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  console.log({ productId });
  const id = z.string().regex(/^\d+$/).safeParse(productId);
  console.log({ err: id.error });
  if (!id.success) return { ok: false, message: 'Unknown product' }

  const parsed = ReviewSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors }
  }

  addReview(id.data, { ...parsed.data, date: new Date().toISOString() })
  updateTag(`product-${id.data}`)
  return { ok: true, message: "Thanks for your review!" }
}