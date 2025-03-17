import { z } from "zod"

export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  timeRange: z.string().optional(),
  duration: z.string(),
  durationMinutes: z.number(),
})

export type EventFormValues = z.infer<typeof eventSchema>
