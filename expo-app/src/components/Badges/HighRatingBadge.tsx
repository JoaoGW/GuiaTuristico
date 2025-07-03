import { Text, View } from "@gluestack-ui/themed";

import { ThumbsUp, ThumbsDown } from "lucide-react-native";

type BadgeProps = {
  rating: number
}

export function HighRatingBadge({ rating }: BadgeProps){
  return(
    <View 
      bgColor={ rating >= 4.5 ? "$yellow400" : rating <= 3.5 ? "$orange600" : '' } 
      alignItems="center"
      gap={5}
      borderRadius={7}
      p={5}
      flexDirection="row"
    >
      { rating >= 4.5 ? <ThumbsUp color="#FFF" /> : rating <= 3.5 ? <ThumbsDown color="#FFF" /> : '' }
      <Text color="$white" size="md">
        { rating >= 4.5 ? "Boa Nota" : rating <= 3.5 ? "Nota Ruim" : '' }
      </Text>
    </View>
  )
}