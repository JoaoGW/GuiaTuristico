import { View, Text } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";

type LimiterAttributes = {
  currentCharactersQuantity: number,
  characterLimitQuantity: number,
  style?: Object
}

export function CharacterLimiter({ currentCharactersQuantity, characterLimitQuantity, style }: LimiterAttributes) {
  const [limitStatus, setLimitStatus] = useState<'normal' | 'warning' | 'error'>('normal');

  useEffect(() => {
    if (currentCharactersQuantity >= Math.floor(characterLimitQuantity * 0.7)) {
      setLimitStatus('warning');
    } else if (currentCharactersQuantity < characterLimitQuantity) {
      setLimitStatus('normal');
    }

    if (currentCharactersQuantity === characterLimitQuantity) {
      setLimitStatus('error');
    }
  }, [currentCharactersQuantity, characterLimitQuantity]);

  return (
    <View style={ style }>
      <Text color={ limitStatus === "normal" ? '$black' : limitStatus === "warning" ? '$yellow500' : '$red500' }>
        {currentCharactersQuantity} / {characterLimitQuantity}
      </Text>
    </View>
  )
}