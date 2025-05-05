import type { SportEvent } from '../store/eventStore'

export function logChanges(prevEvent: SportEvent, event: SportEvent) {
  logScoreChange(prevEvent, event)
  logStatusChange(prevEvent, event)
}

function logScoreChange(prevEvent: SportEvent, event: SportEvent): void {
  const hasScoreChanged =
    JSON.stringify(prevEvent.scores) !== JSON.stringify(event.scores)

  if (!hasScoreChanged) return

  for (const [period, newScore] of Object.entries(event.scores)) {
    const oldScore = prevEvent.scores[period]

    if (!oldScore) {
      console.log(
        `New score period "${period}" added for ${event.id}: ${newScore.home}:${newScore.away}`,
      )
    } else if (
      oldScore.home !== newScore.home ||
      oldScore.away !== newScore.away
    ) {
      console.log(
        `Score changed for ${event.id} [${period}]: ${oldScore.home}:${oldScore.away} → ${newScore.home}:${newScore.away}`,
      )
    }
  }
}

function logStatusChange(prevEvent: SportEvent, event: SportEvent): void {
  const hasStatusChanged = prevEvent.status !== event.status

  if (hasStatusChanged) {
    console.log(
      `Status changed for ${event.id}: ${prevEvent.status} → ${event.status}`,
    )
  }
}
