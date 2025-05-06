import { describe, expect, it, vi } from 'vitest'
import { decodeOdds } from '../decodeOdds'
import { result, testMappings, testOdds } from './__mockDecodeData__'

describe('decodeOdds', () => {
  it('decodes odds string into an event', () => {
    const event = decodeOdds(testOdds.odds, testMappings.mappings)

    expect(event).toStrictEqual(result)
  })

  it('returns an empty object for empty input', () => {
    const result = decodeOdds('', '')

    expect(result).toStrictEqual({})
  })

  it('skips malformed lines and logs an error', () => {
    const malformedOdds = 'bad,line,with,missing,fields'

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const result = decodeOdds(malformedOdds, testMappings.mappings)

    expect(result).toEqual({})
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Malformed line: expected 8 fields, got 5 - "bad,line,with,missing,fields"',
    )

    consoleErrorSpy.mockRestore()
  })

  it('skips events with missing mappings and logs an error', () => {
    const odds = 'id,unknownSport,comp,start,homeId,awayId,status,period@1:0'

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const result = decodeOdds(odds, testMappings.mappings)

    expect(result).toEqual({})
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed to decode event: Missing mappings for: sportId (unknownSport), competitionId (comp), homeId (homeId), awayId (awayId), statusId (status) | Line: "id,unknownSport,comp,start,homeId,awayId,status,period@1:0"',
      ),
    )

    consoleErrorSpy.mockRestore()
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

  it('handles empty score string', () => {
    const odds =
      'id,b8a804c5-7a18-4ce6-a242-34c94428160f,a109f2fc-65ce-4989-aaf3-b05e7cd642b9,1746442870235,e16d4bb3-f5b4-478a-940b-85ab415d9e1b,5795395d-61d2-4b5a-9239-82b759ad07a7,a012ded9-c160-46eb-b5c1-8c57c69417ba,'
    const result = decodeOdds(odds, testMappings.mappings)

    const firstEvent = result.id
    expect(firstEvent.scores).toEqual({})
  })

  it('parses startTime as ISO string', () => {
    const odds =
      'id,b8a804c5-7a18-4ce6-a242-34c94428160f,a109f2fc-65ce-4989-aaf3-b05e7cd642b9,1746442870000,e16d4bb3-f5b4-478a-940b-85ab415d9e1b,5795395d-61d2-4b5a-9239-82b759ad07a7,a012ded9-c160-46eb-b5c1-8c57c69417ba,period@1:0'
    const result = decodeOdds(odds, testMappings.mappings)

    expect(result.id.startTime).toBe('2025-05-05T11:01:10.000Z')
  })
})
