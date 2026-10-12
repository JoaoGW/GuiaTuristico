import { useEffect, useState } from "react";
import {
  ScrollView,
  Modal,
  View,
  Text,
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

import { continents, countries, originCountries } from "@data/places";

import { AuthNavigationProp } from "@routes/auth.routes";

import { X, Plus, Minus, ChevronDown } from "lucide-react-native";

type showAlertDialogTypes = {
  showAlertDialog: boolean,
  setShowAlertDialog: (show: boolean) => void
}

export function ItineraryCreateDialog({ showAlertDialog, setShowAlertDialog }: showAlertDialogTypes) {
  const [itineraryTitle, setItineraryTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  const [activeCalendar, setActiveCalendar] = useState<'start' | 'end' | null>(null);
  const [days, setDays] = useState<number>(1);
  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [originCountry, setOriginCountry] = useState<string>("");
  const [showOriginCountrySelector, setShowOriginCountrySelector] = useState<boolean>(false);
  const [includeContacts, setIncludeContacts] = useState<boolean>(false);
  const [listContacts, setListContacts] = useState<Contacts.ExistingContact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contacts.ExistingContact[]>([]);
  const [showContinentSelector, setShowContinentSelector] = useState<boolean>(false);
  const [showCountrySelector, setShowCountrySelector] = useState<boolean>(false);

  // Estados para controlar erros de validação
  const [errors, setErrors] = useState<{
    itineraryTitle?: string;
    originCountry?: string;
    selectedContinent?: string;
    selectedCountries?: string;
  }>({});

  const navigation = useNavigation<AuthNavigationProp>();

  // Função de validação dos campos obrigatórios
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!itineraryTitle.trim()) {
      newErrors.itineraryTitle = "Título do itinerário é obrigatório";
    }

    if (!originCountry.trim()) {
      newErrors.originCountry = "País de origem é obrigatório";
    }

    if (!selectedContinent.trim()) {
      newErrors.selectedContinent = "Continente é obrigatório";
    }

    if (selectedCountries.length === 0) {
      newErrors.selectedCountries = "Selecione pelo menos um país";
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

  const selectContinent = (continent: string) => {
    setSelectedContinent(continent);
    setSelectedCountries([]);
    setShowContinentSelector(false);
    clearFieldError('selectedContinent');
  };

  const toggleCountrySelection = (country: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(country)) {
        return prev.filter(c => c !== country);
      } else {
        return [...prev, country];
      }
    });
    clearFieldError('selectedCountries');
  };

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

  const toggleContactSelection = () => {
    const newValue = !includeContacts;
    setIncludeContacts(newValue);
    if (!newValue) {
      // Limpa os contatos selecionados quando desabilita a opção
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

  const handleClose = () => setShowAlertDialog(false);

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
              <Text style={styles.headerTitle}>Criar Itinerário</Text>
              <TouchableOpacity 
                style={styles.nextButton} 
                onPress={ () => {
                  if (!validateForm()) {
                    return;
                  }
                  handleClose();
                  navigation.navigate("GenerateItineraryPreferences", { 
                    title: itineraryTitle, 
                    dateBegin: startDate, 
                    dateEnd: endDate, 
                    days: days, 
                    continent: selectedContinent, 
                    countries: selectedCountries, 
                    originCountry: originCountry,
                    contacts: selectedContacts 
                  } );
                } }
              >
                <Text style={styles.nextButtonText}>Próximo</Text>
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
                      onPress={() => setActiveCalendar(activeCalendar === 'start' ? null : 'start')}
                    >
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
                      onPress={() => setActiveCalendar(activeCalendar === 'end' ? null : 'end')}
                    >
                      <Text style={styles.dateButtonSubtitle}>
                        {formatDate(endDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {activeCalendar && (
                  <View style={{ marginTop: 15, borderRadius: 12, overflow: 'hidden' }}>
                    <Calendar
                      current={activeCalendar === 'start' ? startDate.toISOString().split('T')[0] : endDate.toISOString().split('T')[0]}
                      onDayPress={activeCalendar === 'start' ? handleStartDateChange : handleEndDateChange}
                      minDate={activeCalendar === 'start' ? new Date().toISOString().split('T')[0] : startDate.toISOString().split('T')[0]}
                      maxDate={new Date(2030, 11, 31).toISOString().split('T')[0]}
                      markedDates={{
                        [(activeCalendar === 'start' ? startDate : endDate).toISOString().split('T')[0]]: { 
                          selected: true, 
                          selectedColor: '#2752B7' 
                        }
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
                        Limite máximo de 45 dias atingido!
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
                <FormControl isInvalid={!!errors.selectedContinent}>
                  <FormControlLabel>
                    <FormControlLabelText style={styles.sectionLabel}>
                      Continente
                    </FormControlLabelText>
                  </FormControlLabel>
                  <TouchableOpacity
                    style={styles.selector}
                    onPress={() => setShowContinentSelector(!showContinentSelector)}
                  >
                    <Text style={[styles.selectorText, selectedContinent && styles.selectorTextSelected]}>
                      {selectedContinent || "Selecione um continente"}
                    </Text>
                    <ChevronDown size={16} color="#666" />
                  </TouchableOpacity>
                  {errors.selectedContinent && (
                    <FormControlError>
                      <FormControlErrorText style={{ color: '#ef4444' }}>
                        {errors.selectedContinent}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {showContinentSelector && (
                  <View style={styles.dropdownContainer}>
                    <ScrollView style={styles.dropdown}>
                      {continents.map((continent) => (
                        <TouchableOpacity
                          key={continent}
                          style={styles.dropdownItem}
                          onPress={() => selectContinent(continent)}
                        >
                          <Text style={styles.dropdownItemText}>{continent}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {selectedContinent && (
                <View style={styles.section}>
                  <FormControl isInvalid={!!errors.selectedCountries}>
                    <FormControlLabel>
                      <FormControlLabelText style={styles.sectionLabel}>
                        Países
                      </FormControlLabelText>
                    </FormControlLabel>
                    <TouchableOpacity
                      style={styles.selector}
                      onPress={() => setShowCountrySelector(!showCountrySelector)}
                    >
                      <Text style={[styles.selectorText, selectedCountries.length > 0 && styles.selectorTextSelected]}>
                        {selectedCountries.length > 0 
                          ? `${selectedCountries.length} país${selectedCountries.length > 1 ? 'es' : ''} selecionado${selectedCountries.length > 1 ? 's' : ''}`
                          : "Selecione países"
                        }
                      </Text>
                      <ChevronDown size={16} color="#666" />
                    </TouchableOpacity>
                    {errors.selectedCountries && (
                      <FormControlError>
                        <FormControlErrorText style={{ color: '#ef4444' }}>
                          {errors.selectedCountries}
                        </FormControlErrorText>
                      </FormControlError>
                    )}
                  </FormControl>

                  {selectedCountries.length > 0 && (
                    <View style={styles.selectedCountriesContainer}>
                      {selectedCountries.map((country) => (
                        <View key={country} style={styles.selectedCountryTag}>
                          <Text style={styles.selectedCountryText}>{country}</Text>
                          <TouchableOpacity 
                            onPress={() => toggleCountrySelection(country)}
                            style={styles.removeCountryButton}
                          >
                            <X size={14} color="#666" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  {showCountrySelector && (
                    <View style={styles.dropdownContainer}>
                      <ScrollView style={styles.dropdown}>
                        {countries[selectedContinent as keyof typeof countries]?.map((country) => (
                          <TouchableOpacity
                            key={country}
                            style={styles.dropdownItem}
                            onPress={() => toggleCountrySelection(country)}
                          >
                            <Text style={styles.dropdownItemText}>{country}</Text>
                            <View style={[styles.checkbox, selectedCountries.includes(country) && styles.checkboxSelected]}>
                              {selectedCountries.includes(country) && <Text style={styles.checkboxText}>✓</Text>}
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}

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