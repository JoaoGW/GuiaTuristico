import { createContext, useContext, useState, ReactNode } from "react";

import {
  Button,
  ButtonText,
  HStack,
  Pressable,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
  VStack,
} from "@gluestack-ui/themed";

import { HelpCircle, X } from "lucide-react-native";

type ToastContextType = {
  handleToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function AlertToast({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [toastId, setToastId] = useState<number | null>(null);

  const handleToast = (message: string) => {
    if (!toastId || !toast.isActive(toastId)) {
      const newId = Math.random();
      setToastId(newId);
      toast.show({
        id: newId,
        placement: "top",
        duration: 3000,
        render: ({ id }) => (
          <Toast
            action="error"
            variant="outline"
            nativeID={`toast-${id}`}
            p={4}
            gap={6}
            borderColor="$red500"
            w="$full"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <HStack space="md" alignItems="center">
              <HelpCircle size={24} color="#FF0000" />
              <VStack space="xs">
                <ToastTitle fontWeight="bold" color="$red500">
                  Error!
                </ToastTitle>
                <ToastDescription size="sm" color="$gray700">
                  {message}
                </ToastDescription>
              </VStack>
            </HStack>
            <HStack space="sm" alignItems="center">
              <Button variant="link" size="sm">
                <ButtonText>Retry</ButtonText>
              </Button>
              <Pressable onPress={() => toast.close(id)}>
                <X size={20} color="#535353" />
              </Pressable>
            </HStack>
          </Toast>
        ),
      });
    }
  };

  return (
    <ToastContext.Provider value={{ handleToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToastContext = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  
  return context;
};