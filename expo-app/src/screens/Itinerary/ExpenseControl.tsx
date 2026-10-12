import { useState, useCallback } from "react";

import { SafeAreaView, StatusBar, TouchableOpacity, Alert, TextInput, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { ScrollView, Text, View, Spinner, Button, ButtonText, Progress, ProgressFilledTrack } from "@gluestack-ui/themed";

import { 
  ArrowLeft, 
  Trash2, 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Plane, 
  Bed, 
  UtensilsCrossed, 
  ShoppingCart, 
  Activity, 
  AlertCircle,
  MoreHorizontal, 
  Banknote, 
  Edit2, 
  X, 
  Check, 
  DollarSign 
} from "lucide-react-native";

import { IconButton } from "@components/Buttons/IconButton";

import { AuthNavigationProp } from "@routes/auth.routes";

import { useExpenseControl } from "../../hooks/useExpenseControl";

import { Expense, ExpenseCategory } from "../../../@types/ExpenseControlTypes";

export function ExpenseControl() {
  const navigation = useNavigation<AuthNavigationProp>();
  const { expenses, isLoading, budgetLimit, removeExpense, updateExpense, getTotalExpenses, getExpensesByCategory, clearAllExpenses, setBudgetLimitValue, getBudgetProgress, reloadExpenses } = useExpenseControl();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"Todos" | ExpenseCategory>("Todos");
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editAmount, setEditAmount] = useState("");

  useFocusEffect(
    useCallback(() => {
      reloadExpenses();
    }, [reloadExpenses])
  );

  const handleRemoveExpense = async (expenseId: string, expenseTitle: string) => {
    Alert.alert(
      "Remover Gasto",
      `Deseja remover "${expenseTitle}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(expenseId);
            await removeExpense(expenseId);
            setIsDeleting(null);
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Limpar Todos os Gastos",
      "Deseja realmente remover todos os gastos? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar Tudo",
          style: "destructive",
          onPress: clearAllExpenses
        }
      ]
    );
  };

  const handleSetBudget = () => {
    if (isEditingBudget) {
      const value = parseFloat(budgetInput);
      if (!isNaN(value) && value > 0) {
        setBudgetLimitValue(value);
      } else if (budgetInput === "") {
        setBudgetLimitValue(null);
      }
      setIsEditingBudget(false);
      setBudgetInput("");
    } else {
      setIsEditingBudget(true);
      setBudgetInput(budgetLimit?.toString() || "");
    }
  };

  const handleCancelBudgetEdit = () => {
    setIsEditingBudget(false);
    setBudgetInput("");
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setEditAmount(expense.amount.toString());
  };

  const handleSaveEditExpense = async () => {
    if (!editingExpense || !editAmount || parseFloat(editAmount) <= 0) {
      return;
    }

    await updateExpense(editingExpense.id, {
      amount: parseFloat(editAmount)
    });

    setEditingExpense(null);
    setEditAmount("");
  };

  const handleCancelEditExpense = () => {
    setEditingExpense(null);
    setEditAmount("");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return dateString;
    }
  };

  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case "Transporte":
        return Plane;
      case "Hospedagem":
        return Bed;
      case "Alimentação":
        return UtensilsCrossed;
      case "Atividades":
        return Activity;
      case "Compras":
        return ShoppingCart;
      case "Emergência":
        return AlertCircle;
      default:
        return MoreHorizontal;
    }
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    switch (category) {
      case "Transporte":
        return "#3B82F6";
      case "Hospedagem":
        return "#8B5CF6";
      case "Alimentação":
        return "#10B981";
      case "Atividades":
        return "#F59E0B";
      case "Compras":
        return "#EC4899";
      case "Emergência":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const filteredExpenses = selectedFilter === "Todos" 
    ? expenses 
    : expenses.filter(exp => exp.category === selectedFilter);

  const totalExpenses = getTotalExpenses();
  const expensesByCategory = getExpensesByCategory();

  const categories: ("Todos" | ExpenseCategory)[] = [
    "Todos",
    "Transporte",
    "Hospedagem",
    "Alimentação",
    "Atividades",
    "Compras",
    "Emergência",
    "Outros"
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar barStyle="dark-content" />
      
      <View px={15} mt={5} flexDirection="row" justifyContent="space-between" alignItems="center">
        <IconButton 
          icon={ArrowLeft}
          iconSize="xl"
          iconColor="#000"
          buttonBgColor="transparent"
          buttonFunctionality={() => navigation.goBack()}
          styles={{ marginLeft: -15 }}
        />
        { expenses.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <View flexDirection="row" alignItems="center" px={15} py={8} bgColor="#FF3B30" borderRadius={20}>
              <Trash2 size={18} color="#FFF" style={{ marginRight: 5 }} />
              <Text color="#FFF" fontSize="$sm" fontWeight="$semibold">Limpar Tudo</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Text color='#2752B7' ml={25} mt={20} fontSize="$3xl" fontWeight="$bold">Controle de Gastos</Text>
      
      <View 
        bgColor="#2752B7"
        borderRadius={20}
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.15}
        shadowRadius={8}
        elevation={5}
        mx={15}
        mt={20}
        p={20}
      >
        <View flexDirection="row" alignItems="center" justifyContent="space-between" mb={10}>
          <View flexDirection="row" alignItems="center">
            <Wallet size={24} color="#FFF" />
            <Text color="#FFF" fontSize="$sm" fontWeight="$medium" ml={8}>Total de Gastos</Text>
          </View>
          <TouchableOpacity onPress={handleSetBudget}>
            <View bgColor="#FFFFFF20" p={8} borderRadius={12}>
              <Banknote size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>
        <Text color="#FFF" fontSize="$4xl" fontWeight="$bold">{ formatCurrency(totalExpenses) }</Text>
        <Text color="#E0E7FF" fontSize="$sm" mt={5}>
          {expenses.length} {expenses.length === 1 ? 'gasto registrado' : 'gastos registrados'}
        </Text>
        
        { budgetLimit && (
          <View mt={15}>
            <View flexDirection="row" justifyContent="space-between" mb={8}>
              <Text fontSize="$xs" color="#E0E7FF">
                Limite: {formatCurrency(budgetLimit)}
              </Text>
              <Text 
                fontSize="$xs" 
                fontWeight="$semibold"
                color={ getBudgetProgress() >= 100 ? "#FEE2E2" : getBudgetProgress() >= 80 ? "#FEF3C7" : "#E0E7FF" }
              >
                { getBudgetProgress().toFixed(1) }%
              </Text>
            </View>
            <Progress value={ getBudgetProgress() } h={8} borderRadius={6} bgColor="#FFFFFF30">
              <ProgressFilledTrack 
                h={8} 
                borderRadius={6}
                bgColor={
                  getBudgetProgress() >= 100 
                    ? "#FEE2E2" 
                    : getBudgetProgress() >= 80 
                    ? "#FEF3C7" 
                    : "#E0E7FF"
                }
              />
            </Progress>
            { getBudgetProgress() >= 80 && (
              <View 
                bgColor={ getBudgetProgress() >= 100 ? "#FEE2E2" : "#FEF3C7" } 
                p={10} 
                borderRadius={10} 
                mt={10}
                flexDirection="row"
                alignItems="center"
              >
                <AlertCircle 
                  size={16} 
                  color={ getBudgetProgress() >= 100 ? "#991B1B" : "#92400E" } 
                  style={{ marginRight: 8 }}
                />
                <Text 
                  fontSize="$xs" 
                  color={ getBudgetProgress() >= 100 ? "#991B1B" : "#92400E" }
                  flex={1}
                >
                  { getBudgetProgress() >= 100 
                    ? "Limite ultrapassado!" 
                    : "Próximo do limite"}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      { isEditingBudget && (
        <View
          bgColor="#FFF"
          borderRadius={20}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={5}
          elevation={3}
          mx={15}
          mt={15}
          p={20}
        >
          <View flexDirection="row" alignItems="center" justifyContent="space-between" mb={15}>
            <View flexDirection="row" alignItems="center">
              <Banknote size={22} color="#2752B7" />
              <Text color="#2752B7" fontSize="$md" fontWeight="$bold" ml={8}>
                {budgetLimit ? "Editar Limite" : "Definir Limite"}
              </Text>
            </View>
          </View>
          <TextInput
            value={budgetInput}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9.]/g, '');
              setBudgetInput(numericValue);
            }}
            placeholder="Digite o limite em R$"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            autoFocus
            style={{
              backgroundColor: "#F8F8F8",
              borderRadius: 12,
              padding: 14,
              fontSize: 16,
              color: "#000",
              borderWidth: 1,
              borderColor: "#2752B7",
              marginBottom: 10
            }}
          />
          <View flexDirection="row" gap={10}>
            <Button
              flex={1}
              bgColor="#F0F0F0"
              borderRadius={12}
              onPress={handleCancelBudgetEdit}
            >
              <X size={18} color="#666" style={{ marginRight: 5 }} />
              <ButtonText color="#666" fontWeight="$semibold">Cancelar</ButtonText>
            </Button>
            <Button
              flex={1}
              bgColor="#2752B7"
              borderRadius={12}
              onPress={handleSetBudget}
            >
              <Check size={18} color="#FFF" style={{ marginRight: 5 }} />
              <ButtonText color="#FFF" fontWeight="$semibold">Salvar</ButtonText>
            </Button>
          </View>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 20, marginLeft: 15, paddingBottom: 30 }}>
        { categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedFilter(category)}
            style={{ marginRight: 10 }}
          >
            <View
              bgColor={selectedFilter === category ? "#2752B7" : "#FFF"}
              px={16}
              py={10}
              minHeight={40}
              borderRadius={20}
              borderWidth={1}
              borderColor={selectedFilter === category ? "#2752B7" : "#E5E5E5"}
            >
              <Text
                color={selectedFilter === category ? "#FFF" : "#000"}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                {category}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      { selectedFilter !== "Todos" && expensesByCategory[selectedFilter as ExpenseCategory] !== undefined && (
        <View mx={15} mt={15} bgColor="#FFF" p={15} borderRadius={15}>
          <Text fontSize="$sm" color="#666" mb={5}>Total em {selectedFilter}</Text>
          <Text fontSize="$2xl" fontWeight="$bold" color={getCategoryColor(selectedFilter as ExpenseCategory)}>
            {formatCurrency(expensesByCategory[selectedFilter as ExpenseCategory] || 0)}
          </Text>
        </View>
      )}

      { selectedFilter === "Todos" && expenses.length > 0 && (
        <View mx={15} mt={15} bgColor="#EBF5FF" p={15} borderRadius={15} flexDirection="row" alignItems="center">
          <TrendingUp size={18} color="#2752B7" style={{ marginRight: 20 }} />
          <Text fontSize="$sm" color="#2752B7" flex={1}>
            Você pode filtrar os gastos por categoria. Experimente!
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
        { isLoading ? (
          <View flex={1} justifyContent="center" alignItems="center" py={50}>
            <Spinner size="large" color="#2752B7" />
            <Text mt={15} color="#666">Carregando gastos...</Text>
          </View>
        ) : filteredExpenses.length === 0 ? (
          <View 
            bgColor="#FFF"
            borderRadius={15}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.1}
            shadowRadius={5}
            elevation={5}
            mx={15}
            p={30}
            alignItems="center"
          >
            <CreditCard size={60} color="#CCC" />
            <Text fontSize="$xl" fontWeight="$semibold" color="#666" mt={15} textAlign="center">
              {selectedFilter === "Todos" ? "Nenhum gasto registrado" : `Nenhum gasto em ${selectedFilter}`}
            </Text>
            <Text fontSize="$sm" color="#999" mt={10} textAlign="center">
              Adicione gastos durante a visualização dos seus roteiros
            </Text>
          </View>
        ) : (
          filteredExpenses.map((expense) => {
            const CategoryIcon = getCategoryIcon(expense.category);
            const categoryColor = getCategoryColor(expense.category);

            return (
              <View
                key={ expense.id }
                bgColor="#FFF"
                borderRadius={15}
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.08}
                shadowRadius={4}
                elevation={3}
                mx={15}
                mb={12}
                p={16}
                flexDirection="row"
                alignItems="center"
              >
                <View 
                  bgColor={`${categoryColor}15`} 
                  p={12} 
                  borderRadius={12}
                  mr={12}
                >
                  <CategoryIcon size={24} color={ categoryColor } />
                </View>

                <View flex={1}>
                  <Text fontSize="$md" fontWeight="$bold" color="#000" mb={4}>
                    { expense.title }
                  </Text>
                  
                  <View flexDirection="row" alignItems="center" mb={2}>
                    <View 
                      bgColor={ categoryColor }
                      px={8}
                      py={2}
                      borderRadius={8}
                      mr={8}
                    >
                      <Text fontSize="$xs" color="#FFF" fontWeight="$semibold">
                        { expense.category }
                      </Text>
                    </View>
                    <Text fontSize="$xs" color="#999">
                      { formatDate(expense.date) }
                    </Text>
                  </View>

                  { expense.description && (
                    <Text fontSize="$xs" color="#666" numberOfLines={1} mb={4}>
                      { expense.description }
                    </Text>
                  )}

                  <Text fontSize="$sm" color="#666" numberOfLines={1}>
                    { expense.itineraryTitle }
                  </Text>
                </View>

                <View alignItems="flex-end">
                  <Text fontSize="$xl" fontWeight="$bold" color={categoryColor} mb={8}>
                    { formatCurrency(expense.amount) }
                  </Text>
                  
                  <View flexDirection="row" gap={8}>
                    <TouchableOpacity
                      onPress={ () => handleEditExpense(expense) }
                    >
                      <View 
                        bgColor="#E5F0FF" 
                        p={8} 
                        borderRadius={8}
                      >
                        <Edit2 size={16} color="#2752B7" />
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={ () => handleRemoveExpense(expense.id, expense.title) }
                      disabled={ isDeleting === expense.id }
                    >
                      <View 
                        bgColor="#FFE5E5" 
                        p={8} 
                        borderRadius={8}
                        opacity={ isDeleting === expense.id ? 0.5 : 1 }
                      >
                        {isDeleting === expense.id ? (
                          <Spinner size="small" color="#FF3B30" />
                        ) : (
                          <Trash2 size={16} color="#FF3B30" />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}

        <View mb={100} />
      </ScrollView>

      { editingExpense && (
        <Modal
          visible={!!editingExpense}
          transparent
          animationType="slide"
          onRequestClose={handleCancelEditExpense}
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
                p={20}
              >
                <View
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={20}
                >
                  <Text fontSize="$xl" fontWeight="$bold" color="#2752B7">
                    Editar Valor do Gasto
                  </Text>
                  <TouchableOpacity onPress={ handleCancelEditExpense }>
                    <X size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <View mb={20}>
                  <Text fontSize="$md" fontWeight="$semibold" color="#333" mb={8}>
                    { editingExpense.title }
                  </Text>
                  <Text fontSize="$sm" color="#666" mb={15}>
                    Valor atual: { formatCurrency(editingExpense.amount) }
                  </Text>
                  
                  <View flexDirection="row" alignItems="center" mb={8}>
                    <DollarSign size={18} color="#2752B7" />
                    <Text fontSize="$sm" fontWeight="$semibold" color="#333" ml={8}>
                      Novo Valor
                    </Text>
                  </View>
                  <TextInput
                    value={ editAmount }
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9.]/g, '');
                      setEditAmount(numericValue);
                    }}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    autoFocus
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderRadius: 12,
                      padding: 14,
                      fontSize: 16,
                      color: "#000",
                      borderWidth: 1,
                      borderColor: "#2752B7"
                    }}
                  />
                </View>

                <View flexDirection="row" gap={10}>
                  <Button
                    flex={1}
                    bgColor="#F0F0F0"
                    borderRadius={12}
                    onPress={ handleCancelEditExpense }
                  >
                    <X size={18} color="#666" style={{ marginRight: 5 }} />
                    <ButtonText color="#666" fontWeight="$semibold">Cancelar</ButtonText>
                  </Button>
                  <Button
                    flex={1}
                    bgColor="#2752B7"
                    borderRadius={12}
                    onPress={ handleSaveEditExpense }
                    disabled={ !editAmount || parseFloat(editAmount) <= 0 }
                    opacity={ !editAmount || parseFloat(editAmount) <= 0 ? 0.5 : 1 }
                  >
                    <Check size={18} color="#FFF" style={{ marginRight: 5 }} />
                    <ButtonText color="#FFF" fontWeight="$semibold">Salvar</ButtonText>
                  </Button>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </SafeAreaView>
  );
}