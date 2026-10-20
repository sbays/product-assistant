import 'server-only';
import data from '../../data/products-safe.json'
import { cacheLife, cacheTag } from 'next/cache';
import { getAddedReviews } from './review-store';

export type Product = (typeof data.products[number])

function timeout(ms: number) {
  return new Promise((res, rej) => setTimeout(res, ms))
}

export type SortBy = 'rating' | 'price-asc' | 'price-desc';

export const CATEGORIES = [...new Set(data.products.map((p) => p.category))] as [string, ...string[]];

export type SearchOptions = {
  query?: string;
  category?: string;
  sortBy?: SortBy;
  limit?: number;
};

// "Phones" → "phone", so singular and plural both match
const toTerms = (query: string) =>
  query.toLowerCase().split(/\s+/).filter(Boolean).map((t) => t.replace(/s$/, ''));

const sorters: Record<SortBy, (a: Product, b: Product) => number> = {
  rating: (a, b) => b.rating - a.rating,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};
export async function getProducts() {
  return data.products;
}

export async function getProduct(id: string) {
  return data.products.find(product => product.id === Number(id))
}


export async function searchProducts({ query, category, sortBy, limit = 8 }: SearchOptions) {

  const terms = query ? toTerms(query) : [];

  const scored = data.products
    .filter((p) => !category || p.category === category)
    .map((p) => {
      if (terms.length === 0) return { p, score: 1 };
      const text = [p.title, p.brand ?? '', p.description, p.category, ...(p.tags ?? [])]
        .join(' ')
        .toLowerCase();
      return { p, score: terms.filter((t) => text.includes(t)).length };
    })
    .filter(({ score }) => score > 0);

  scored.sort((a, b) => (sortBy ? sorters[sortBy](a.p, b.p) : b.score - a.score));

  return { total: scored.length, products: scored.slice(0, limit).map(({ p }) => p) };

}

export async function getReviews(productId: string) {
  const base = data.products.find(product => product.id === Number(productId))?.reviews ?? []
  return [...base, ...getAddedReviews(productId)]

}
