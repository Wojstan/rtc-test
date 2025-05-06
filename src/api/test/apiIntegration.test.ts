import { describe, expect, it } from 'vitest'
import { fetchEventMappings } from '../mappingsClient'
import { fetchSimulationState } from '../stateClient'

// Use when simulation API is online
describe.skip('apiIntegration', () => {
  it('fetches data from the api', async () => {
    const { mappings } = await fetchEventMappings()

    expect(typeof mappings).toBe('string')
  })

  it('fetches data from the api', async () => {
    const simulationState = await fetchSimulationState()

    expect(typeof simulationState.odds).toBe('string')
  })
})
