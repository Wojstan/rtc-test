import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SportEvent } from '../../store/eventStore'
import { logLiveChanges, logRemovedStatusChange } from '../logChanges'

const baseEvent: SportEvent = {
  id: 'test-id',
  status: 'LIVE',
  startTime: '2025-05-01T12:00:00Z',
  sport: 'FOOTBALL',
  competition: 'Premier League',
  scores: {
    CURRENT: { type: 'CURRENT', home: '1', away: '0' },
  },
  competitors: {
    HOME: { type: 'HOME', name: 'Team A' },
    AWAY: { type: 'AWAY', name: 'Team B' },
  },
}

describe('logChanges', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('logs score change', () => {
    const updated: SportEvent = {
      ...baseEvent,
      scores: {
        CURRENT: { type: 'CURRENT', home: '2', away: '1' },
      },
    }

    logLiveChanges(baseEvent, updated)

    expect(consoleSpy).toHaveBeenCalledWith(
      'Score changed for test-id [CURRENT]: 1:0 → 2:1',
    )
  })

  it('logs added score period', () => {
    const updated: SportEvent = {
      ...baseEvent,
      scores: {
        ...baseEvent.scores,
        PERIOD_1: { type: 'PERIOD_1', home: '1', away: '0' },
      },
    }

    logLiveChanges(baseEvent, updated)

    expect(consoleSpy).toHaveBeenCalledWith(
      'New score period "PERIOD_1" added for test-id: 1:0',
    )
  })

  it('logs status change', () => {
    const updated: SportEvent = {
      ...baseEvent,
      status: 'REMOVED',
    }

    logLiveChanges(baseEvent, updated)

    expect(consoleSpy).toHaveBeenCalledWith(
      'Status changed for test-id: LIVE → REMOVED',
    )
  })

  it('logs both status and score changes', () => {
    const updated: SportEvent = {
      ...baseEvent,
      status: 'PRE',
      scores: {
        CURRENT: { type: 'CURRENT', home: '3', away: '3' },
      },
    }

    logLiveChanges(baseEvent, updated)

    expect(consoleSpy).toHaveBeenCalledWith(
      'Score changed for test-id [CURRENT]: 1:0 → 3:3',
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'Status changed for test-id: LIVE → PRE',
    )
  })

  it('logs nothing if nothing changes', () => {
    logLiveChanges(baseEvent, { ...baseEvent })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('logs REMOVED status change', () => {
    const event: SportEvent = {
      ...baseEvent,
      status: 'LIVE',
      scores: {
        CURRENT: { type: 'CURRENT', home: '3', away: '3' },
      },
    }

    logRemovedStatusChange(event)

    expect(consoleSpy).toHaveBeenCalledWith(
      'Status changed for test-id: LIVE → REMOVED',
    )
  })
})
