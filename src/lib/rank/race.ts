import { Race } from '@/types/ATG/Game'
import { calculateHorsePoints } from './points'

export async function getRaceStartsWithPoints(race: Race): Promise<any[]> {
  return await Promise.all(
    race.starts.map(async (start) => {
      if (start.scratched) {
        return null
      }

      const points = calculateHorsePoints({
        start,
        raceStarts: race.starts,
      })

      return {
        horse: start.horse.name,
        driver: start.driver?.shortName || start.driver?.lastName,
        raceName: race.name,
        postPosition: start.postPosition,
        distance: race.distance,
        points,
      }
    })
  ).then((startsWithPoints) => startsWithPoints.filter(Boolean))
}

export function rankHorsesByPoints(startsWithPoints: any[]): any[] {
  const validStarts = startsWithPoints.filter((start) => !start.scratched)

  const ranked = validStarts.sort((a, b) => b.points - a.points)

  for (let i = 0; i < ranked.length; i++) {
    switch (i) {
      case 0:
        ranked[i].points = 10
        break
      case 1:
        ranked[i].points = 8
        break
      case 2:
        ranked[i].points = 6
        break
      case 3:
        ranked[i].points = 4
        break
      case 4:
        ranked[i].points = 2
        break
      default:
        ranked[i].points = 0
        break
    }
  }

  return ranked
}
