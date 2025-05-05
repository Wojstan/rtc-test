import { describe, expect, it } from 'vitest'
import { decodeOdds } from '../decodeOdds'
import { result, testMappings, testOdds } from './mockData'

describe('decodeOdds', () => {
  it('decodes odds string into an event', () => {
    const event = decodeOdds(testOdds.odds, testMappings.mappings)

    expect(event).toStrictEqual(result)
  })

  it('returns an empty object for empty input', () => {
    const result = decodeOdds('', '')

    expect(result).toStrictEqual({})
  })

  it('skips malformed lines', () => {
    const malformedOdds = 'bad,line,with,missing,fields'

    expect(() => decodeOdds(malformedOdds, testMappings.mappings)).toThrow(
      `Malformed line: expected 8 fields, got 5 - \"bad,line,with,missing,fields\"`,
    )
  })

  it('throws if mappings are missing for required fields', () => {
    const odds = 'id,unknownSport,comp,start,home,away,status,period@1:0'

    expect(() => decodeOdds(odds, testMappings.mappings)).toThrow()
  })

  it('correctly decodes score strings', () => {
    const odds =
      'id,b8a804c5-7a18-4ce6-a242-34c94428160f,a109f2fc-65ce-4989-aaf3-b05e7cd642b9,1746442870235,e16d4bb3-f5b4-478a-940b-85ab415d9e1b,5795395d-61d2-4b5a-9239-82b759ad07a7,b59833b5-211d-42a7-9c95-fb81a407f28c,e35cac5e-3556-4e77-8bfe-2e9411b5f08e@6:5|428daf7c-51b3-4d1e-bc8a-cf131a25ffc4@6:5'
    const result = decodeOdds(odds, testMappings.mappings)

    const firstEvent = result.id
    expect(firstEvent.scores.CURRENT).toEqual({
      type: 'CURRENT',
      home: '6',
      away: '5',
    })
    expect(firstEvent.scores.PERIOD_1).toEqual({
      type: 'PERIOD_1',
      home: '6',
      away: '5',
    })
  })

  it('parses startTime as ISO string', () => {
    const odds =
      'id,b8a804c5-7a18-4ce6-a242-34c94428160f,a109f2fc-65ce-4989-aaf3-b05e7cd642b9,1746442870000,home,away,status,period@1:0'
    const result = decodeOdds(odds, testMappings.mappings)

    expect(result.id.startTime).toBe('2025-05-05T11:01:10.000Z')
  })
})
