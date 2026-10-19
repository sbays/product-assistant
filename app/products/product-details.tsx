import Image from "next/image"
import { getProduct } from "@/app/lib/catalogue"
import { notFound } from "next/navigation";
import StarRating from "@/app/components/star-rating";

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default async function ProductDetails({ params }: {
  params: Promise<{
    id: string;
  }>
}) {

  const { id } = await params
  const product = await getProduct(id);
  if (!product) notFound()
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain p-8"
        />
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {product.brand ? `${product.brand} · ` : ''}{product.category}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.title}</h1>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <StarRating rating={product.rating} />
          <span>{product.rating.toFixed(1)}</span>
        </div>
        <p className="text-3xl font-semibold">{priceFormatter.format(product.price)}</p>
        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">{product.description}</p>
        <dl className="mt-2 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          {[
            ['Shipping', product.shippingInformation],
            ['Warranty', product.warrantyInformation],
            ['Returns', product.returnPolicy],
            ['SKU', product.sku],
          ].map(([term, detail]) => (
            <div key={term} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              <dt className="text-zinc-500 dark:text-zinc-400">{term}</dt>
              <dd className="font-medium">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
