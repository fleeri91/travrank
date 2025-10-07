import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios'

import { ATGCalendarDayRoot } from '@/types/ATG/CalendarDay'

const ALLOWED_COUNTRYCODES = ['SE', 'NO', 'DK', 'FI']
const ALLOWED_GAMETYPES = [
  'V75',
  'GS75',
  'V86',
  'V64',
  'V65',
  'dd',
  'ld',
  'V5',
  'V4',
]

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const date = params.get('date')

  console.log(date)

  if (!date) {
    return NextResponse.json(
      { error: 'Date parameter is required' },
      { status: 400 }
    )
  }

  try {
    const response = await axios.get(
      `${process.env.API_URL}/calendar/day/${date}`
    )

    if (!response.data) {
      throw new Error('Failed to fetch game data')
    }

    const data: ATGCalendarDayRoot = response.data

    const filteredTracks = data.tracks.filter(
      (track) =>
        ALLOWED_COUNTRYCODES.includes(track.countryCode) &&
        track.sport === 'trot'
    )

    const allowedTrackIds = new Set(filteredTracks.map((track) => track.id))

    const filteredGames: ATGCalendarDayRoot['games'] = {}
    Object.keys(data.games)
      .filter((gameType) => ALLOWED_GAMETYPES.includes(gameType))
      .forEach((gameType) => {
        filteredGames[gameType] = data.games[gameType].filter((game) => {
          const hasAllowedTrack = game.tracks.some((trackId) =>
            allowedTrackIds.has(trackId)
          )
          return hasAllowedTrack
        })
      })

    const filteredData: ATGCalendarDayRoot = {
      ...data,
      tracks: filteredTracks,
      games: filteredGames,
    }

    return NextResponse.json(filteredData, { status: 200 })
  } catch (error) {
    console.error('Error fetching or processing game data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch or process game data' },
      { status: 500 }
    )
  }
}
