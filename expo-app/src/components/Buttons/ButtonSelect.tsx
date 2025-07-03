import {
  Button,
  ButtonText,
  ButtonIcon,
  ButtonGroup,
} from "@gluestack-ui/themed";

import { LucideIcon } from "lucide-react-native";

type SelectButtonProps = {
  text: string,
  isSelected: boolean,
  objective: () => void,
  icon?: LucideIcon,
  style?: Object
}

export function ButtonSelect({ text, isSelected, objective, icon, style }: SelectButtonProps) {
  return (
    <ButtonGroup flexDirection="row" style={ style }>
      <Button
        onPress={ objective }
        style={{
          backgroundColor: isSelected ? "#E9AD2D" : "#FDFDFD",
          borderWidth: isSelected ? 0 : 2,
          borderColor: isSelected ? undefined : "#E9AD2D"
        }}
      >
        {
          icon ? <ButtonIcon as={ icon } mr={4} size="md" color={ isSelected ? "#FFF" : "#000" }/> : ''
        }
        <ButtonText color={ isSelected ? "#FFF" : "#000" }>{ text }</ButtonText>
      </Button>
    </ButtonGroup>
  )
}