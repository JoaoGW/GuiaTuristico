import {
  Button,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
  ButtonText
} from "@gluestack-ui/themed";

import { ArrowLeft } from "lucide-react-native";

type ButtonContent = {
  textContent: string,
  action: () => void,
  styles?: Object
}

export function ButtonIconRight({ textContent, action, styles }: ButtonContent) {
  return (
    <ButtonGroup alignItems="center" style={ styles }>
      <Button variant="link" onPress={ action }>
        <ButtonIcon as={ ArrowLeft } size="xl" color="$black" mr={8}/>
        <ButtonText color="$black" size="lg">{ textContent }</ButtonText>
      </Button>
    </ButtonGroup>
  )
}