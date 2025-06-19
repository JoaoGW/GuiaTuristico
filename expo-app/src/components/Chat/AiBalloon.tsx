import { View, Text, Image } from "@gluestack-ui/themed";

type AiBalloonProps = {
  message: string;
  senderName?: string;
};

export function AiBalloon({ message, senderName }: AiBalloonProps) {
  return (
    <View flexDirection="row" alignItems="flex-end" mb={12}>
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png" }}
        width={40}
        height={40}
        borderRadius={20}
        mr={8}
        borderWidth={2}
        borderColor="$blue500"
        alt="AI Icon Image"
      />

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