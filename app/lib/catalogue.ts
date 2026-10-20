import 'server-only';
import data from '../../data/products-safe.json'
import { cacheLife, cacheTag } from 'next/cache';
import { getAddedReviews } from './review-store';
import * as products from '../lib/products';

export async function getProducts() {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  return products.getProducts()
}

export async function getProduct(id: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  cacheTag(`product-${id}`)
  return products.getProduct(id)
}


export async function searchProducts(options: products.SearchOptions) {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  return products.searchProducts(options)

}

export async function getReviews(productId: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  cacheTag(`product-${productId}`)
  return products.getReviews(productId)

}
