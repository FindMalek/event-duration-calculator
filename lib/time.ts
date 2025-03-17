export function formatTimeInput(value: string): string {
  // Remove any non-digit, non-colon, non-space, non-hyphen, non-AM/PM characters
  let formatted = value.replace(/[^0-9:\s\-AaPpMm]/g, "")

  // Try to format as a time range (HH:MM AM - HH:MM PM)
  if (formatted.includes("-")) {
    const [start, end] = formatted.split("-").map((t) => t.trim())
    const formattedStart = formatTimeWithAmPm(start)
    const formattedEnd = formatTimeWithAmPm(end)

    formatted = `${formattedStart} - ${formattedEnd}`
  } else {
    // User might be typing the first time
    formatted = formatTimeWithAmPm(formatted)
  }

  return formatted
}

export function formatTimeWithAmPm(time: string): string {
  // If empty, return as is
  if (!time) return time

  // Extract AM/PM if present
  let ampm = ""
  if (time.toUpperCase().includes("A")) {
    ampm = "AM"
    time = time.replace(/[aA][mM]?/g, "")
  } else if (time.toUpperCase().includes("P")) {
    ampm = "PM"
    time = time.replace(/[pP][mM]?/g, "")
  }

  // Format the time part (HH:MM)
  time = time.trim()
  const parts = time.split(":")

  if (parts.length === 1) {
    // Only hours provided
    const hours = parts[0].replace(/\D/g, "")
    if (hours) {
      time = `${hours}:00`
    }
  } else if (parts.length >= 2) {
    // Hours and minutes provided
    const hours = parts[0].replace(/\D/g, "")
    let minutes = parts[1].replace(/\D/g, "")

    // Ensure minutes has 2 digits
    if (minutes.length === 1) {
      minutes = minutes + "0"
    } else if (minutes.length > 2) {
      minutes = minutes.substring(0, 2)
    }

    if (hours) {
      time = `${hours}:${minutes}`
    }
  }

  // Add AM/PM if present
  if (ampm) {
    time = `${time} ${ampm}`
  }

  return time
}

export function parseTimeToMinutes(timeStr: string): number {
  console.log("Parsing time:", timeStr)

  // Handle "noon" as 12:00 PM
  if (timeStr.toLowerCase().includes("noon")) {
    console.log("Noon detected, converting to 12:00 PM")
    return 12 * 60 // 12:00 PM in minutes
  }

  // Normalize the time string - remove spaces and convert to uppercase
  timeStr = timeStr.toUpperCase().replace(/\s+/g, "")

  // Detect AM/PM
  const isPM = timeStr.includes("PM") || timeStr.includes("P.M.")
  const isAM = timeStr.includes("AM") || timeStr.includes("A.M.")

  // Remove AM/PM and other non-digit, non-colon characters
  timeStr = timeStr.replace(/[APM.]+/g, "").replace(/[^\d:]/g, "")

  // Parse hours and minutes
  let hours = 0
  let minutes = 0

  if (timeStr.includes(":")) {
    // Format is HH:MM
    const [hoursStr, minutesStr] = timeStr.split(":")
    hours = parseInt(hoursStr, 10)
    minutes = parseInt(minutesStr, 10)
  } else {
    // Format is just hours (e.g., "9" for 9:00)
    hours = parseInt(timeStr, 10)
    minutes = 0
  }

  // Handle invalid values
  if (isNaN(hours)) hours = 0
  if (isNaN(minutes)) minutes = 0

  // Calculate total minutes
  let totalMinutes = hours * 60 + minutes

  // Adjust for PM
  if (isPM && hours < 12) {
    totalMinutes += 12 * 60
  }

  // Adjust for 12 AM (midnight)
  if (isAM && hours === 12) {
    totalMinutes -= 12 * 60
  }

  console.log(
    `Parsed time: ${hours}:${minutes} ${isPM ? "PM" : isAM ? "AM" : ""} = ${totalMinutes} minutes`
  )

  return totalMinutes
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  // Format with two digits for minutes
  return `${hours} h ${mins.toString().padStart(2, "0")} min`
}

/**
 * Normalizes a time string, handling "noon" conversion to "12:00 PM"
 */
export function normalizeTimeString(timeStr: string): string {
  return timeStr.toLowerCase().includes("noon")
    ? timeStr.replace(/noon/i, "12:00 PM")
    : timeStr
}

/**
 * Calculates the duration in minutes between two time strings, handling overnight events
 */
export function calculateDuration(
  startTimeStr: string,
  endTimeStr: string
): number {
  const normalizedStartTime = normalizeTimeString(startTimeStr)
  const normalizedEndTime = normalizeTimeString(endTimeStr)

  const start = parseTimeToMinutes(normalizedStartTime)
  const end = parseTimeToMinutes(normalizedEndTime)

  let durationMins = end - start
  if (durationMins < 0) durationMins += 24 * 60 // Handle overnight events

  return durationMins
}

/**
 * Creates a formatted time range string from start and end times
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime.trim()} - ${endTime.trim()}`
}

/**
 * Checks if a string matches the event format pattern (contains " on ", " at ", and " - ")
 */
export function isEventFormatString(text: string): boolean {
  return (
    text.includes(" on ") &&
    text.includes(" at ") &&
    text.includes(" - ") &&
    !text.includes("\n") &&
    !text.includes("\r")
  )
}

/**
 * Parses a single event string and returns the extracted components
 * Returns null if parsing fails
 */
