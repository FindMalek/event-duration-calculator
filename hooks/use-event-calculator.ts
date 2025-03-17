"use client"

import { useEffect, useState } from "react"

import type { Event } from "@/types"

import {
  calculateDuration,
  extractEventsFromText,
  formatDuration,
  formatTimeRange,
  isEventFormatString,
  parseEventString,
} from "@/lib/time"

export function useEventCalculator() {
  const [events, setEvents] = useState<Event[]>([
    { id: "1", name: "", timeRange: "", duration: "", durationMinutes: 0 },
  ])
  const [totalDuration, setTotalDuration] = useState(0)

  const addEvent = () => {
    const newId = Date.now().toString()
    setEvents([
      ...events,
      { id: newId, name: "", timeRange: "", duration: "", durationMinutes: 0 },
    ])
  }

  const removeEvent = (id: string) => {
    if (events.length === 1) {
      // If it's the last event, just clear it instead of removing
      setEvents([
        { id: "1", name: "", timeRange: "", duration: "", durationMinutes: 0 },
      ])
    } else {
      const updatedEvents = events.filter((event) => event.id !== id)
      setEvents(updatedEvents)
    }
  }

  const updateEvent = (id: string, field: keyof Event, value: string) => {
    // For name field updates, check if it matches our event format
    if (field === "name" && isEventFormatString(value)) {
      try {
        const parsedEvent = parseEventString(value)
        if (parsedEvent) {
          const { name, date, startTime, endTime } = parsedEvent
          const timeRange = formatTimeRange(startTime, endTime)
          const durationMins = calculateDuration(startTime, endTime)

          const updatedEvents = events.map((event) => {
            if (event.id === id) {
              return {
                ...event,
                name: name,
                timeRange: timeRange,
                duration: formatDuration(durationMins),
                durationMinutes: durationMins,
              }
            }
            return event
          })

          setEvents(updatedEvents)
          return
        }
      } catch (error) {
        console.error("Error parsing event from name:", error)
      }
    }

    const updatedEvents = events.map((event) => {
      if (event.id === id) {
        const updatedEvent = { ...event, [field]: value }

        if (field === "timeRange") {
          const [startTime, endTime] = value.split(" - ").map((t) => t.trim())
          if (startTime && endTime) {
            try {
              const durationMins = calculateDuration(startTime, endTime)
              updatedEvent.durationMinutes = durationMins
              updatedEvent.duration = formatDuration(durationMins)
            } catch (error) {
              console.error(
                "Error calculating duration for timeRange update:",
                error
              )
              updatedEvent.duration = ""
              updatedEvent.durationMinutes = 0
            }
          }
        }

        return updatedEvent
      }
      return event
    })

    setEvents(updatedEvents)
  }

  // Process multiple events pasted at once
  const processMultipleEvents = (text: string, currentId: string) => {
    // Use our utility function to extract events from text
    const parsedEventComponents = extractEventsFromText(text)

    if (parsedEventComponents.length === 0) {
      return
    }

    const parsedEvents: Event[] = parsedEventComponents.map(
      (eventComponent, index) => {
        const { name, date, startTime, endTime } = eventComponent
        const timeRange = formatTimeRange(startTime, endTime)
        const durationMins = calculateDuration(startTime, endTime)

        return {
          id: index === 0 ? currentId : `${Date.now()}-${index}`,
          name: name,
          timeRange: timeRange,
          duration: formatDuration(durationMins),
          durationMinutes: durationMins,
        }
      }
    )

    const otherEvents = events.filter((e) => e.id !== currentId)
    setEvents([...parsedEvents, ...otherEvents])
  }

  useEffect(() => {
    const total = events.reduce((sum, event) => sum + event.durationMinutes, 0)
    setTotalDuration(total)
  }, [events])

  return {
    events,
    totalDuration,
    addEvent,
    removeEvent,
    updateEvent,
    processMultipleEvents,
  }
}
