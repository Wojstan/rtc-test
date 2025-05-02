interface MatchSimulation {
  odds: string
}

export async function fetchSimulationState(): Promise<MatchSimulation> {
  const res = await fetch('http://localhost:3000/api/state')

  if (!res.ok) throw new Error(`Failed to fetch state: ${res.statusText}`)

  const data = await res.json()

  return data
}
