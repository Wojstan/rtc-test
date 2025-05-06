import type { Score, SportEvent, Status } from '../store/eventStore'
import { type Mappings, parseMappings } from './parseMappings'

export function decodeOdds(
  oddsRaw: string,
  mappingsRaw: string,
): Record<string, SportEvent> {
  if (!oddsRaw || !mappingsRaw) return {}

  const decodedEvents: Record<string, SportEvent> = {}
  const mappings = parseMappings(mappingsRaw)
  const lines = oddsRaw.split('\n')

  for (const line of lines) {
    const fields = line.split(',')

    if (fields.length !== 8) {
      console.error(
        `Malformed line: expected 8 fields, got ${fields.length} - "${line}"`,
      )
      continue
    }

    try {
      const event = buildSportEvent(fields, mappings)
      decodedEvents[event.id] = event
    } catch (error) {
      console.error(
        `Failed to decode event: ${(error as Error).message} | Line: "${line}"`,
      )
    }
  }

  return decodedEvents
}

function buildSportEvent(fields: string[], mappings: Mappings): SportEvent {
  validateFields(fields, mappings)

  const [
    id,
    sportId,
    competitionId,
    startTimeMs,
    homeId,
    awayId,
    statusId,
    scoreRaw,
  ] = fields

  const scores = scoreRaw ? decodeScores(scoreRaw, mappings) : {}

  return {
    id,
    sport: mappings[sportId],
    competition: mappings[competitionId],
    startTime: new Date(Number(startTimeMs)).toISOString(),
    status: mappings[statusId] as Status,
    competitors: {
      HOME: {
        type: 'HOME',
        name: mappings[homeId],
      },
      AWAY: {
        type: 'AWAY',
        name: mappings[awayId],
      },
    },
    scores,
  }
}

function decodeScores(
  scoresRaw: string,
  mappings: Mappings,
): Record<string, Score> {
  const scores: Record<string, Score> = {}

  const scoreParts = scoresRaw.split('|')

  for (const part of scoreParts) {
    const [periodId, result] = part.split('@')
    const [home, away] = result.split(':')

    scores[mappings[periodId]] = {
      type: mappings[periodId],
      home,
      away,
    }
  }

  return scores
}

function validateFields(fields: string[], mappings: Mappings): void {
  const [_id, sportId, competitionId, _startTime, homeId, awayId, statusId] =
    fields

  const missingKeys = [
    { key: sportId, label: 'sportId' },
    { key: competitionId, label: 'competitionId' },
    { key: homeId, label: 'homeId' },
    { key: awayId, label: 'awayId' },
    { key: statusId, label: 'statusId' },
  ].filter(({ key }) => !mappings[key])

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing mappings for: ${missingKeys
        .map(({ key, label }) => `${label} (${key})`)
        .join(', ')}`,
    )
  }
}
