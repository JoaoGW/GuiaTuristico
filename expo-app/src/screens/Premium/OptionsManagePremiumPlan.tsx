import { useNavigation } from "@react-navigation/native";

import { View } from "@gluestack-ui/themed";

import { SettingsOption } from "@components/Settings/SettingsOption";
import { TitleAndBack } from "@components/TitleBack";

import { Ban, CircleDollarSign } from "lucide-react-native";

import { AuthNavigationProp } from "@routes/auth.routes";

export function OptionsManagePremiumPlan(){
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <View >
      <TitleAndBack pageTitle="Gerenciar Assinatura" />
      <View>
        <SettingsOption icon={ CircleDollarSign } optionText="Contratar um novo plano" route={ () => navigation.navigate("PremiumPlans") } />
        <SettingsOption icon={ Ban } optionText="Cancelar plano atual" route={ () => {} } />
      </View>
    </View>
  )
}