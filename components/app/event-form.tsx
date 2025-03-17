"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Event } from "@/types"

import { EventFormValues, eventSchema } from "@/config/schemas"
import { formatTimeInput } from "@/lib/time"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface EventFormProps {
  event: Event
  onUpdate: (id: string, field: keyof Event, value: string) => void
  onRemove: (id: string) => void
  onMultiPaste: (text: string, id: string) => void
}

export function EventForm({
  event,
  onUpdate,
  onRemove,
  onMultiPaste,
}: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: event,
  })

  // Update form when event changes from parent
  useEffect(() => {
    form.reset(event)
  }, [event, form])

  // Handle field updates
  const handleNameChange = (value: string) => {
    // Check for multi-line paste - look for the specific event format
    if (
      value.includes("on") &&
      value.includes("at") &&
      (value.includes("\n") || value.includes("\r\n"))
    ) {
      // Pass the entire text for processing
      onMultiPaste(value, event.id)
      return
    }

    onUpdate(event.id, "name", value)
  }

  const handleTimeRangeChange = (value: string) => {
    const formattedValue = formatTimeInput(value)
    onUpdate(event.id, "timeRange", formattedValue)
  }

  return (
    <Form {...form}>
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Event name"
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-4">
          <FormField
            control={form.control}
            name="timeRange"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="3:15 AM - 5:00 PM"
                    onChange={(e) => handleTimeRangeChange(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} readOnly placeholder="Duration" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-1 flex justify-end">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(event.id)}
            className="h-8 w-8"
          >
            <Icons.trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Form>
  )
}
