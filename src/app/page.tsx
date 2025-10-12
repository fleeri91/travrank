import { Box, Container } from '@radix-ui/themes'

import Rank from '@/components/Rank'

export default function App() {
  return (
    <Box className="my-16">
      <Container size="4" className="px-4">
        <Rank />
      </Container>
    </Box>
  )
}
