import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchEventMappings } from '../../api/mappingsClient'
import { fetchSimulationState } from '../../api/stateClient'
import { testMappings } from '../../lib/test/__mockDecodeData__'
import { getEvents } from '../../store/eventStore'
import { simulateEvents } from '../simulateEvents'
import { newTestOdd, testOdd, updatedTestOdd } from './__mockSimulateData__'

vi.mock('../../api/mappingsClient', () => ({
  fetchEventMappings: vi.fn(),
}))

vi.mock('../../api/stateClient', () => ({
  fetchSimulationState: vi.fn(),
}))

describe('simulateEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('processes new events', async () => {
    const eventId = '4feb31b5-88ee-4c59-96aa-e8bbec7a366b'
    ;(fetchSimulationState as Mock).mockResolvedValue({
      odds: testOdd,
    })
    ;(fetchEventMappings as Mock).mockResolvedValue(testMappings)

    await simulateEvents()

    let events = getEvents()

    expect(Object.keys(events)).toContain(eventId)
    expect(events[eventId].scores).toStrictEqual({
      CURRENT: {
        away: '5',
        home: '6',
        type: 'CURRENT',
      },
    })
    ;(fetchSimulationState as Mock).mockResolvedValue({
      odds: updatedTestOdd,
    })

    await simulateEvents()

    events = getEvents()

    expect(events[eventId].scores).toStrictEqual({
      CURRENT: {
        away: '5',
        home: '7',
        type: 'CURRENT',
      },
      PERIOD_1: {
        away: '5',
        home: '6',
        type: 'PERIOD_1',
      },
      PERIOD_2: {
        away: '5',
        home: '6',
        type: 'PERIOD_2',
      },
    })
    ;(fetchSimulationState as Mock).mockResolvedValue({
      odds: newTestOdd,
    })

    await simulateEvents()

    events = getEvents()

    expect(events[eventId]).toBeUndefined()
  })
})
