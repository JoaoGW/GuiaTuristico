import { Input as GluestackInput, InputField} from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof InputField>
export function Input({...rest}: Props) {
    return(
        <GluestackInput 
            bg="$trueGray200" mt="$3"
            borderWidth="$0"
            borderRadius="$xl"
            // h="$12"
            // w="$full"
            $focus={{
                bgColor: "$trueGray50",
                borderWidth: 2}}>
            <InputField
                // color="$white"
                fontFamily="$body"
                placeholderTextColor="$trueGray400"
                {...rest}/>
        </GluestackInput>
    )
}