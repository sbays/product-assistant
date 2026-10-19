import Stock from "@/app/components/stock";
import ProductDetails from "../product-details"
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import ReviewForm from "./review-form";
import Reviews from "./reviews";

export default async function ProductPage(props: PageProps<'/products/[id]'>) {

  return (
    <div>
      <h1 className="text-4xl underline">Product Page</h1>
      <Suspense fallback={<Skeleton />}>
        <ProductDetails params={props.params} />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <Stock params={props.params}></Stock>
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <Reviews params={props.params} />
      </Suspense>
    </div >
  )
}

export async function generateStaticParams() {
  const ids = ['1', '2', '3', '4', '5'];
  return ids.map((id) => ({
    id
  }))
}