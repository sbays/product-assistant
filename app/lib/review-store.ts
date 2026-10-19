import 'server-only';

import type { Product } from './catalogue';

export type Review = Product['reviews'][number];

const added = new Map<string, Review[]>()

export function addReview(productId: string, review: Review) {
  added.set(productId, [...(added.get(productId) ?? []), review])
}

export function getAddedReviews(productId: string) {
  return added.get(productId) ?? []
}