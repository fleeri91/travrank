'use client'

import { Game } from '@/types/Game'
import { useEffect } from 'react'
import useSWR from 'swr'

const fetcher = (url: string): Promise<Game> =>
  fetch(url).then((res) => res.json())

const Rank = () => {
  const { data, error, isLoading } = useSWR('/data/game.json', fetcher)

  useEffect(() => {
    console.log(data)
  }, [data])

  return <></>
}

export default Rank
