import {
  Button,
  ButtonGroup,
  ButtonText
} from "@gluestack-ui/themed";
import { SvgProps } from 'react-native-svg';

type ButtonContent = {
  textContent: string,
  buttonSize: "xs" | "sm" | "md" | "lg" | "xl" | undefined,
  icon: React.FC<SvgProps>,
  iconWidth: number,
  iconHeight: number,
  iconStyles?: Object,
  action: () => void,
  styles?: Object
}

export function ButtonIconImageLeft({ textContent, buttonSize, icon: Icon, iconWidth, iconHeight, iconStyles, action, styles }: ButtonContent){
  return(
    <ButtonGroup alignContent="center" style={ styles }>
      <Button variant="link" onPress={ action } px={10} size={ buttonSize } justifyContent="center" alignItems="center">
        <Icon width={ iconWidth } height={ iconHeight } style={ iconStyles } />
        <ButtonText color="$black" size="lg">{ textContent }</ButtonText>
      </Button>
    </ButtonGroup>
  )
}