import { useEffect, useState } from "react";
import {
  ScrollView,
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as Contacts from 'expo-contacts';

import { Calendar, DateData } from 'react-native-calendars';

import { 
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField
} from '@gluestack-ui/themed';

import { styles } from './styles/itineraryStyles';

import { originCountries } from "../../data/places";

import { AuthNavigationProp } from "@routes/auth.routes";

import { X, Plus, Minus, ChevronDown } from "lucide-react-native";

type GenerateItineraryPreferencesFormTypes = {
  budget: number,
  peopleQuantity: number,
  acconpanying: "Family" | "Friends",
  tripStyle: "Urban" | "Countryside",
  vehicleLocomotionTypes: "Car" | "Motorcycle" | "Foot" | "Train" | "Boat" | "Bicycle",
  locomotionMethod: GenerateItineraryPreferencesFormTypes["vehicleLocomotionTypes"][],
  specialWish: string
}

type ItineraryPreferencesModalTypes = {
  showAlertDialog: boolean,
  setShowAlertDialog: (show: boolean) => void
}

export function ItineraryPreferencesModal({ showAlertDialog, setShowAlertDialog }: ItineraryPreferencesModalTypes) {
  const [itineraryTitle, setItineraryTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  const [showDatePickers, setShowDatePickers] = useState<boolean>(false);
  const [activeCalendar, setActiveCalendar] = useState<'start' | 'end' | null>(null);
  const [days, setDays] = useState<number>(1);
  const [originCountry, setOriginCountry] = useState<string>("");
  const [showOriginCountrySelector, setShowOriginCountrySelector] = useState<boolean>(false);
  const [includeContacts, setIncludeContacts] = useState<boolean>(false);
  const [listContacts, setListContacts] = useState<Contacts.ExistingContact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contacts.ExistingContact[]>([]);
  const [budget, setBudget] = useState<GenerateItineraryPreferencesFormTypes["budget"]>(0);
  const [peopleQuantity, setPeopleQuantity] = useState<GenerateItineraryPreferencesFormTypes["peopleQuantity"]>(0);
  const [acconpanyingType, setAcconpanyingType] = useState<GenerateItineraryPreferencesFormTypes["acconpanying"]>();
  const [tripStyle, setTripStyle] = useState<("Urban" | "Countryside")[]>([]);
  const [specialWish, setSpecialWish] = useState<GenerateItineraryPreferencesFormTypes["specialWish"]>("");
  const [locomotionMethod, setLocomotionMethod] = useState<GenerateItineraryPreferencesFormTypes["vehicleLocomotionTypes"][]>([]);

  const [errors, setErrors] = useState<{
    itineraryTitle?: string;
    originCountry?: string;
    budget?: string;
    peopleQuantity?: string;
    acconpanyingType?: string;
    tripStyle?: string;
    locomotionMethod?: string;
  }>({});

  const navigation = useNavigation<AuthNavigationProp>();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!itineraryTitle.trim()) {
      newErrors.itineraryTitle = "Título do itinerário é obrigatório";
    }

    if (!originCountry.trim()) {
      newErrors.originCountry = "País de origem é obrigatório";
    }

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

  const calculateDays = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleStartDateChange = (day: DateData) => {
    const selectedDate = new Date(day.year, day.month - 1, day.day);
    setStartDate(selectedDate);
    if (selectedDate > endDate) {
      const newEndDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
      setEndDate(newEndDate);
      setDays(1);
    } else {
      const newDays = calculateDays(selectedDate, endDate);
      if (newDays > 45) {
        Alert.alert(
          'Limite de dias excedido',
          'O itinerário não pode ultrapassar 45 dias. Ajustando automaticamente para 45 dias.',
          [{ text: 'OK' }]
        );
        const adjustedEndDate = new Date(selectedDate.getTime() + 44 * 24 * 60 * 60 * 1000);
        setEndDate(adjustedEndDate);
        setDays(45);
      } else {
        setDays(newDays);
      }
    }
    setActiveCalendar(null);
  };

  const handleEndDateChange = (day: DateData) => {
    const selectedDate = new Date(day.year, day.month - 1, day.day);
    if (selectedDate >= startDate) {
      const newDays = calculateDays(startDate, selectedDate);
      if (newDays > 45) {
        Alert.alert(
          'Limite de dias excedido',
          'O itinerário não pode ultrapassar 45 dias. Ajustando automaticamente para 45 dias.',
          [{ text: 'OK' }]
        );
        const adjustedEndDate = new Date(startDate.getTime() + 44 * 24 * 60 * 60 * 1000);
        setEndDate(adjustedEndDate);
        setDays(45);
      } else {
        setEndDate(selectedDate);
        setDays(newDays);
      }
    }
    setActiveCalendar(null);
  };

  const incrementDays = () => {
    if (days >= 45) {
      Alert.alert(
        'Limite de dias excedido',
        'O itinerário não pode ultrapassar 45 dias. Por favor, ajuste as datas.',
        [{ text: 'OK' }]
      );
      return;
    }
    const newDays = days + 1;
    setDays(newDays);
    const newEndDate = new Date(startDate.getTime() + (newDays - 1) * 24 * 60 * 60 * 1000);
    setEndDate(newEndDate);
  };

  const decrementDays = () => {
    if (days > 1) {
      const newDays = days - 1;
      setDays(newDays);
      const newEndDate = new Date(startDate.getTime() + (newDays - 1) * 24 * 60 * 60 * 1000);
      setEndDate(newEndDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleAccompanying = (type: "Family" | "Friends") => {
    setAcconpanyingType(type);
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

  const toggleContactSelection = () => {
    const newValue = !includeContacts;
    setIncludeContacts(newValue);
    if (!newValue) {
      setSelectedContacts([]);
    }
  };

  const handleContactSelection = (contact: Contacts.ExistingContact) => {
    setSelectedContacts(prev => {
      const isAlreadySelected = prev.some(c => c.id === contact.id);
      if (isAlreadySelected) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const isContactSelected = (contact: Contacts.ExistingContact) => {
    return selectedContacts.some(c => c.id === contact.id);
  };

  const getLocomotionLabel = (type: GenerateItineraryPreferencesFormTypes["vehicleLocomotionTypes"]) => {
    const labels = {
      "Car": "Carro",
      "Motorcycle": "Moto", 
      "Foot": "Caminhada",
      "Train": "Trem",
      "Boat": "Barco",
      "Bicycle": "Bicicleta"
    };
    return labels[type];
  };

  const handleClose = () => setShowAlertDialog(false);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.FirstName, Contacts.Fields.LastName],
        });

        if (data.length > 0) {
          setListContacts(data);
        }
      }
    })();
  }, []);

  return (
    <>
      <Modal
        visible={showAlertDialog}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Itinerário Surpresa</Text>
              <TouchableOpacity 
                style={styles.nextButton} 
                onPress={() => {
                  if (!validateForm()) {
                    return;
                  }
                  handleClose();
                  navigation.navigate("UserPreferences", {
                    title: itineraryTitle,
                    dateBegin: startDate,
                    dateEnd: endDate,
                    days: days,
                    continent: "",
                    countries: [],
                    originCountry: originCountry,
                    contacts: selectedContacts,
                    budget,
                    peopleQuantity,
                    acconpanying: acconpanyingType!,
                    tripStyle,
                    locomotionMethod,
                    specialWish,
                    isSurpriseMode: true
                  });
                }}
              >
                <Text style={styles.nextButtonText}>Criar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <FormControl isInvalid={!!errors.itineraryTitle}>
                  <FormControlLabel>
                    <FormControlLabelText style={styles.sectionLabel}>
                      Título do itinerário
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input variant="outline" size="md">
                    <InputField
                      placeholder="Insira o título deste itinerário"
                      value={itineraryTitle}
                      onChangeText={(text) => {
                        setItineraryTitle(text);
                        clearFieldError('itineraryTitle');
                      }}
                      maxLength={19}
                      style={{ fontSize: 16 }}
                    />
                  </Input>
                  {errors.itineraryTitle && (
                    <FormControlError>
                      <FormControlErrorText style={{ color: '#ef4444' }}>
                        {errors.itineraryTitle}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </View>

              <View style={styles.section}>
                <View style={styles.dateRow}>
                  <View style={styles.dateColumn}>
                    <Text style={styles.dateLabel}>Início da viagem</Text>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setShowDatePickers(!showDatePickers)}
                    >
                      <Text style={styles.dateButtonTitle}>Definir Datas</Text>
                      <Text style={styles.dateButtonSubtitle}>
                        {formatDate(startDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.arrowContainer}>
                    <ChevronDown size={20} color="#666" />
                  </View>

                  <View style={styles.dateColumn}>
                    <Text style={styles.dateLabel}>Fim da viagem</Text>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setShowDatePickers(!showDatePickers)}
                    >
                      <Text style={styles.dateButtonTitle}>Definir Datas</Text>
                      <Text style={styles.dateButtonSubtitle}>
                        {formatDate(endDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {showDatePickers && (
                  <View style={styles.calendarContainer}>
                    <View style={styles.datePickersRow}>
                      <View style={styles.datePickerColumn}>
                        <Text style={styles.datePickerLabel}>Data de Início</Text>
                        <TouchableOpacity
                          onPress={() => setActiveCalendar(activeCalendar === 'start' ? null : 'start')}
                          style={{
                            backgroundColor: '#F8F8F8',
                            padding: 12,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: activeCalendar === 'start' ? '#2752B7' : '#E5E5E5',
                            marginBottom: 10
                          }}
                        >
                          <Text style={{ color: '#000', fontSize: 14 }}>
                            {formatDate(startDate)}
                          </Text>
                        </TouchableOpacity>
                        {activeCalendar === 'start' && (
                          <Calendar
                            current={startDate.toISOString().split('T')[0]}
                            onDayPress={handleStartDateChange}
                            minDate={new Date().toISOString().split('T')[0]}
                            maxDate={new Date(2030, 11, 31).toISOString().split('T')[0]}
                            markedDates={{
                              [startDate.toISOString().split('T')[0]]: { selected: true, selectedColor: '#2752B7' }
                            }}
                            theme={{
                              backgroundColor: '#F8F8F8',
                              calendarBackground: '#F8F8F8',
                              textSectionTitleColor: '#2752B7',
                              selectedDayBackgroundColor: '#2752B7',
                              selectedDayTextColor: '#ffffff',
                              todayTextColor: '#2752B7',
                              dayTextColor: '#2d4150',
                              textDisabledColor: '#d9e1e8',
                              monthTextColor: '#2752B7',
                              textMonthFontWeight: 'bold',
                              textDayFontSize: 14,
                              textMonthFontSize: 16,
                              textDayHeaderFontSize: 12
                            }}
                          />
                        )}
                      </View>
                      <View style={styles.datePickerColumn}>
                        <Text style={styles.datePickerLabel}>Data de Fim</Text>
                        <TouchableOpacity
                          onPress={() => setActiveCalendar(activeCalendar === 'end' ? null : 'end')}
                          style={{
                            backgroundColor: '#F8F8F8',
                            padding: 12,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: activeCalendar === 'end' ? '#2752B7' : '#E5E5E5',
                            marginBottom: 10
                          }}
                        >
                          <Text style={{ color: '#000', fontSize: 14 }}>
                            {formatDate(endDate)}
                          </Text>
                        </TouchableOpacity>
                        {activeCalendar === 'end' && (
                          <Calendar
                            current={endDate.toISOString().split('T')[0]}
                            onDayPress={handleEndDateChange}
                            minDate={startDate.toISOString().split('T')[0]}
                            maxDate={new Date(2030, 11, 31).toISOString().split('T')[0]}
                            markedDates={{
                              [endDate.toISOString().split('T')[0]]: { selected: true, selectedColor: '#2752B7' }
                            }}
                            theme={{
                              backgroundColor: '#F8F8F8',
                              calendarBackground: '#F8F8F8',
                              textSectionTitleColor: '#2752B7',
                              selectedDayBackgroundColor: '#2752B7',
                              selectedDayTextColor: '#ffffff',
                              todayTextColor: '#2752B7',
                              dayTextColor: '#2d4150',
                              textDisabledColor: '#d9e1e8',
                              monthTextColor: '#2752B7',
                              textMonthFontWeight: 'bold',
                              textDayFontSize: 14,
                              textMonthFontSize: 16,
                              textDayHeaderFontSize: 12
                            }}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.dayCounter}>
                  <View style={styles.dayCounterRow}>
                    <TouchableOpacity
                      style={styles.dayButton}
                      onPress={decrementDays}
                    >
                      <Minus size={20} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.dayDisplay}>
                      <Text style={styles.dayNumber}>{days}</Text>
                      <Text style={styles.dayLabel}>
                        {days === 1 ? 'Dia' : 'Dias'}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.dayButton, days >= 45 && { opacity: 0.5 }]}
                      onPress={incrementDays}
                      disabled={days >= 45}
                    >
                      <Plus size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  {days >= 45 && (
                    <View style={{ marginTop: 10, backgroundColor: '#FEF3C7', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#F59E0B' }}>
                      <Text style={{ color: '#D97706', fontSize: 12, textAlign: 'center', fontWeight: '600' }}>
                        Limite máximo de 45 dias atingido
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.section}>
                <FormControl isInvalid={!!errors.originCountry}>
                  <FormControlLabel>
                    <FormControlLabelText style={styles.sectionLabel}>
                      País de Origem
                    </FormControlLabelText>
                  </FormControlLabel>
                  <TouchableOpacity
                    style={styles.selector}
                    onPress={() => setShowOriginCountrySelector(!showOriginCountrySelector)}
                  >
                    <Text style={[styles.selectorText, originCountry && styles.selectorTextSelected]}>
                      {originCountry || "Selecione seu país de origem"}
                    </Text>
                    <ChevronDown size={16} color="#666" />
                  </TouchableOpacity>
                  {errors.originCountry && (
                    <FormControlError>
                      <FormControlErrorText style={{ color: '#ef4444' }}>
                        {errors.originCountry}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {showOriginCountrySelector && (
                  <View style={styles.dropdownContainer}>
                    <ScrollView style={styles.dropdown}>
                      {originCountries.map((country) => (
                        <TouchableOpacity
                          key={country}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setOriginCountry(country);
                            setShowOriginCountrySelector(false);
                            clearFieldError('originCountry');
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{country}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <FormControl isInvalid={!!errors.budget}>
                  <FormControlLabel>
                    <FormControlLabelText style={styles.sectionLabel}>
                      Orçamento máximo a ser gasto nesta viagem
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input variant="outline" size="md">
                    <InputField
                      placeholder="0"
                      keyboardType="numeric"
                      value={String(budget)}
                      onChangeText={(text) => {
                        setBudget(Number(text.replace(/[^0-9]/g, "")));
                        clearFieldError('budget');
                      }}
                      style={{ fontSize: 16 }}
                    />
                  </Input>
                  {errors.budget && (
                    <FormControlError>
                      <FormControlErrorText style={{ color: '#ef4444' }}>
                        {errors.budget}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </View>

              <View style={styles.section}>
                <FormControl isInvalid={!!errors.peopleQuantity}>
                  <FormControlLabel>
                    <FormControlLabelText style={styles.sectionLabel}>
                      Quantas pessoas te acompanham?
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input variant="outline" size="md">
                    <InputField
                      placeholder="0"
                      keyboardType="numeric"
                      value={String(peopleQuantity)}
                      onChangeText={(text) => {
                        setPeopleQuantity(Number(text.replace(/[^0-9]/g, "")));
                        clearFieldError('peopleQuantity');
                      }}
                      style={{ fontSize: 16 }}
                    />
                  </Input>
                  {errors.peopleQuantity && (
                    <FormControlError>
                      <FormControlErrorText style={{ color: '#ef4444' }}>
                        {errors.peopleQuantity}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </View>

              <View style={styles.section}>
                <FormControl isInvalid={!!errors.acconpanyingType}>
                  <FormControlLabel>
                    <FormControlLabelText style={styles.sectionLabel}>
                      Quem te acompanha nesta viagem?
                    </FormControlLabelText>
                  </FormControlLabel>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <TouchableOpacity
                      style={[
                        styles.contactOption,
                        acconpanyingType === "Family" && styles.contactOptionSelected,
                        { flex: 1, paddingHorizontal: 16, paddingVertical: 12 }
                      ]}
                      onPress={() => {
                        handleAccompanying("Family");
                        clearFieldError('acconpanyingType');
                      }}
                    >
                      <Text style={[styles.contactOptionTitle, { fontSize: 16 }]}>Família</Text>
                      <View style={[styles.checkbox, acconpanyingType === "Family" && styles.checkboxSelected]}>
                        {acconpanyingType === "Family" && <Text style={styles.checkboxText}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.contactOption,
                        acconpanyingType === "Friends" && styles.contactOptionSelected,
                        { flex: 1, paddingHorizontal: 16, paddingVertical: 12 }
                      ]}
                      onPress={() => {
                        handleAccompanying("Friends");
                        clearFieldError('acconpanyingType');
                      }}
                    >
                      <Text style={[styles.contactOptionTitle, { fontSize: 16 }]}>Amigos</Text>
                      <View style={[styles.checkbox, acconpanyingType === "Friends" && styles.checkboxSelected]}>
                        {acconpanyingType === "Friends" && <Text style={styles.checkboxText}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  </View>
                  {errors.acconpanyingType && (
                    <FormControlError>
                      <FormControlErrorText style={{ color: '#ef4444' }}>
                        {errors.acconpanyingType}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </View>

              <View style={styles.section}>
                <FormControl isInvalid={!!errors.tripStyle}>
                  <FormControlLabel>
                    <FormControlLabelText style={styles.sectionLabel}>
                      Qual estilo de viagem você prefere?
                    </FormControlLabelText>
                  </FormControlLabel>
                  <View style={{ flexDirection: 'column', gap: 8 }}>
                    <TouchableOpacity
                      style={[
                        styles.contactOption,
                        tripStyle.includes("Urban") && styles.contactOptionSelected
                      ]}
                      onPress={() => handleTripStyle("Urban")}
                    >
                      <Text style={[styles.contactOptionTitle, { fontSize: 16 }]}>Urbana</Text>
                      <View style={[styles.checkbox, tripStyle.includes("Urban") && styles.checkboxSelected]}>
                        {tripStyle.includes("Urban") && <Text style={styles.checkboxText}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.contactOption,
                        tripStyle.includes("Countryside") && styles.contactOptionSelected
                      ]}
                      onPress={() => handleTripStyle("Countryside")}
                    >
                      <Text style={[styles.contactOptionTitle, { fontSize: 16 }]}>Rural</Text>
                      <View style={[styles.checkbox, tripStyle.includes("Countryside") && styles.checkboxSelected]}>
                        {tripStyle.includes("Countryside") && <Text style={styles.checkboxText}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.contactOption,
                        (tripStyle.includes("Urban") && tripStyle.includes("Countryside")) && styles.contactOptionSelected
                      ]}
                      onPress={() => handleTripStyle("Both")}
                    >
                      <Text style={[styles.contactOptionTitle, { fontSize: 16 }]}>Ambos</Text>
                      <View style={[styles.checkbox, (tripStyle.includes("Urban") && tripStyle.includes("Countryside")) && styles.checkboxSelected]}>
                        {(tripStyle.includes("Urban") && tripStyle.includes("Countryside")) && <Text style={styles.checkboxText}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  </View>
                  {errors.tripStyle && (
                    <FormControlError>
                      <FormControlErrorText style={{ color: '#ef4444' }}>
                        {errors.tripStyle}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </View>

              <View style={styles.section}>
                <FormControl isInvalid={!!errors.locomotionMethod}>
                  <FormControlLabel>
                    <FormControlLabelText style={styles.sectionLabel}>
                      Método de locomoção preferido? (máximo 5)
                    </FormControlLabelText>
                  </FormControlLabel>
                  <View style={{ flexDirection: 'column', gap: 8 }}>
                    {(["Car", "Motorcycle", "Foot", "Train", "Boat", "Bicycle"] as const).map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.contactOption,
                          locomotionMethod.includes(type) && styles.contactOptionSelected,
                          locomotionMethod.length >= 5 && !locomotionMethod.includes(type) && { opacity: 0.5 }
                        ]}
                        onPress={() => handleLocomotion(type)}
                        disabled={locomotionMethod.length >= 5 && !locomotionMethod.includes(type)}
                      >
                        <Text style={[styles.contactOptionTitle, { fontSize: 16 }]}>
                          {getLocomotionLabel(type)}
                        </Text>
                        <View style={[styles.checkbox, locomotionMethod.includes(type) && styles.checkboxSelected]}>
                          {locomotionMethod.includes(type) && <Text style={styles.checkboxText}>✓</Text>}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.locomotionMethod && (
                    <FormControlError>
                      <FormControlErrorText style={{ color: '#ef4444' }}>
                        {errors.locomotionMethod}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Algum desejo especial para esta viagem?</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Eu gostaria de fazer algo específico nesta viagem..."
                  maxLength={100}
                  value={specialWish}
                  onChangeText={setSpecialWish}
                  placeholderTextColor="#9CA3AF"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Opções Avançadas</Text>
                <TouchableOpacity
                  style={[styles.contactOption, includeContacts && styles.contactOptionSelected]}
                  onPress={toggleContactSelection}
                >
                  <View style={styles.contactOptionContent}>
                    <Text style={styles.contactOptionTitle}>Incluir Contatos</Text>
                    <Text style={styles.contactOptionSubtitle}>
                      Compartilhar itinerário com amigos
                    </Text>
                  </View>
                  <View style={[styles.checkbox, includeContacts && styles.checkboxSelected]}>
                    {includeContacts && <Text style={styles.checkboxText}>✓</Text>}
                  </View>
                </TouchableOpacity>

                {includeContacts && listContacts && (
                  <View>
                    {selectedContacts.length > 0 && (
                      <View style={styles.selectedContactsContainer}>
                        <Text style={styles.sectionLabel}>
                          {selectedContacts.length} contato{selectedContacts.length > 1 ? 's' : ''} selecionado{selectedContacts.length > 1 ? 's' : ''}
                        </Text>
                        <View style={styles.selectedContactsRow}>
                          {selectedContacts.map((contact, index) => (
                            <View key={index} style={styles.selectedContactTag}>
                              <Text style={styles.selectedContactText}>
                                {contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Contato sem nome'}
                              </Text>
                              <TouchableOpacity 
                                onPress={() => handleContactSelection(contact)}
                                style={styles.removeContactButton}
                              >
                                <X size={14} color="#666" />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                    
                    <Text style={styles.sectionLabel}>
                      {selectedContacts.length === 0 ? 'Selecione os contatos para compartilhar' : 'Seus contatos'}
                    </Text>
                    
                    {listContacts.length > 0 ? (
                      listContacts.map((data, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={[
                            styles.contactItem,
                            isContactSelected(data) && styles.contactItemSelected
                          ]}
                          onPress={() => handleContactSelection(data)}
                        >
                          <View style={styles.contactInfo}>
                            <Image 
                              source={ require('@assets/profile.png') } 
                              style={styles.contactImage}
                            />
                            <Text style={styles.contactName}>
                              {data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Contato sem nome'}
                            </Text>
                          </View>
                          <View style={[styles.checkbox, isContactSelected(data) && styles.checkboxSelected]}>
                            {isContactSelected(data) && <Text style={styles.checkboxText}>✓</Text>}
                          </View>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.contactItem}>
                        <Text style={styles.contactName}>Nenhum contato disponível</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              <View style={[styles.section, styles.lastSection]}>
                <Text style={styles.sectionLabel}>Informações Adicionais</Text>
                <Text style={styles.infoText}>
                  Qualquer ajuste manual nos destinos será automaticamente atualizado nos itinerários dos contatos selecionados.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
