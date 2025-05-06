import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchSimulationState } from '../stateClient'

describe('stateClient', () => {
  global.fetch = Object.assign(vi.fn(), {
    preconnect: vi.fn(),
  }) as typeof fetch

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets mocked data', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ odds: 'test-odds' }),
    }
    ;(fetch as unknown as Mock).mockResolvedValue(mockResponse)

    const result = await fetchSimulationState()

    expect(result).toEqual({ odds: 'test-odds' })
  })

  it('throws an error when response is not ok', async () => {
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
