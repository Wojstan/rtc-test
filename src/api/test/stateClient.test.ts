import { describe, expect, it, vi, type Mock } from 'vitest'
import { fetchSimulationState } from '../stateClient'

describe('stateClient', () => {
  it('fetches data from the api', async () => {
    const simulationState = await fetchSimulationState()

    expect(typeof simulationState.odds).toBe('string')
  })

  it('throws an error when response is not ok', async () => {
    global.fetch = Object.assign(vi.fn(), {
      preconnect: vi.fn(),
    }) as typeof fetch

    const mockResponse = {
      ok: false,
      statusText: 'Internal Server Error',
    }
    ;(fetch as unknown as Mock).mockResolvedValue(mockResponse)

    await expect(fetchSimulationState()).rejects.toThrow(
      'Failed to fetch state: Internal Server Error',
    )
  })
})
