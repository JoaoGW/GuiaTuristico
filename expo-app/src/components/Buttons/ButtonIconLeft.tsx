import {
  Button,
  ButtonGroup,
  ButtonText,
  Spinner
} from "@gluestack-ui/themed";

import { LucideIcon } from "lucide-react-native";

type ButtonContent = {
  textContent: string,
  icon: LucideIcon,
  action: () => void,
  iconDimension: number,
  textColor: string,
  disabled?: boolean,
  loading?: boolean,
  buttonSize?: "xs" | "sm" | "md" | "lg" | "xl" | undefined,
  iconStyles?: object,
  buttonStyles?: object,
  styles?: object
}

export function ButtonIconLeft({ textContent, buttonSize, icon: Icon, iconDimension, textColor, disabled, loading, action, iconStyles, buttonStyles, styles }: ButtonContent){
  return(
    <ButtonGroup alignContent="center" style={ styles }>
      <Button 
        variant="link" 
        onPress={ action } 
        px={10} 
        size={ buttonSize } 
        justifyContent="center" 
        alignItems="center"
        disabled={ disabled }
        style={ buttonStyles }
      >
        {
          loading
          ? <Spinner color="#FFF" mr={10} />
          : <Icon width={ iconDimension } height={ iconDimension } style={ iconStyles } />
        }
        <ButtonText color={ textColor } size="lg">{ textContent }</ButtonText>
      </Button>
    </ButtonGroup>
  )
}