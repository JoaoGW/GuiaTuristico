import { useState } from "react";
import { StatusBar, ScrollView } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

import { 
  Input, 
  InputField, 
  View, 
  Text,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
  Button,
  ButtonText,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText
} from "@gluestack-ui/themed";

import AnimatedStar from '@components/AnimatedStar';

import { AuthNavigationProp } from "@routes/auth.routes";

import FelipeMascotItinerary from "@assets/Mascot/Felipe_Mascot_Itinerary_Features.svg";

import { CreatingItinerary } from "../../../@types/CreatingItinerary";

import { Check } from "lucide-react-native";

type GenerateItineraryPreferencesFormTypes = {
  budget: number,
  peopleQuantity: number,
  acconpanying: "Family" | "Friends",
  tripStyle: "Urban" | "Countryside",
  vehicleLocomotionTypes: "Car" | "Motorcycle" | "Foot" | "Train" | "Boat" | "Bicycle",
  locomotionMethod: GenerateItineraryPreferencesFormTypes["vehicleLocomotionTypes"][],
  specialWish: string
}

export function GenerateItineraryPreferences() {
  const [budget, setBudget] = useState<GenerateItineraryPreferencesFormTypes["budget"]>(0);
  const [peopleQuantity, setPeopleQuantity] = useState<GenerateItineraryPreferencesFormTypes["peopleQuantity"]>(0);
  const [acconpanyingType, setAcconpanyingType] = useState<GenerateItineraryPreferencesFormTypes["acconpanying"]>();
  const [tripStyle, setTripStyle] = useState<("Urban" | "Countryside")[]>([]);
  const [specialWish, setSpecialWish] = useState<GenerateItineraryPreferencesFormTypes["specialWish"]>("");
  const [locomotionMethod, setLocomotionMethod] = useState<GenerateItineraryPreferencesFormTypes["vehicleLocomotionTypes"][]>([]);

  // Estados para controlar erros de validação
  const [errors, setErrors] = useState<{
    budget?: string;
    peopleQuantity?: string;
    acconpanyingType?: string;
    tripStyle?: string;
    locomotionMethod?: string;
  }>({});

  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute<RouteProp<{ params: CreatingItinerary }, 'params'>>();
  const { title, dateBegin, dateEnd, days, continent, countries, originCountry, contacts } = route.params;

  // Função de validação dos campos obrigatórios
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (budget < 100) {
      newErrors.budget = "Orçamento deve ser de pelo menos R$ 100";
    }

    if (peopleQuantity <= 0) {
      newErrors.peopleQuantity = "Quantidade de pessoas deve ser maior que zero";
    }

    if (!acconpanyingType) {
      newErrors.acconpanyingType = "Selecione quem te acompanha";
    }

    if (tripStyle.length === 0) {
      newErrors.tripStyle = "Selecione pelo menos um estilo de viagem";
    }

    if (locomotionMethod.length === 0) {
      newErrors.locomotionMethod = "Selecione pelo menos um método de locomoção";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para limpar erro de um campo específico
  const clearFieldError = (fieldName: keyof typeof errors) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleAccompanying = (type: "Family" | "Friends") => {
    setAcconpanyingType(type);
    clearFieldError('acconpanyingType');
  };

  const handleTripStyle = (type: "Urban" | "Countryside" | "Both") => {
    if (type === "Both") {
      if (tripStyle.includes("Urban") && tripStyle.includes("Countryside")) {
        setTripStyle([]);
      } else {
        setTripStyle(["Urban", "Countryside"]);
      }
    } else {
      if (tripStyle.includes(type)) {
        setTripStyle(tripStyle.filter(item => item !== type));
      } else {
        const newTripStyle = [...tripStyle, type];
        setTripStyle(newTripStyle);
      }
    }
    clearFieldError('tripStyle');
  };

  const handleLocomotion = (type: GenerateItineraryPreferencesFormTypes["vehicleLocomotionTypes"]) => {
    if (locomotionMethod.includes(type)) {
      setLocomotionMethod(locomotionMethod.filter(item => item !== type));
    } else if (locomotionMethod.length < 5) {
      setLocomotionMethod([...locomotionMethod, type]);
    }
    clearFieldError('locomotionMethod');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2752B7' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2752B7" />
      <View flexDirection="column" alignItems="center" mt={10} mb={20}>
        <View justifyContent="center" alignItems="center" style={{ width: 260, height: 260 }}>
          <AnimatedStar size={18} style={{ position: 'absolute', top: 10, left: 20, zIndex: 2 }} delay={0} duration={1400} />
          <AnimatedStar size={18} style={{ position: 'absolute', top: 60, left: 0, zIndex: 2 }} delay={700} duration={1400} />
          <AnimatedStar size={18} style={{ position: 'absolute', top: 55, right: 0, zIndex: 2 }} delay={700} duration={1400} />
          <AnimatedStar size={22} style={{ position: 'absolute', top: 20, right: 30, zIndex: 2 }} delay={100} duration={1400} />
          <AnimatedStar size={16} style={{ position: 'absolute', bottom: 20, left: 30, zIndex: 2 }} delay={600} duration={1400} />
          <AnimatedStar size={20} style={{ position: 'absolute', bottom: 10, right: 40, zIndex: 2 }} delay={900} duration={1400} />
          <AnimatedStar size={14} style={{ position: 'absolute', top: 120, left: 0, zIndex: 2 }} delay={1200} duration={1400} />
          <AnimatedStar size={15} style={{ position: 'absolute', top: 120, right: 0, zIndex: 2 }} delay={1500} duration={1400} />
          <AnimatedStar size={13} style={{ position: 'absolute', bottom: 60, right: 10, zIndex: 2 }} delay={1800} duration={1400} />
          <AnimatedStar size={17} style={{ position: 'absolute', bottom: 60, left: 10, zIndex: 2 }} delay={2100} duration={1400} />
          <View 
            position="absolute"
            width={260}
            height={260}
            bgColor='rgba(37, 99, 235, 0.5)'
            borderRadius={100}
            shadowColor="#2563eb"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={1}
            shadowRadius={20}
            elevation={10}
            zIndex={1}
          />
          <FelipeMascotItinerary width={250} height={250} style={{ zIndex: 2 }} />
        </View>
        <Text mt={15} fontWeight="$bold" fontSize="$xl" textAlign="center" color="white">Finalize os parâmetros do seu novo roteiro</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }} showsVerticalScrollIndicator={true}>
        <View>
          <View>
            <View mb={20}>
              <FormControl isInvalid={!!errors.budget}>
                <FormControlLabel>
                  <FormControlLabelText fontSize={16} color="white" mb={8}>
                    Orçamento máximo a ser gasto nesta viagem
                  </FormControlLabelText>
                </FormControlLabel>
                <Input borderWidth={1} borderColor="#D1D5DB" borderRadius={12} padding={8} bgColor="#FFF">
                  <InputField 
                    placeholder="0" 
                    keyboardType="numeric" 
                    value={String(budget)}
                    onChangeText={(text) => {
                      setBudget(Number(text.replace(/[^0-9]/g, "")));
                      clearFieldError('budget');
                    }}
                  />
                </Input>
                {errors.budget && (
                  <FormControlError>
                    <FormControlErrorText style={{ color: '#fbbf24' }}>
                      {errors.budget}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>
            <View mb={20}>
              <FormControl isInvalid={!!errors.peopleQuantity}>
                <FormControlLabel>
                  <FormControlLabelText fontSize={16} color="white" mb={8}>
                    Quantas pessoas te acompanham?
                  </FormControlLabelText>
                </FormControlLabel>
                <Input borderWidth={1} borderColor="#D1D5DB" borderRadius={12} padding={8} bgColor="#FFF">
                  <InputField 
                    placeholder="0" 
                    keyboardType="numeric" 
                    value={String(peopleQuantity)}
                    onChangeText={(text) => {
                      setPeopleQuantity(Number(text.replace(/[^0-9]/g, "")));
                      clearFieldError('peopleQuantity');
                    }}
                  />
                </Input>
                {errors.peopleQuantity && (
                  <FormControlError>
                    <FormControlErrorText style={{ color: '#fbbf24' }}>
                      {errors.peopleQuantity}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>
            <View flexDirection="column" mb={20}>
              <FormControl isInvalid={!!errors.acconpanyingType}>
                <FormControlLabel>
                  <FormControlLabelText fontSize={16} color="white" mb={8}>
                    Quem te acompanha?
                  </FormControlLabelText>
                </FormControlLabel>
                <View flexDirection="row" ml={5}>
                  <Checkbox 
                    isDisabled={false} 
                    isInvalid={false} 
                    size="lg" 
                    value={acconpanyingType === "Family" ? "checked" : ""}
                    mr={20}
                    onPress={() => handleAccompanying("Family")}
                  >
                    <CheckboxIndicator 
                      borderColor="white" 
                      borderWidth={2}
                      borderRadius={6}
                      bgColor="transparent"
                    >
                      <CheckboxIcon as={Check} color="white" />
                    </CheckboxIndicator>
                    <CheckboxLabel ml={5} color="white" fontSize={16}>Família</CheckboxLabel>
                  </Checkbox>
                  <Checkbox 
                    isDisabled={false} 
                    isInvalid={false} 
                    size="lg" 
                    value={acconpanyingType === "Friends" ? "checked" : ""}
                    mr={20}
                    onPress={() => handleAccompanying("Friends")}
                  >
                    <CheckboxIndicator 
                      borderColor="white" 
                      borderWidth={2}
                      borderRadius={6}
                      bgColor="transparent"
                    >
                      <CheckboxIcon as={Check} color="white" />
                    </CheckboxIndicator>
                    <CheckboxLabel ml={5} color="white" fontSize={16}>Amigos</CheckboxLabel>
                  </Checkbox>
                </View>
                {errors.acconpanyingType && (
                  <FormControlError>
                    <FormControlErrorText style={{ color: '#fbbf24' }}>
                      {errors.acconpanyingType}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>
            <View flexDirection="column" mb={20}>
              <FormControl isInvalid={!!errors.tripStyle}>
                <FormControlLabel>
                  <FormControlLabelText fontSize={16} color="white" mb={8}>
                    Qual estilo de viagem você prefere?
                  </FormControlLabelText>
                </FormControlLabel>
                <View flexDirection="row" ml={5}>
                  <Checkbox 
                    isDisabled={false}
                    isInvalid={false} 
                    size="lg" 
                    value={tripStyle.includes("Urban") ? "Urban" : ""} 
                    isChecked={tripStyle.includes("Urban")}
                    mr={20}
                    onPress={() => handleTripStyle("Urban")}
                  >
                    <CheckboxIndicator borderColor="white" borderWidth={2} borderRadius={6} bgColor="transparent">
                      <CheckboxIcon as={Check} color="white" />
                    </CheckboxIndicator>
                    <CheckboxLabel ml={5} color="white" fontSize={16}>Urbana</CheckboxLabel>
                  </Checkbox>
                  <Checkbox 
                    isDisabled={false}
                    isInvalid={false} 
                    size="lg" 
                    value={tripStyle.includes("Countryside") ? "Countryside" : ""} 
                    isChecked={tripStyle.includes("Countryside")}
                    mr={20}
                    onPress={() => handleTripStyle("Countryside")}
                  >
                    <CheckboxIndicator borderColor="white" borderWidth={2} borderRadius={6} bgColor="transparent">
                      <CheckboxIcon as={Check} color="white" />
                    </CheckboxIndicator>
                    <CheckboxLabel ml={5} color="white" fontSize={16}>Rural</CheckboxLabel>
                  </Checkbox>
                  <Checkbox 
                    isDisabled={tripStyle.includes("Urban") || tripStyle.includes("Countryside")}
                    isInvalid={false} 
                    size="lg" 
                    value={tripStyle.includes("Urban") && tripStyle.includes("Countryside") ? "Both" : ""}
                    isChecked={tripStyle.includes("Urban") && tripStyle.includes("Countryside")}
                    onPress={() => handleTripStyle("Both")}
                  >
                    <CheckboxIndicator borderColor="white" borderWidth={2} borderRadius={6} bgColor="transparent">
                      <CheckboxIcon as={Check} color="white" />
                    </CheckboxIndicator>
                    <CheckboxLabel ml={5} color="white" fontSize={16}>Ambos</CheckboxLabel>
                  </Checkbox>
                </View>
                {errors.tripStyle && (
                  <FormControlError>
                    <FormControlErrorText style={{ color: '#fbbf24' }}>
                      {errors.tripStyle}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>
            <View flexDirection="column" mb={20}>
              <FormControl isInvalid={!!errors.locomotionMethod}>
                <FormControlLabel>
                  <FormControlLabelText fontSize={16} color="white" mb={8}>
                    Método de locomoção preferido?
                  </FormControlLabelText>
                </FormControlLabel>
                <View flexDirection="row" flexWrap="wrap" rowGap={8} ml={5}>
                  {(["Car", "Motorcycle", "Foot", "Train", "Boat", "Bicycle"] as const).map(type => (
                    <Checkbox
                      key={type}
                      isDisabled={locomotionMethod.length >= 5 && !locomotionMethod.includes(type)}
                      isInvalid={false}
                      size="lg"
                      value={locomotionMethod.includes(type) ? "checked" : ""}
                      mr={20}
                      onPress={() => handleLocomotion(type)}
                    >
                      <CheckboxIndicator borderColor="white" borderWidth={2} borderRadius={6} bgColor="transparent">
                        <CheckboxIcon as={Check} color="white" />
                      </CheckboxIndicator>
                      <CheckboxLabel ml={5} color="white" fontSize={16}>{type === "Foot" ? "Caminhada" : type === "Motorcycle" ? "Moto" : type === "Car" ? "Carro" : type === "Train" ? "Trem" : type === "Boat" ? "Barco" : "Bicicleta"}</CheckboxLabel>
                    </Checkbox>
                  ))}
                </View>
                {errors.locomotionMethod && (
                  <FormControlError>
                    <FormControlErrorText style={{ color: '#fbbf24' }}>
                      {errors.locomotionMethod}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>
            <View mb={20}>
              <Text fontSize={16} color="white" mb={8}>Algum desejo especial para esta viagem?</Text>
              <Input borderWidth={1} borderColor="#D1D5DB" borderRadius={12} padding={8} bgColor="#FFF">
                <InputField 
                  placeholder="Eu gostaria de fazer algo específico nesta viagem..." 
                  maxLength={100}
                  value={specialWish}
                  onChangeText={setSpecialWish}
                />
              </Input>
            </View>
            <View mt={20} flexDirection="row" justifyContent="center">
              <ButtonGroup width="100%" flexDirection='row' justifyContent='space-between' gap={16}>
                <Button
                  onPress={() => navigation.goBack()}
                  w="48%"
                  bgColor="#ff4d4f"
                  borderRadius={16}
                  shadowColor="#000"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.2}
                  shadowRadius={4}
                  elevation={3}
                  $active-opacity={0.7}
                >
                  <ButtonText color="#fff" fontWeight="$bold" fontSize={16}>Cancelar</ButtonText>
                </Button>
                <Button
                  onPress={ 
                    () => {
                      if (!validateForm()) {
                        return;
                      }
                      navigation.navigate("UserPreferences", {
                        title,
                        dateBegin,
                        dateEnd,
                        days,
                        continent,
                        countries,
                        originCountry,
                        contacts,
                        budget,
                        peopleQuantity,
                        acconpanying: acconpanyingType!,
                        tripStyle,
                        locomotionMethod: locomotionMethod,
                        specialWish
                      });
                    }
                  }
                  w="48%"
                  bgColor="#fff"
                  borderRadius={16}
                  shadowColor="#000"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.2}
                  shadowRadius={4}
                  elevation={3}
                  $active-opacity={0.7}
                  borderWidth={2}
                  borderColor="#2752B7"
                >
                  <ButtonText color="#2752B7" fontWeight="$bold" fontSize={16}>Próximo</ButtonText>
                </Button>
              </ButtonGroup>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}