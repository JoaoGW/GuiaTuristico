import { View } from "@gluestack-ui/themed";

import { ButtonIconRight } from "@components/Buttons/ButtonIconRight";
import { Maps } from "@components/Maps/Maps";

export function MapsExpanded() {
  return (
    <View px={20} py={20}>
      <View>
        <ButtonIconRight textContent="Voltar" />
      </View>
      <View>
        <Maps />
      </View>
    </View>
  )
}