"use client"

import { formatDuration } from "@/lib/time"
import { useEventCalculator } from "@/hooks/use-event-calculator"

import { EventForm } from "@/components/app/event-form"
import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function EventDurationCalculator() {
  const {
    events,
    totalDuration,
    addEvent,
    removeEvent,
    updateEvent,
    processMultipleEvents,
  } = useEventCalculator()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Duration Calculator</CardTitle>
        <CardDescription>
          Add your events with name and time range. You can paste multiple
          events at once into the name field.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-2 grid grid-cols-12 gap-4 text-sm font-medium">
          <div className="col-span-5">Event Name</div>
          <div className="col-span-4">Time Range</div>
          <div className="col-span-2">Duration</div>
          <div className="col-span-1"></div>
        </div>

        {events.map((event) => (
          <EventForm
            key={event.id}
            event={event}
            onUpdate={updateEvent}
            onRemove={removeEvent}
            onMultiPaste={processMultipleEvents}
          />
        ))}

        <Button onClick={addEvent} variant="outline" className="w-full">
          <Icons.add className="mr-2 h-4 w-4" />
          Add Another Event
        </Button>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Total Duration</h3>
          <div className="text-lg font-bold">
            {formatDuration(totalDuration)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