export function parseEventString(eventString: string): {
  name: string
  date: string
  startTime: string
  endTime: string
} | null {
  try {
    // Normalize spacing
    const normalizedString = eventString.replace(/\s+/g, " ").trim()

    // Step 1: Split by " on " to get the name and the rest
    const onSplit = normalizedString.split(" on ")
    if (onSplit.length < 2) return null

    const eventName = onSplit[0].trim()
    const restAfterOn = onSplit.slice(1).join(" on ")

    // Step 2: Split by " at " to get the date and time part
    const atSplit = restAfterOn.split(" at ")
    if (atSplit.length < 2) return null

    const eventDate = atSplit[0].trim()
    const timePart = atSplit.slice(1).join(" at ")

    // Step 3: Split by " - " to get start and end times
    const timeSplit = timePart.split(" - ")
    if (timeSplit.length < 2) return null

    const startTime = timeSplit[0].trim()
    let endTime = timeSplit[1].trim()

    // Handle case where there might be HTML or other content after the end time
    const htmlTagIndex = endTime.indexOf("<")
    if (htmlTagIndex > 0) {
      endTime = endTime.substring(0, htmlTagIndex).trim()
    }

    return {
      name: eventName,
      date: eventDate,
      startTime,
      endTime,
    }
  } catch (error) {
    console.error("Error parsing event string:", error)
    return null
  }
}

/**
 * Cleans text with HTML content, removing HTML tags while preserving content
 */
export function cleanHtmlFromText(text: string): string {
  const segments = text.split(/(<[^>]+>)/g).filter(Boolean)

  let cleanText = ""
  let inHtmlBlock = false

  for (const segment of segments) {
    if (segment.startsWith("<") && !segment.startsWith("</")) {
      inHtmlBlock = true
    } else if (segment.startsWith("</")) {
      inHtmlBlock = false
    } else if (!inHtmlBlock && !segment.startsWith("<")) {
      cleanText += segment + " "
    }
  }

  return cleanText.trim()
}

/**
 * Preprocesses text to identify and separate multiple events
 * Restores line breaks and handles HTML content
 */
export function preprocessEventText(text: string): string {
  let processedText = text

  // When pasting multi-line text into an input, browsers often convert newlines to spaces
  // We can try to restore these by looking for patterns like "PM ☕" or "PM ♒" (end of one event, start of another)
  // Non-ASCII characters (like emojis) often mark the beginning of a new event
  processedText = processedText.replace(
    /(\d\s*(?:AM|PM|noon))\s+([^\x00-\x7F])/gi,
    "$1\n$2"
  )

  // Also look for patterns like "PM Web" or "PM Daily" (end of one event, start of another)
  processedText = processedText.replace(
    /(\d\s*(?:AM|PM|noon))\s+([A-Z][a-z]+)/g,
    "$1\n$2"
  )

  // Split on multiple spaces following date patterns
  processedText = processedText.replace(/(\d{4})\s{2,}/g, "$1\n")

  // Important: Add line breaks before HTML tags which indicate descriptions
  processedText = processedText.replace(
    /([^\n])\s*(<(?:p|ul|ol|li|div|span|h\d)[\s>])/gi,
    "$1\n$2"
  )

  // And add line breaks after HTML content before new events
  processedText = processedText.replace(/(>)\s+([^\x00-\x7F])/g, "$1\n$2")
  processedText = processedText.replace(
    /(<\/(?:p|ul|ol|li|div|span|h\d)>)\s+([A-Z0-9]|[^\x00-\x7F])/gi,
    "$1\n$2"
  )

  // Normalize any existing line breaks
  return processedText.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
}

/**
 * Regular expression pattern to match events in text
 */
export const EVENT_PATTERN =
  /([^\n]+?)\s+on\s+([^\n]+?)\s+at\s+([^\n]+?)\s+-\s+([^\n]+)/g

/**
 * Extracts multiple events from text, handling various formats and HTML content
 * Returns an array of parsed events with their components
 */
export function extractEventsFromText(text: string): Array<{
  name: string
  date: string
  startTime: string
  endTime: string
}> {
  // First preprocess the text to handle line breaks and HTML
  const processedText = preprocessEventText(text)

  // Try parsing by lines first
  const chunks = processedText.split("\n")

  // Filter out chunks that are HTML descriptions (start with '<')
  const nonHtmlChunks = chunks.filter((chunk) => {
    const trimmed = chunk.trim()
    return trimmed && !trimmed.startsWith("<")
  })

  // Filter chunks to only include those that look like events
  const eventChunks = nonHtmlChunks.filter((chunk) =>
    isEventFormatString(chunk)
  )

  const events: Array<{
    name: string
    date: string
    startTime: string
    endTime: string
  }> = []

  // Try parsing each chunk as an event
  eventChunks.forEach((chunk) => {
    const parsed = parseEventString(chunk)
    if (parsed) {
      events.push(parsed)
    }
  })

  // If we couldn't parse any events using line-by-line approach, try using regex
  if (events.length === 0) {
    // Clean any HTML from the text first
    const cleanText = cleanHtmlFromText(text)

    // Use regex to match event patterns
    const matches = [...cleanText.matchAll(EVENT_PATTERN)]

    matches.forEach((match) => {
      const [_, eventName, eventDate, startTime, endTime] = match
      events.push({
        name: eventName.trim(),
        date: eventDate.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
      })
    })
  }

  return events
}
