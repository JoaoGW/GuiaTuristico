import React from "react";
import { Pressable, Text } from "@gluestack-ui/themed";
import { ChevronRight, LucideIcon } from "lucide-react-native";

type SettingsRules = {
  icon: LucideIcon;
  optionText: string;
  route: () => void
};

export function SettingsOption({ icon: Icon, optionText, route }: SettingsRules) {
  return (
    <Pressable px={20} py={10} my={1} flexDirection="row" alignItems="center" justifyContent="space-between" onPress={ route } >
      <Icon size={30} color="#606060" />
      <Text
        color="$black"
        fontSize="$lg"
        style={{
          flex: 1,
          marginLeft: 20,
        }}
      >
        { optionText }
      </Text>
      <ChevronRight color="black" />
    </Pressable>
  );
}