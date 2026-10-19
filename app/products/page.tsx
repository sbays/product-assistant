import { getProduct, getProducts } from "@/app/lib/catalogue"

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <div>
      <h2 className="text-4xl underline">Products</h2>
      {products.map((product) => (
        <div key={product.id}>
          <h2>Product {product?.title}</h2>
          <p>{product?.description}</p>
        </div>
      ))}
    </div>
  )
}

