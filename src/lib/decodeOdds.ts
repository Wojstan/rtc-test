import type { Score, SportEvent, Status } from '../store/eventStore'
import { type Mappings, parseMappings } from './parseMappings'

export function decodeOdds(
  oddsRaw: string,
  mappingsRaw: string,
): Record<string, SportEvent> {
  if (!oddsRaw || !mappingsRaw) return {}

  const eventMap: Record<string, SportEvent> = {}
  const mappings = parseMappings(mappingsRaw)

  const lines = oddsRaw.split('\n')
  for (const line of lines) {
    const fields = line.split(',')

    if (fields.length !== 8) {
      throw new Error(
        `Malformed line: expected 8 fields, got ${fields.length} - "${line}"`,
      )
    }

    const event = buildSportEvent(fields, mappings)
    eventMap[event.id] = event
  }

  return eventMap
}

function buildSportEvent(fields: string[], mappings: Mappings): SportEvent {
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
  const scores = decodeScores(scoreRaw, mappings)

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
