import { API_URL } from './constants'

interface EventMapping {
  mappings: string
}

export async function fetchEventMappings(): Promise<EventMapping> {
  const res = await fetch(`${API_URL}/api/mappings`)

  if (!res.ok) throw new Error(`Failed to fetch mappings: ${res.statusText}`)

  const data = await res.json()

  return data
}
