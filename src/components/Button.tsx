import {ComponentProps} from "react"
import {ButtonSpinner, Button as GluestackButton, Text} from "@gluestack-ui/themed"

type Props = ComponentProps<typeof GluestackButton> & {
    title:string
    variant?: "solid" | "outline"
    isLoading?:boolean
}

export function Button({title, variant = "solid", isLoading=false,  ...rest}:Props) {
    return(
        <GluestackButton
            bg={variant === "outline" ? "transparent" : "$darkBlue600"}
            mt={variant === "outline" ? "$0" : "$3"}
            borderWidth="$0"
            borderRadius="$xl"
            w="$full"
            $active-bg={variant === "outline" ? "" : "$darkBlue700"}
            disabled={isLoading}
            {...rest}>

            {isLoading ? (
                <ButtonSpinner color="$white"/>
            ) : (
                <Text
                    color={variant === "outline" ? "$darkBlue600" : "$trueGray50"}
                    // $active-color={variant === "outline" ? "$darkBlue900" : "$trueGray50"}
                    fontFamily="$body">
                    {title}
                </Text>
            )}
        </GluestackButton>
    )
}