import {ComponentProps} from "react"
import {Box, Text, VStack, HStack, Image, View, Button} from '@gluestack-ui/themed';

// type Props = ComponentProps<typeof Button> & {
//     title:string
//     variant?: "on" | "off"
//     isOn?:boolean
// }

export function UserPreferencesTags({ item}: { item: any }) {
  return (
    <Button
      bgColor='$darkBlue700'
      // bgColor={variant === "off" ? '$darkBlue700' : '$darkBlue900'}
      borderWidth="$1"
      borderRadius="$3xl"
      mt={5} px={10} py={3}>
      <Text color='$white'> {item.name} </Text>
    </Button>
  );
}