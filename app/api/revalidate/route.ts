import { timingSafeEqual } from "crypto";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  if (!process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Server misconfigured' }, { status: 500 })
  }
  const provided = request.headers.get('x-revalidate-secret');
  if (!provided) return Response.json({
    status: 401
  })
  const expected = process.env.REVALIDATE_SECRET;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  const matches = a.length === b.length && timingSafeEqual(a, b)
  if (!matches) {
    return Response.json({ status: 401 })
  }

  revalidateTag('products', 'max')
  return Response.json({ revalidated: true, now: Date.now() })
}