export type Status = 'LIVE' | 'REMOVED' | 'PRE'

export interface Score {
  type: string
  home: string
  away: string
}

export interface SportEvent {
  id: string
  status: Status
  scores: Record<string, Score>
  startTime: string
  sport: string
  competitors: {
    HOME: { type: 'HOME' | 'AWAY'; name: string }
    AWAY: { type: 'HOME' | 'AWAY'; name: string }
  }
  competition: string
}

const events = new Map<string, SportEvent>()

export function getEvents(): { [k: string]: SportEvent } {
  return Object.fromEntries(
    [...events.entries()].filter(([_, event]) => event.status !== 'REMOVED'),
  )
}

export function getEvent(id: string): SportEvent | null {
  return events.get(id) || null
}

export function updateEvent(id: string, updated: SportEvent): void {
  events.set(id, updated)
}

export function markAsRemoved(event: SportEvent): void {
  event.status = 'REMOVED'
}
