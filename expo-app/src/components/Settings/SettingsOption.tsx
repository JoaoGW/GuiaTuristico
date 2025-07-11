import React from "react";
import { Pressable, Text } from "@gluestack-ui/themed";
import { ChevronRight, LucideIcon } from "lucide-react-native";

type SettingsRules = {
  icon: LucideIcon;
  optionText: string;
};

export function SettingsOption(props: SettingsRules) {
  const { icon: Icon, optionText } = props;

  return (
    <Pressable px={20} py={10} my={1}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
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
      <ChevronRight />
    </Pressable>
  );
}