import { Center } from "@gluestack-ui/themed";
import { MoonLoader } from "react-spinners";

export function Loading() {
  return (
    <Center>
      <MoonLoader
        size={45}
        speedMultiplier={0.35}
      />
    </Center>
  )
}