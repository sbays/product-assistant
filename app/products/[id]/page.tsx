import Stock from "@/app/components/stock";
import ProductDetails from "../product-details"
import { Suspense } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import Reviews from "./reviews";

export default async function ProductPage(props: PageProps<'/products/[id]'>) {

  return (
    <div className="flex flex-col gap-10">
      <Link
        href="/products"
        className="self-start text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <span aria-hidden="true">← </span>Back to products
      </Link>
      <Suspense fallback={<Skeleton height={400} borderRadius={16} />}>
        <ProductDetails params={props.params} />
      </Suspense>
      <Suspense fallback={<Skeleton width={140} height={28} borderRadius={999} />}>
        <Stock params={props.params}></Stock>
      </Suspense>
      <Suspense fallback={<Skeleton count={3} height={80} borderRadius={16} className="mb-3" />}>
        <Reviews params={props.params} />
      </Suspense>
    </div>
  )
}

export async function generateStaticParams() {
  const ids = ['1', '2', '3', '4', '5'];
  return ids.map((id) => ({
    id
  }))
}
