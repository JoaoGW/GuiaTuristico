import { LucideIcon } from "lucide-react-native";

export interface ChatHistoryTypes {
  id: number,
  title: string,
  date: string,
  icon: LucideIcon,
  navigate: (routeName: string, chatId: string) => void,
  route: string,
  chatId: string
}