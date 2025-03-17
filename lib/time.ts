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
  // Normalize the time string
  timeStr = timeStr.toUpperCase().replace(/\s+/g, "")

  const isPM = timeStr.includes("PM")
  const isAM = timeStr.includes("AM")

  // Remove AM/PM
  timeStr = timeStr.replace(/[APM]+/g, "")

  const [hours, minutes] = timeStr.split(":").map(Number)

  let totalMinutes = hours * 60 + (minutes || 0)

  // Adjust for PM
  if (isPM && hours < 12) {
    totalMinutes += 12 * 60
  }

  // Adjust for 12 AM
  if (isAM && hours === 12) {
    totalMinutes -= 12 * 60
  }

  return totalMinutes
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  // Format with two digits for minutes
  return `${hours} h ${mins.toString().padStart(2, "0")} min`
}
