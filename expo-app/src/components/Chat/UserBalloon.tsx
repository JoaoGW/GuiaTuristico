import { View, Text, Image } from "@gluestack-ui/themed";

type ChatBubbleProps = {
  message: string;
  avatarUrl: string;
  senderName?: string;
};

export function UserBalloon({ message, avatarUrl, senderName }: ChatBubbleProps) {
  return (
    <View flexDirection="row" justifyContent="flex-end" alignItems="flex-end" mb={12}>
      <View alignItems="flex-end">
        <View
          bg="$yellow100"
          px={16}
          py={10}
          borderRadius={18}
          maxWidth={260}
          style={{
            borderTopRightRadius: 0,
            marginRight: 8,
            position: "relative",
          }}
        >
          <Text color="$black">{ message }</Text>
          <View
            style={{
              position: "absolute",
              right: -10,
              bottom: 0,
              width: 0,
              height: 0,
              borderTopWidth: 10,
              borderTopColor: "transparent",
              borderBottomWidth: 10,
              borderBottomColor: "transparent",
              borderLeftWidth: 12,
              borderLeftColor: "#FEF3C7"
            }}
          />
        </View>
        { senderName && (
          <Text fontSize={12} color="$gray500" mt={2} mr={10}>
            { senderName }
          </Text>
        )}
      </View>
      <Image
        source={{ uri: avatarUrl }}
        width={40}
        height={40}
        borderRadius={20}
        ml={8}
        borderWidth={2}
        borderColor="$yellow500"
        alt="User Profile Photo"
      />
    </View>
  )
}