import { SafeAreaView, StatusBar } from "react-native";

import { Button, View } from "@gluestack-ui/themed";

import { ArrowLeft } from "lucide-react-native";

export function GenerateItineraryMenu(){
  return(
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View>
        <Button as={ ArrowLeft } variant="link" />
      </View>
    </SafeAreaView>
  )
}