import {
  Button,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
  ButtonText
} from "@gluestack-ui/themed";

import { ArrowLeft } from "lucide-react-native";

type ButtonContent = {
  textContent: string
}

export function ButtonIconRight({ textContent }: ButtonContent) {
  return (
    <ButtonGroup alignItems="center">
      <Button variant="link">
        <ButtonIcon as={ ArrowLeft } size="xl" color="$black" mr={8}/>
        <ButtonText color="$black" size="lg">{ textContent }</ButtonText>
      </Button>
    </ButtonGroup>
  )
}