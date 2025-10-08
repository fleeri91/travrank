'use client'

import dayjs from 'dayjs'
import sv from 'dayjs/locale/sv'
import { Box, Container, Text, Flex, IconButton } from '@radix-ui/themes'

import Calendar from '@/components/Calendar'

import { useCalendarStore } from '@/store/useCalendar'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function App() {
  const { selectedDate, today, setPreviousDate, setNextDate } =
    useCalendarStore()

  const FIVE_DAYS = dayjs(today).add(4, 'day')

  return (
    <Box className="my-16">
      <Container size="3" className="px-4">
        <Box className="p-4">
          <Flex justify="center" align="center" gap="4">
            <IconButton
              variant="soft"
              onClick={() => setPreviousDate(selectedDate)}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowLeft />
            </IconButton>
            <Text
              as="div"
              size="5"
              className="flex min-w-24 justify-center capitalize"
            >
              {selectedDate == today
                ? 'Idag'
                : dayjs(selectedDate).locale(sv).format('DD/MM dd')}
            </Text>
            <IconButton
              variant="soft"
              onClick={() => setNextDate(selectedDate)}
              disabled={dayjs(selectedDate).isAfter(FIVE_DAYS, 'day')}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowRight />
            </IconButton>
          </Flex>
        </Box>
        <Calendar selectedDate={selectedDate} />
      </Container>
    </Box>
  )
}
