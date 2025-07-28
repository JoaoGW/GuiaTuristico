import {
  Heading, 
  Icon, 
  Modal, 
  ModalBackdrop, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader,
  Text,
  Button,
  ButtonText,
  Center
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProp } from "@routes/auth.routes";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing
} from 'react-native-reanimated';

import { X, WifiOff } from "lucide-react-native";

type ConnectionErrorAlerter = {
  showModal: boolean,
  setShowModal: (show: boolean) => void;
}

export function ConnectionErrorAlerter({ showModal, setShowModal }: ConnectionErrorAlerter) {
  const navigation = useNavigation<AuthNavigationProp>();

  // Animação de pulse
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  // Iniciar animação quando o modal for aberto
  if (showModal) {
    pulseScale.value = withRepeat(
      withTiming(1.2, {
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withTiming(0.6, {
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: pulseOpacity.value,
    };
  });

  return(
    <Modal
      isOpen={ showModal }
      onClose={() => {
        setShowModal(false);
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton position="absolute" right={4} top={4}>
            <Icon as={X} size="xl" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Center mt={10}>
            <Animated.View style={animatedStyle}>
              <WifiOff color="red" size={55} />
            </Animated.View>
          </Center>
          <Text size="md" textAlign="center" mt={20} color="typography.500" fontWeight="$semibold">
            Parece que você não está conectado à internet! Este recurso necessita de uma conexão à internet para funcionar.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            margin="auto"
            borderRadius={20}
            bgColor="red"
            onPress={() => {
              setShowModal(false);
              navigation.navigate("Home");
            }}
          >
            <ButtonText>Voltar ao Início</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}