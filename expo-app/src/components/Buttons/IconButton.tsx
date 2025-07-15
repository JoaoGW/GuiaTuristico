import { Button, ButtonIcon } from "@gluestack-ui/themed";

import { LucideIcon } from "lucide-react-native";

type ButtonProps = {
  icon: LucideIcon,
  iconSize: "xs" | "sm" | "md" | "lg" | "xl" | "2xs" | undefined,
  iconColor: string,
  buttonBgColor: string,
  buttonFunctionality: () => void,
  styles?: Object
}

export function IconButton({ icon, iconSize, iconColor, buttonBgColor, buttonFunctionality, styles }: ButtonProps){
  return (
    <Button onPress={ buttonFunctionality } bgColor={ buttonBgColor } style={ styles }>
      <ButtonIcon
        as={ icon }
        size={ iconSize }
        color={ iconColor }
      />
    </Button>
  )
}