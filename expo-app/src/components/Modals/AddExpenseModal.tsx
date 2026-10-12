import { useState } from "react";
import { Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView as RNScrollView } from "react-native";

import { Calendar } from 'react-native-calendars';

import { View, Text, Button, ButtonText } from "@gluestack-ui/themed";

import { ExpenseCategory } from "../../../@types/ExpenseControlTypes";

import { X, DollarSign, FileText, Calendar as CalendarIcon, Tag } from "lucide-react-native";

type AddExpenseModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (expense: {
    title: string;
    amount: number;
    category: ExpenseCategory;
    description: string;
    date: string;
  }) => void;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultDate?: string;
  defaultLocation?: string;
  itineraryTitle: string;
};

export function AddExpenseModal({
  visible,
  onClose,
  onAdd,
  defaultTitle = "",
  defaultDescription = "",
  defaultDate = "",
  defaultLocation = "",
  itineraryTitle
}: AddExpenseModalProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Outros");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Reaplica os valores padrão ao abrir o modal ou quando eles mudam com o modal aberto.
  const resetKey = visible ? JSON.stringify([defaultTitle, defaultDescription, defaultDate]) : null;
  const [appliedResetKey, setAppliedResetKey] = useState<string | null>(null);
  if (resetKey !== appliedResetKey) {
    setAppliedResetKey(resetKey);
    if (visible) {
      setTitle(defaultTitle);
      setDescription(defaultDescription);
      setDate(defaultDate);
    }
  }

  const categories: ExpenseCategory[] = [
    "Transporte",
    "Hospedagem",
    "Alimentação",
    "Atividades",
    "Compras",
    "Emergência",
    "Outros"
  ];

  const handleAdd = () => {
    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      return;
    }

    onAdd({
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      description: description.trim(),
      date: date || new Date().toISOString().split('T')[0]
    });

    setTitle("");
    setAmount("");
    setCategory("Outros");
    setDescription("");
    setDate("");
    onClose();
  };

  const handleCancel = () => {
    setTitle("");
    setAmount("");
    setCategory("Outros");
    setDescription("");
    setDate("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View flex={1} bgColor="rgba(0, 0, 0, 0.5)" justifyContent="flex-end">
          <View
            bgColor="#FFF"
            borderTopLeftRadius={25}
            borderTopRightRadius={25}
            maxHeight="90%"
          >
            <View
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              p={20}
              borderBottomWidth={1}
              borderBottomColor="#F0F0F0"
            >
              <Text fontSize="$xl" fontWeight="$bold" color="#2752B7">
                Adicionar Gasto
              </Text>
              <TouchableOpacity onPress={handleCancel}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <RNScrollView style={{ maxHeight: 500 }}>
              <View p={20}>
                <View mb={20}>
                  <View flexDirection="row" alignItems="center" mb={8}>
                    <FileText size={18} color="#2752B7" />
                    <Text fontSize="$sm" fontWeight="$semibold" color="#333" ml={8}>
                      Título do Gasto
                    </Text>
                  </View>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Ex: Táxi para o hotel"
                    placeholderTextColor="#999"
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: 12,
                      padding: 14,
                      fontSize: 15,
                      color: "#000",
                      borderWidth: 1,
                      borderColor: "#E5E5E5"
                    }}
                  />
                </View>

                <View mb={20}>
                  <View flexDirection="row" alignItems="center" mb={8}>
                    <DollarSign size={18} color="#2752B7" />
                    <Text fontSize="$sm" fontWeight="$semibold" color="#333" ml={8}>
                      Valor
                    </Text>
                  </View>
                  <TextInput
                    value={amount}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9.]/g, '');
                      setAmount(numericValue);
                    }}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: 12,
                      padding: 14,
                      fontSize: 15,
                      color: "#000",
                      borderWidth: 1,
                      borderColor: "#E5E5E5"
                    }}
                  />
                </View>

                <View mb={20}>
                  <View flexDirection="row" alignItems="center" mb={8}>
                    <Tag size={18} color="#2752B7" />
                    <Text fontSize="$sm" fontWeight="$semibold" color="#333" ml={8}>
                      Categoria
                    </Text>
                  </View>
                  <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(cat)}
                        style={{ marginRight: 8 }}
                      >
                        <View
                          bgColor={category === cat ? "#2752B7" : "#F8F8F8"}
                          px={16}
                          py={10}
                          borderRadius={20}
                          borderWidth={1}
                          borderColor={category === cat ? "#2752B7" : "#E5E5E5"}
                        >
                          <Text
                            color={category === cat ? "#FFF" : "#666"}
                            fontSize="$sm"
                            fontWeight="$semibold"
                          >
                            {cat}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </RNScrollView>
                </View>

                <View mb={20}>
                  <View flexDirection="row" alignItems="center" mb={8}>
                    <FileText size={18} color="#2752B7" />
                    <Text fontSize="$sm" fontWeight="$semibold" color="#333" ml={8}>
                      Descrição (Opcional)
                    </Text>
                  </View>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Detalhes adicionais sobre o gasto"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: 12,
                      padding: 14,
                      fontSize: 15,
                      color: "#000",
                      borderWidth: 1,
                      borderColor: "#E5E5E5",
                      minHeight: 80,
                      textAlignVertical: "top"
                    }}
                  />
                </View>

                <View mb={10}>
                  <View flexDirection="row" alignItems="center" mb={8}>
                    <CalendarIcon size={18} color="#2752B7" />
                    <Text fontSize="$sm" fontWeight="$semibold" color="#333" ml={8}>
                      Data
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)}>
                    <View
                      bgColor="#F8F8F8"
                      p={14}
                      borderRadius={12}
                      borderWidth={1}
                      borderColor="#E5E5E5"
                    >
                      <Text fontSize="$sm" color={date ? "#000" : "#999"}>
                        {date ? (() => {
                          const [year, month, day] = date.split('-').map(Number);
                          const dateObj = new Date(year, month - 1, day);
                          return dateObj.toLocaleDateString('pt-BR');
                        })() : 'Selecione a data'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <View mt={10} borderRadius={12} overflow="hidden">
                      <Calendar
                        current={date || new Date().toISOString().split('T')[0]}
                        onDayPress={(day: any) => {
                          setDate(day.dateString);
                          setShowDatePicker(false);
                        }}
                        markedDates={{
                          [date || '']: { selected: true, selectedColor: '#2752B7' }
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
                </View>

                {defaultLocation && (
                  <View mb={10}>
                    <Text fontSize="$xs" color="#999" textAlign="center">
                      Local: {defaultLocation}
                    </Text>
                  </View>
                )}
              </View>
            </RNScrollView>

            <View
              p={20}
              borderTopWidth={1}
              borderTopColor="#F0F0F0"
              flexDirection="row"
              gap={10}
            >
              <Button
                flex={1}
                bgColor="#F0F0F0"
                borderRadius={12}
                onPress={handleCancel}
              >
                <ButtonText color="#666" fontWeight="$semibold">Cancelar</ButtonText>
              </Button>
              <Button
                flex={1}
                bgColor="#2752B7"
                borderRadius={12}
                onPress={handleAdd}
                disabled={!title.trim() || !amount || parseFloat(amount) <= 0}
                opacity={!title.trim() || !amount || parseFloat(amount) <= 0 ? 0.5 : 1}
              >
                <ButtonText color="#FFF" fontWeight="$semibold">Adicionar</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
