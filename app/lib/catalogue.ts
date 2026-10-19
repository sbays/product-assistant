import 'server-only';
import data from '../../data/products-safe.json'
import { cacheLife, cacheTag } from 'next/cache';
import { getAddedReviews } from './review-store';

export type Product = (typeof data.products[number])

function timeout(ms: number) {
  return new Promise((res, rej) => setTimeout(res, ms))
}

export async function getProducts() {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  return data.products;
}

export async function getProduct(id: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  cacheTag(`product-${id}`)
  return data.products.find(product => product.id === Number(id))
}

export async function searchProducts(query: string, category: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  return data.products.filter((product) => {
    return product.title.includes(query) || product.description.includes(query) || product.tags.includes(category)
  });

}

export async function getReviews(productId: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  cacheTag(`product-${productId}`)
  const base = data.products.find(product => product.id === Number(productId))?.reviews ?? []
  return [...base, ...getAddedReviews(productId)]

}
