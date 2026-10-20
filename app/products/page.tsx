import Image from "next/image"
import Link from "next/link"
import { getProducts } from "@/app/lib/catalogue"
import StarRating from "@/app/components/star-rating"

const priceFormatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Products</h1>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/products/${product.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-visible:outline-white"
            >
              <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-4 transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {product.category}
                </p>
                <h2 className="font-semibold leading-snug">{product.title}</h2>
                <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{product.description}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold">{priceFormatter.format(product.price)}</span>
                  <StarRating rating={product.rating} />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
