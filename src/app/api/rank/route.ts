import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios'
import { ATGGameRoot } from '@/types/ATG/Game'
import { getRaceStartsWithPoints, rankHorsesByPoints } from '@/lib/rank/race'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const id = params.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing game ID' }, { status: 400 })
  }

  try {
    const response = await axios.get<ATGGameRoot>(
      `${process.env.API_URL}/games/${id}`
    )
    const gameData = response.data

    const racesWithPoints = await Promise.all(
      gameData.races.map(async (race) => {
        const startsWithPoints = await getRaceStartsWithPoints(race)
        const rankedHorses = rankHorsesByPoints(startsWithPoints)

        return {
          raceId: race.id,
          raceName: race.name,
          track: race.track.name,
          distance: race.distance,
          startMethod: race.startMethod,
          horses: rankedHorses,
        }
      })
    )

    return NextResponse.json({
      gameId: gameData.id,
      races: racesWithPoints,
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
