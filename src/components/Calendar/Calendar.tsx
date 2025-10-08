'use client'

import { Badge, Card, Flex, Skeleton, Table, Text } from '@radix-ui/themes'
import dayjs from 'dayjs'
import Link from 'next/link'
import useSWR from 'swr'

import { ATGCalendarDayRoot } from '@/types/ATG/CalendarDay'

import { GameType } from '@/constants/GameType'
import { RadixColors } from '@/constants/Radix'

const gameTypeColors: Record<GameType, RadixColors> = {
  [GameType.V75]: 'blue',
  [GameType.GS75]: 'jade',
  [GameType.V86]: 'purple',
  [GameType.V64]: 'orange',
  [GameType.V65]: 'red',
  [GameType.DD]: 'cyan',
  [GameType.LD]: 'cyan',
  [GameType.V5]: 'cyan',
  [GameType.V4]: 'cyan',
  [GameType.V3]: 'cyan',
}

const Calendar = ({ selectedDate }: { selectedDate: string }) => {
  const { data, isLoading, error, mutate } = useSWR<ATGCalendarDayRoot>(
    selectedDate ? `/day?date=${selectedDate}` : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  )

  if (isLoading) {
    return (
      <Card size="4">
        <Table.Root size="3">
          <Table.Body>
            {Array.from({ length: 4 }).map((_, i) => (
              <Table.Row key={i}>
                <Table.Cell width="200px">
                  <Skeleton height="62px" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton height="62px" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    )
  }

  return (
    <Flex direction="column" gap="4">
      <Card size="4">
        <Table.Root size="3">
          <Table.Body className="select-none">
            {data &&
              data.tracks &&
              data?.tracks.map((track) => {
                const badges = Object.keys(data.games).flatMap((gameType) =>
                  data.games[gameType as GameType]
                    .filter((game) => game.tracks.includes(track.id))
                    .map((game) => {
                      const badgeColor =
                        gameTypeColors[gameType as GameType] || 'gray'
                      return (
                        <Link
                          key={`${game.id}-${gameType}`}
                          href={`/game/${game.id}`}
                          className="opacity-80 transition-all hover:-translate-y-0.5 hover:opacity-100"
                        >
                          <Badge
                            size="3"
                            color={badgeColor}
                            className="min-w-20 cursor-pointer justify-center uppercase"
                          >
                            <Flex
                              direction="column"
                              justify="center"
                              align="center"
                              className="px-2 py-1 text-white"
                            >
                              <Text size="4" weight="bold">
                                {gameType}
                              </Text>
                              <Text size="2" weight="bold">
                                {dayjs(game.startTime).format('HH:mm')}
                              </Text>
                            </Flex>
                          </Badge>
                        </Link>
                      )
                    })
                )

                return (
                  <Table.Row key={track.id}>
                    <Table.Cell width="250px">
                      <Flex align="center" className="h-full">
                        <Text weight="bold">{track.name}</Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex display="inline-flex" gap="4">
                        {badges.length > 0 ? badges : null}
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table.Root>
      </Card>
    </Flex>
  )
}

export default Calendar
