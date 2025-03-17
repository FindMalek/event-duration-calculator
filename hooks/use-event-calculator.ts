"use client"

import { useEffect, useState } from "react"

import type { Event } from "@/types"

import { formatDuration, parseTimeToMinutes } from "@/lib/time"

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
    // Check if this is a paste into the name field that contains time information
    if (field === "name") {
      // Try to match the full event format: Event Name on Date at Start Time - End Time
      const eventRegex =
        /(.*) on (.*) at ([\d:]+\s*[AP]M)\s*-\s*([\d:]+\s*[AP]M)/i
      const match = value.match(eventRegex)

      if (match) {
        const [_, name, date, startTime, endTime] = match
        const timeRange = `${startTime.trim()} - ${endTime.trim()}`

        // Update the events array with parsed values
        const updatedEvents = events.map((event) => {
          if (event.id === id) {
            // Calculate duration
            try {
              const start = parseTimeToMinutes(startTime.trim())
              const end = parseTimeToMinutes(endTime.trim())

              let durationMins = end - start
              if (durationMins < 0) durationMins += 24 * 60 // Handle overnight events

              return {
                ...event,
                name: name.trim(),
                timeRange: timeRange,
                duration: formatDuration(durationMins),
                durationMinutes: durationMins,
              }
            } catch (error) {
              return {
                ...event,
                name: name.trim(),
                timeRange: timeRange,
                duration: "",
                durationMinutes: 0,
              }
            }
          }
          return event
        })

        setEvents(updatedEvents)
        return
      }
    }

    // Original code for regular updates
    const updatedEvents = events.map((event) => {
      if (event.id === id) {
        const updatedEvent = { ...event, [field]: value }

        // If timeRange is updated, calculate duration
        if (field === "timeRange") {
          const [startTime, endTime] = value.split(" - ").map((t) => t.trim())
          if (startTime && endTime) {
            try {
              const start = parseTimeToMinutes(startTime)
              const end = parseTimeToMinutes(endTime)

              let durationMins = end - start
              if (durationMins < 0) durationMins += 24 * 60 // Handle overnight events

              updatedEvent.durationMinutes = durationMins
              updatedEvent.duration = formatDuration(durationMins)
            } catch (error) {
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
    // Split the text by line breaks and filter out empty lines
    const lines = text
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line) => line.trim())

    if (lines.length === 0) return

    const eventRegex =
      /(.*) on (.*) at ([\d:]+\s*[AP]M)\s*-\s*([\d:]+\s*[AP]M)/i
    const parsedEvents: Event[] = []

    // Process each line that matches the event pattern
    lines.forEach((line, index) => {
      const match = line.match(eventRegex)
      if (!match) return

      const [_, name, date, startTime, endTime] = match
      const timeRange = `${startTime.trim()} - ${endTime.trim()}`

      try {
        const start = parseTimeToMinutes(startTime.trim())
        const end = parseTimeToMinutes(endTime.trim())

        let durationMins = end - start
        if (durationMins < 0) durationMins += 24 * 60

        parsedEvents.push({
          id: index === 0 ? currentId : Date.now() + "-" + index,
          name: name.trim(),
          timeRange: timeRange,
          duration: formatDuration(durationMins),
          durationMinutes: durationMins,
        })
      } catch (error) {
        parsedEvents.push({
          id: index === 0 ? currentId : Date.now() + "-" + index,
          name: name.trim(),
          timeRange: timeRange,
          duration: "",
          durationMinutes: 0,
        })
      }
    })

    if (parsedEvents.length === 0) return

    // Replace the current event with the first parsed event
    // and add the rest as new events
    const otherEvents = events.filter((e) => e.id !== currentId)
    setEvents([...parsedEvents, ...otherEvents])
  }

  // Calculate total duration whenever events change
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
