import { describe, expect, it } from 'vitest'
import {
  type SportEvent,
  getEvent,
  getEvents,
  markAsRemoved,
  updateEvent,
} from '../eventStore'

describe('eventStore', () => {
  it('returns only non-REMOVED events', () => {
    const liveEvent: SportEvent = {
      id: 'live1',
      status: 'LIVE',
      scores: {},
      startTime: new Date().toISOString(),
      sport: 'BASKETBALL',
      competition: 'NBA',
      competitors: {
        HOME: { type: 'HOME', name: 'Lakers' },
        AWAY: { type: 'AWAY', name: 'Heat' },
      },
    }

    const removedEvent: SportEvent = {
      ...liveEvent,
      id: 'removed1',
      status: 'REMOVED',
    }

    updateEvent(liveEvent.id, liveEvent)
    updateEvent(removedEvent.id, removedEvent)

    const events = getEvents()

    expect(events[liveEvent.id]).toEqual(liveEvent)
    expect(events[removedEvent.id]).toBeUndefined()
  })

  it('marks events as REMOVED', () => {
    const event: SportEvent = {
      id: 'event2',
      status: 'LIVE',
      scores: {},
      startTime: new Date().toISOString(),
      sport: 'FOOTBALL',
      competition: 'UEFA',
      competitors: {
        HOME: { type: 'HOME', name: 'Team C' },
        AWAY: { type: 'AWAY', name: 'Team D' },
      },
    }

    updateEvent(event.id, event)
    markAsRemoved(event)

    expect(getEvents().event2).toBeUndefined()
  })

  it('adds or updates an event', () => {
    const event: SportEvent = {
      id: 'event1',
      status: 'LIVE',
      scores: {},
      startTime: new Date().toISOString(),
      sport: 'FOOTBALL',
      competition: 'UEFA',
      competitors: {
        HOME: { type: 'HOME', name: 'Team A' },
        AWAY: { type: 'AWAY', name: 'Team B' },
      },
    }

    updateEvent(event.id, event)
    const events = getEvents()

    expect(events[event.id]).toEqual(event)
  })

  it('gets signle event', () => {
    const event: SportEvent = {
      id: 'event1',
      status: 'LIVE',
      scores: {},
      startTime: new Date().toISOString(),
      sport: 'FOOTBALL',
      competition: 'UEFA',
      competitors: {
        HOME: { type: 'HOME', name: 'Team A' },
        AWAY: { type: 'AWAY', name: 'Team B' },
      },
    }

    updateEvent(event.id, event)
    updateEvent(event.id, event)

    expect(getEvent(event.id)).toEqual(event)
    expect(getEvent('wrong-id')).toBeNull()
  })
})
