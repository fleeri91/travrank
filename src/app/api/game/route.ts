import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios'

import { ATGGameRoot } from '@/types/ATG/Game'
import { ATGRecordRoot } from '@/types/ATG/Record'
import { Start, Game, Race } from '@/types/Game'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  let id = params.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing game ID' }, { status: 400 })
  }

  try {
    const response = await axios.get<ATGGameRoot>(
      `${process.env.API_URL}/games/${id}`
    )

    if (!response) {
      throw new Error('Failed to fetch game data')
    }

    const gameData = response.data

    const races: Race[] = await Promise.all(
      gameData.races.map(async (race): Promise<Race> => {
        const starts: Start[] = await Promise.all(
          race.starts.map(async (start): Promise<Start> => {
            const recordRes = await axios.get<ATGRecordRoot>(
              `${process.env.API_URL}/races/${race.id}/start/${start.number}`
            )

            return {
              id: start.id,
              number: start.number,
              postPosition: start.postPosition,
              distance: start.distance,
              horse: start.horse,
              driver: start.driver,
              result: start.result,
              out: start.out,
              scratched: start.scratched,
              records: recordRes.data.horse.results.records,
            }
          })
        )

        return {
          id: race.id,
          name: race.name,
          date: race.date,
          number: race.number,
          distance: race.distance,
          startMethod: race.startMethod,
          startTime: race.startTime,
          scheduledStartTime: race.scheduledStartTime,
          prize: race.prize,
          terms: race.terms,
          sport: race.sport,
          track: race.track,
          result: race.result,
          status: race.status,
          starts,
        }
      })
    )

    const result: Game = {
      id: gameData.id,
      races,
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
