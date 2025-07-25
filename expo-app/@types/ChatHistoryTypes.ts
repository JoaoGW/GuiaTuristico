import { AuthNavigationProp } from "@routes/auth.routes";

import { LucideIcon } from "lucide-react-native";

export interface ChatHistoryTypes {
  id: number,
  title: string,
  date: string,
  icon: LucideIcon,
  navigate: (route: AuthNavigationProp, chatId: string) => void,
  route: AuthNavigationProp,
  chatId: string
}