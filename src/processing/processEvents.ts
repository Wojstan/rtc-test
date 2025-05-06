import { fetchEventMappings } from '../api/mappingsClient'
import { fetchSimulationState } from '../api/stateClient'
import { decodeOdds } from '../lib/decodeOdds'
import { logLiveChanges, logRemovedStatusChange } from '../lib/logChanges'
import {
  type SportEvent,
  getEvent,
  markAsRemoved,
  updateEvent,
} from '../store/eventStore'

let lastSeenIds = new Set<string>()

export async function processEvents(): Promise<void> {
  try {
    const { odds } = await fetchSimulationState()
    const { mappings } = await fetchEventMappings()

    const newEvents = decodeOdds(odds, mappings)
    const newIds = new Set<string>()

    for (const event of Object.values(newEvents)) processEvent(event, newIds)

    processRemovedEvents(newIds)
  } catch (error) {
    console.error(`[processEvents] Error: ${(error as Error).message}`)
  }
}

function processEvent(event: SportEvent, newIds: Set<string>): void {
  const { id } = event
  newIds.add(id)

  const prevEvent = getEvent(id)
  prevEvent && logLiveChanges(prevEvent, event)
  updateEvent(id, event)
}

function processRemovedEvents(newIds: Set<string>) {
  for (const id of lastSeenIds) {
    if (!newIds.has(id)) {
      const event = getEvent(id) as SportEvent
      logRemovedStatusChange(event)
      markAsRemoved(event)
    }
  }

  lastSeenIds = newIds
}
