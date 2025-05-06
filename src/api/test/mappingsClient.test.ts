import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchEventMappings } from '../mappingsClient'

describe('mappingsClient', () => {
  global.fetch = Object.assign(vi.fn(), {
    preconnect: vi.fn(),
  }) as typeof fetch

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets mocked data', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ mappings: 'test-mappings' }),
    }
    ;(fetch as unknown as Mock).mockResolvedValue(mockResponse)

    const result = await fetchEventMappings()

    expect(result).toEqual({ mappings: 'test-mappings' })
  })

  it('throws an error when response is not ok', async () => {
    const mockResponse = {
      ok: false,
      statusText: 'Internal Server Error',
    }
    ;(fetch as unknown as Mock).mockResolvedValue(mockResponse)

    await expect(fetchEventMappings()).rejects.toThrow(
      'Failed to fetch mappings: Internal Server Error',
    )
  })
})
