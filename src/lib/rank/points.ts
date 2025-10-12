import { Start } from '@/types/ATG/Game'

export function calculateWinPercentagePointsForRace(
  raceStarts: Start[]
): (Start & { points: number })[] {
  const startsWithWinPercentage = raceStarts.map((start) => {
    const winPercentage = start.horse.statistics?.life?.winPercentage || 0

    console.log(start.horse.name)
    console.log(winPercentage)

    return { start, winPercentage }
  })

  startsWithWinPercentage.sort((a, b) => b.winPercentage - a.winPercentage)

  return startsWithWinPercentage.map((item, index) => {
    let points = 0
    if (index === 0) points = 10
    else if (index === 1) points = 8
    else if (index === 2) points = 6
    else if (index === 3) points = 4
    else if (index === 4) points = 2

    return { ...item.start, points }
  })
}

export function calculateHorsePoints({
  start,
  raceStarts,
}: {
  start: Start
  raceStarts: Start[]
}): number {
  let points = 0

  const raceWithPoints = calculateWinPercentagePointsForRace(raceStarts)
  const horseInRace = raceWithPoints.find((item) => item.id === start.id)

  if (horseInRace) {
    points += horseInRace.points
  }
  return points
}
