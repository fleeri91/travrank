import { Driver, Horse, RaceResult, StartResult, Track } from './ATG/Game'
import { RecordResult } from './ATG/Record'

export interface Game {
  id: string
  races: Race[]
}

export interface Race {
  id: string
  name: string
  date: string
  number: number
  distance: number
  startMethod: string
  startTime: string
  scheduledStartTime: string
  prize: string
  terms: string[]
  sport: string
  track: Track
  result: RaceResult
  status: string
  starts: Start[]
}

export interface Start {
  id: string
  number: number
  postPosition: number
  distance: number
  horse: Horse
  driver: Driver
  result: StartResult
  out?: boolean
  scratched?: boolean
  records: RecordResult[]
}
