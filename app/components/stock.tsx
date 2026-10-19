import React from 'react';
import { getProduct } from '../lib/catalogue';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';


export default async function Stock({ params }: {
  params: Promise<{
    id: string;
  }>
}) {
  await connection()
  const { id } = await params
  const product = await getProduct(id);
  if (!product) return notFound();

  const inStock = product.stock > 0
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${inStock
        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
        : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'}`}
    >
      <span aria-hidden="true" className={`size-2 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
      {inStock ? `${product.stock} in stock` : 'Out of stock'}
    </p>
  );
};
