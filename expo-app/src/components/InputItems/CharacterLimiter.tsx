import { View, Text } from "@gluestack-ui/themed";

type LimiterAttributes = {
  currentCharactersQuantity: number,
  characterLimitQuantity: number,
  style?: object
}

export function CharacterLimiter({ currentCharactersQuantity, characterLimitQuantity, style }: LimiterAttributes) {
  const limitStatus: 'normal' | 'warning' | 'error' =
    currentCharactersQuantity === characterLimitQuantity
      ? 'error'
      : currentCharactersQuantity >= Math.floor(characterLimitQuantity * 0.7)
        ? 'warning'
        : 'normal';

  return (
    <View style={ style }>
      <Text color={ limitStatus === "normal" ? '$black' : limitStatus === "warning" ? '$yellow500' : '$red500' }>
        {currentCharactersQuantity} / {characterLimitQuantity}
      </Text>
    </View>
  )
}