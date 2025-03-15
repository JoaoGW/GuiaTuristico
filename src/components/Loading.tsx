import { Center, Spinner, Text } from "@gluestack-ui/themed";

export function Loading() {
  return (
    <Center>
      <Spinner />
      <Text size="md">Please Wait...</Text>
    </Center>
  )
}