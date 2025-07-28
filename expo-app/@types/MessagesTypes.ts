export interface MessageTypes {
  sender: "ai" | "user",
  text: string,
  name: string,
  avatarUrl: string
}