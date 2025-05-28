import { Box, Text, Button } from '@gluestack-ui/themed';

export function GoPremium() {
  return (
    <>
      <Box m={7} bg="$blue500" p={1} borderRadius={10}>
        <Text color="$white" fontSize="$md" textAlign='center' mb={2}>Get exclusive travel guides & VIP deals!</Text>
        <Button bg='$blue700' p={2} borderRadius={10}>
          <Text fontSize="$lg" fontWeight="$bold" color="$white">Upgrade to Pro</Text>
        </Button>
      </Box>
    </>
  )
}