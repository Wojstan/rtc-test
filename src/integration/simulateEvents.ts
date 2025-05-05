import { fetchEventMappings } from '../api/mappingsClient'
import { fetchSimulationState } from '../api/stateClient'
import { decodeOdds } from '../lib/decodeOdds'
import {
  type SportEvent,
  markAsRemoved,
  updateEvent,
} from '../store/eventStore'

let lastSeenIds = new Set<string>()

export async function simulateEvents(): Promise<void> {
  const { odds } = await fetchSimulationState()
  const { mappings } = await fetchEventMappings()

  const newEvents = decodeOdds(odds, mappings)
  const newIds = new Set<string>()

  for (const event of Object.values(newEvents)) processEvent(event, newIds)

  processRemovedEvents(newIds)
}

function processEvent(event: SportEvent, newIds: Set<string>): void {
  const { id } = event

  newIds.add(id)

  updateEvent(id, event)
}

function processRemovedEvents(newIds: Set<string>) {
  const removedIds = [...lastSeenIds].filter((id) => !newIds.has(id))
  markAsRemoved(removedIds)
  lastSeenIds = newIds
}
