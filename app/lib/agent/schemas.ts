import z from "zod";

export const comparisonSchema = z.object({
  products: z.array(
    z.object({
      id: z.number().int(),
      title: z.string(),
      price: z.number(),
      rating: z.number(),
      pros: z.array(z.string().max(80).describe('A short phrase stating a genuine advantage, based on the tool data')).max(3),
      cons: z.array(z.string().max(80).describe('A short phrase stating a genuine drawback, based on the tool data. Omit rather than guess.')).max(3),
    })
  ).min(2).max(4),
  recommendation: z.string().describe('One or two sentences on which suits which user')
})

export type Comparison = z.infer<typeof comparisonSchema>