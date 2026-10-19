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

  return (
    <div className='border rounded p-3 my-3 inline-flex'>
      Stock: {product.stock}
    </div>
  );
};
