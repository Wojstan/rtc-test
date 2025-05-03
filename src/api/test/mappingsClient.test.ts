import { type Mock, describe, expect, it, vi } from 'vitest'
import { fetchEventMappings } from '../mappingsClient'

describe('mappingsClient', () => {
  it('fetches data from the api', async () => {
    const { mappings } = await fetchEventMappings()

    expect(typeof mappings).toBe('string')
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

    await expect(fetchEventMappings()).rejects.toThrow(
      'Failed to fetch state: Internal Server Error',
    )
  })
})
