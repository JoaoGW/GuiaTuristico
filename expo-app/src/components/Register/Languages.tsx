import { Box, Text, Image, Button } from '@gluestack-ui/themed';

interface Props {
  item: {
    name: string;
    image: any;
  };
  isSelected: boolean;
  onToggle: () => void;
}

export function UserLanguagesLangs({ item, isSelected, onToggle }: Props) {
  return (
    <Button
      onPress={onToggle}
      py={3}
      h="$16"
      borderRadius={10}
      borderColor="$black"
      borderWidth={isSelected ? '$4' : '$0'}
    >
      <Box position="absolute" top={0} left={0} right={0} bottom={0} backgroundColor='$black' borderRadius={16}>
        <Image
          h="$full"
          w="$full"
          resizeMode="cover"
          borderRadius={10}
          source={item.image}
          defaultSource={require('@assets/background.webp')}
          opacity={isSelected ? 1 : 0.5}
          alt=""
        />
      </Box>
      <Text
        color="$warmGray50"
        bgColor="rgba(78, 78, 78, 0.58)"
        borderRadius={10}
        px={5}
        py={3}
        fontSize="$lg"
        top={0}
        textAlign="center"
      >
        {item.name}
      </Text>
    </Button>
  );
}
