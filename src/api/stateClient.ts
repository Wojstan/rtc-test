import { API_URL } from './url'

interface EventSimulation {
  odds: string
}

export async function fetchSimulationState(): Promise<EventSimulation> {
  const res = await fetch(`${API_URL}/api/state`)

  if (!res.ok) throw new Error(`Failed to fetch state: ${res.statusText}`)

  const data = await res.json()

  return data
}
