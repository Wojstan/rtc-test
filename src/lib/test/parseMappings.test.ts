import { describe, expect, it } from 'vitest'
import { parseMappings } from '../parseMappings'

describe('parseMappings', () => {
  it('parses mappings string into an object', () => {
    const input = {
      mappings:
        '29190088-763e-4d1c-861a-d16dbfcf858c:Real Madrid;' +
        '33ff69aa-c714-470c-b90d-d3883c95adce:Barcelona;' +
        'b582b685-e75c-4139-8274-d19f078eabef:Manchester United;' +
        '0cfb491c-7d09-4ffc-99fb-a6ee0cf5d198:PERIOD_3;' +
        '5a79d3e7-85b3-4d6b-b4bf-ddd743e7162f:PERIOD_4',
    }

    const expected = {
      '29190088-763e-4d1c-861a-d16dbfcf858c': 'Real Madrid',
      '33ff69aa-c714-470c-b90d-d3883c95adce': 'Barcelona',
      'b582b685-e75c-4139-8274-d19f078eabef': 'Manchester United',
      '0cfb491c-7d09-4ffc-99fb-a6ee0cf5d198': 'PERIOD_3',
      '5a79d3e7-85b3-4d6b-b4bf-ddd743e7162f': 'PERIOD_4',
    }

    const result = parseMappings(input.mappings)

    expect(result).toEqual(expected)
  })

  it('handles empty input gracefully', () => {
    const result = parseMappings('')

    expect(result).toEqual({})
  })

  it('skips malformed entries', () => {
    const input = 'id1:Team A;id2Team B;id3:Team C'
    const result = parseMappings(input)

    expect(result).toEqual({
      id1: 'Team A',
      id3: 'Team C',
    })
  })
})
