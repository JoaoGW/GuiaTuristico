import { SvgProps } from 'react-native-svg';

import {
  Button,
  ButtonGroup,
  ButtonText,
  Spinner,
  View
} from "@gluestack-ui/themed";

type ButtonContent = {
  textContent: string,
  buttonSize: "xs" | "sm" | "md" | "lg" | "xl" | undefined,
  icon: React.FC<SvgProps>,
  iconWidth: number,
  iconHeight: number,
  iconStyles?: Object,
  action: () => void,
  isLoading?: boolean,
  styles?: Object
}

export function ButtonIconImageLeft({ textContent, buttonSize, icon: Icon, iconWidth, iconHeight, iconStyles, action, isLoading, styles }: ButtonContent){
  return(
    <ButtonGroup alignContent="center" style={ styles }>
      <Button variant="link" onPress={ action } px={10} size={ buttonSize } justifyContent="center" alignItems="center" disabled={ isLoading }>
        {
          isLoading 
          ?
            <Spinner />
          : 
            <View flexDirection="row" alignItems="center">
              <Icon width={ iconWidth } height={ iconHeight } style={ iconStyles } />
              <ButtonText color="$black" size="lg">{ textContent }</ButtonText>
            </View>
        }
      </Button>
    </ButtonGroup>
  )
}