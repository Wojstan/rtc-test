import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchEventMappings } from '../../api/mappingsClient'
import { fetchSimulationState } from '../../api/stateClient'
import { testMappings } from '../../lib/test/__mockDecodeData__'
import { getEvents } from '../../store/eventStore'
import { processEvents } from '../processEvents'
import { newTestOdd, testOdd, updatedTestOdd } from './__mockProcessData__'

vi.mock('../../api/mappingsClient', () => ({
  fetchEventMappings: vi.fn(),
}))

vi.mock('../../api/stateClient', () => ({
  fetchSimulationState: vi.fn(),
}))

describe('processEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('processes new events', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const eventId = '4feb31b5-88ee-4c59-96aa-e8bbec7a366b'

    // FIRST CYCLE
    ;(fetchSimulationState as Mock).mockResolvedValue({
      odds: testOdd,
    })
    ;(fetchEventMappings as Mock).mockResolvedValue(testMappings)

    await processEvents()

    let events = getEvents()

    expect(Object.keys(events)).toContain(eventId)
    expect(events[eventId].scores).toStrictEqual({
      CURRENT: {
        away: '5',
        home: '6',
        type: 'CURRENT',
      },
    })
    expect(events[eventId].status).toEqual('PRE')

    // SECOND CYCLE
    ;(fetchSimulationState as Mock).mockResolvedValue({
      odds: updatedTestOdd,
    })
    await processEvents()
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
    expect(events[eventId].status).toEqual('LIVE')
    expect(consoleSpy).toHaveBeenCalledWith(
      'Score changed for 4feb31b5-88ee-4c59-96aa-e8bbec7a366b [CURRENT]: 6:5 → 7:5',
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'New score period "PERIOD_1" added for 4feb31b5-88ee-4c59-96aa-e8bbec7a366b: 6:5',
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'New score period "PERIOD_2" added for 4feb31b5-88ee-4c59-96aa-e8bbec7a366b: 6:5',
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'Status changed for 4feb31b5-88ee-4c59-96aa-e8bbec7a366b: PRE → LIVE',
    )

    // THIRD CYCLE
    ;(fetchSimulationState as Mock).mockResolvedValue({
      odds: newTestOdd,
    })
    await processEvents()
    events = getEvents()

    expect(events[eventId]).toBeUndefined()
  })
})
