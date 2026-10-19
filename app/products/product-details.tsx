
import { getProduct, Product } from "@/app/lib/catalogue"
import { notFound } from "next/navigation";


export default async function ProductDetails({ params }: {
  params: Promise<{
    id: string;
  }>
}) {

  const { id } = await params
  const product = await getProduct(id);
  if (!product) notFound()
  return (
    <div>

      <h1 className="text-xl">Product: {product?.title}</h1>
      <p>{product?.description}</p>

    </div>
  )
}

