import { View, Text } from "@gluestack-ui/themed";

import FelipeProfilePicture from '@assets/Mascot/Felipe_Mascot_ProfilePic.svg';

type AiBalloonProps = {
  message: string;
  senderName?: string;
};

export function AiBalloon({ message, senderName }: AiBalloonProps) {
  return (
    <View flexDirection="row" alignItems="flex-end" mb={12}>
      <FelipeProfilePicture height={40} width={40} />

      <View alignItems="flex-start">
        <View
          bg="$blue100"
          px={16}
          py={10}
          borderRadius={18}
          maxWidth={260}
          style={{
            borderTopLeftRadius: 0,
            marginLeft: 8,
            position: "relative",
          }}
        >
          <Text color="$black">{ message }</Text>
          <View
            style={{
              position: "absolute",
              left: -10,
              bottom: 0,
              width: 0,
              height: 0,
              borderTopWidth: 10,
              borderTopColor: "transparent",
              borderBottomWidth: 10,
              borderBottomColor: "transparent",
              borderRightWidth: 12,
              borderRightColor: "#DBEAFE"
            }}
          />
        </View>
        { senderName && (
          <Text fontSize={12} color="$gray500" mt={2} ml={10}>
            { senderName }
          </Text>
        )}
      </View>
    </View>
  );
}