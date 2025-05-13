import {ComponentProps} from "react"
import {useState} from "react"
import {Box, Text, Image, Button} from '@gluestack-ui/themed';

type Props = ComponentProps<typeof Button> & {
    title:string
    variant?: "on" | "off"
    isOn?:boolean
}

export function UserPreferencesTags({ item}: { item: any }) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <Button
      onPress={() => setIsSelected(!isSelected)}
      py={3}
      h="$48" 
      borderRadius={10}
      borderColor="$darkBlue600"
      borderWidth={isSelected ? '$4' : '$0'}
    >
      <Box position="absolute" top={0} left={0} right={0} bottom={0}>
        <Image
          h="$full"
          w="$full"
          resizeMode="cover"
          borderRadius={10}
          source={item.image}
          defaultSource={require('@assets/background.webp')}
          opacity={ isSelected ? 0.5 : 1 }
          alt=""/>
        <Box
          h="$full"
          w="$full"
          borderRadius={10}
          position="absolute"
        />
      </Box>
      <Text
        color={isSelected ? '$warmGray50' : '$warmGray50'}
        fontSize="$lg" 
        top={0}
        textAlign="center"
      >
        {item.name}
      </Text>
    </Button>
  );
}