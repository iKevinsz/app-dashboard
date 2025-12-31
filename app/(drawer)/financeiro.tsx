import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Dimensions, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";
import { FontAwesome6, Feather, MaterialIcons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, DrawerActions } from "@react-navigation/native";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const screenWidth = Dimensions.get("window").width;

// --- DADOS DO DETALHAMENTO FINANCEIRO (Baseado na Imagem 2) ---
const DETALHAMENTO_DADOS = [
  { mes: "Jan/2025", receitas: 4500, despesas: 3200, saldo: 1300 },
  { mes: "Fev/2025", receitas: 5200, despesas: 2800, saldo: 2400 },
  { mes: "Mar/2025", receitas: 4800, despesas: 4100, saldo: 700 },
  { mes: "Abr/2025", receitas: 6100, despesas: 3500, saldo: 2600 },
  { mes: "Mai/2025", receitas: 5900, despesas: 3000, saldo: 2900 },
  { mes: "Jun/2025", receitas: 7200, despesas: 4500, saldo: 2700 },
  { mes: "Jul/2025", receitas: 8400, despesas: 3900, saldo: 4500 },
  { mes: "Ago/2025", receitas: 7800, despesas: 4200, saldo: 3600 },
  { mes: "Set/2025", receitas: 8900, despesas: 4800, saldo: 4100 },
  { mes: "Out/2025", receitas: 9500, despesas: 5100, saldo: 4400 },
  { mes: "Nov/2025", receitas: 10200, despesas: 5500, saldo: 4700 },
  { mes: "Dez/2025", receitas: 11500, despesas: 6000, saldo: 5500 },
];

export default function DashboardFaturamento() {
  const navigation = useNavigation();
  const [filtroAtivo, setFiltroAtivo] = useState("Ano");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [showFullReport, setShowFullReport] = useState(false);

  const opcoesFiltro = ["Dia", "Semana", "Mês", "Ano"];

  const formatMoney = (val: number) => {
    if (!isBalanceVisible) return "••••";
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const toggleReport = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFullReport(!showFullReport);
  };

  const tableData = showFullReport ? DETALHAMENTO_DADOS : DETALHAMENTO_DADOS.slice(0, 3);

  return (
    <View className="flex-1 bg-blue-900">
      <SafeAreaView className="flex-1" edges={['top']}>
        
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="bg-blue-800 p-2 rounded-lg"
            >
              <FontAwesome6 name="bars" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Faturamento</Text>
          </View>
          <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
            <Feather name={isBalanceVisible ? "eye" : "eye-off"} size={22} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 bg-gray-50 mt-2 rounded-t-[30px] overflow-hidden">
          <ScrollView 
            className="flex-1 px-5 pt-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            
            {/* CARDS DE RESUMO (Baseado na Imagem 1) */}
            <View className="flex-row justify-between mb-6">
              <View className="w-[31%] bg-white p-3 rounded-xl shadow-sm border border-gray-100 items-center">
                <Text className="text-[9px] text-gray-400 uppercase font-bold text-center">Vendas Dia</Text>
                <Text className="text-xs font-bold text-gray-800 mt-1">{formatMoney(0)}</Text>
              </View>
              <View className="w-[31%] bg-white p-3 rounded-xl shadow-sm border border-gray-100 items-center">
                <Text className="text-[9px] text-gray-400 uppercase font-bold text-center">Mês Atual</Text>
                <Text className="text-xs font-bold text-gray-800 mt-1">{formatMoney(0)}</Text>
              </View>
              <View className="w-[31%] bg-white p-3 rounded-xl shadow-sm border border-gray-100 items-center">
                <Text className="text-[9px] text-gray-400 uppercase font-bold text-center">Ano Atual</Text>
                <Text className="text-xs font-bold text-blue-600 mt-1">{formatMoney(79227.85)}</Text>
              </View>
            </View>

            {/* SEÇÃO: DETALHAMENTO FINANCEIRO (Baseado na Imagem 2) */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-800 font-bold text-sm">Detalhamento Financeiro</Text>
              <TouchableOpacity onPress={toggleReport}>
                <Text className="text-blue-600 font-bold text-xs">
                  {showFullReport ? "Recolher" : "Ver Relatório Completo"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              {/* Header da Tabela */}
              <View className="flex-row bg-gray-50 p-3 border-b border-gray-100">
                <Text className="flex-1 text-[10px] font-bold text-gray-400">MÊS</Text>
                <Text className="flex-1 text-[10px] font-bold text-gray-400 text-center">RECEITAS</Text>
                <Text className="flex-1 text-[10px] font-bold text-gray-400 text-center">DESPESAS</Text>
                <Text className="flex-1 text-[10px] font-bold text-gray-400 text-right">SALDO</Text>
              </View>

              {/* Linhas da Tabela */}
              {tableData.map((item, index) => (
                <View key={index} className="flex-row p-3 border-b border-gray-50 items-center">
                  <Text className="flex-1 text-[10px] font-medium text-gray-600">{item.mes}</Text>
                  <Text className="flex-1 text-[10px] font-bold text-green-600 text-center">{formatMoney(item.receitas)}</Text>
                  <Text className="flex-1 text-[10px] font-bold text-red-500 text-center">{formatMoney(item.despesas)}</Text>
                  <Text className="flex-1 text-[10px] font-bold text-blue-600 text-right">{formatMoney(item.saldo)}</Text>
                </View>
              ))}

              {/* Rodapé da Tabela (Total Anual) */}
              <View className="flex-row bg-blue-50/50 p-4 items-center">
                <Text className="flex-1 text-[10px] font-black text-gray-800 uppercase">TOTAL ANUAL</Text>
                <Text className="flex-1 text-[10px] font-black text-green-700 text-center">{formatMoney(576000)}</Text>
                <Text className="flex-1 text-[10px] font-black text-red-700 text-center">{formatMoney(150000)}</Text>
                <Text className="flex-1 text-[10px] font-black text-blue-700 text-right">{formatMoney(426000)}</Text>
              </View>
            </View>

            {/* SEÇÃO: MEIOS DE PAGAMENTO (Mantendo do anterior) */}
            <Text className="text-gray-800 font-bold text-sm mb-3">Meios de Pagamento (Ano)</Text>
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 items-center">
              <PieChart
                data={[
                  { name: "Crédito", population: 18500, color: "#3B82F6" },
                  { name: "Pix", population: 12200, color: "#22C55E" },
                  { name: "Débito", population: 5400, color: "#EAB308" },
                  { name: "Dinheiro", population: 2100, color: "#F97316" },
                ]}
                width={screenWidth - 80}
                height={180}
                chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 0]}
                absolute
              />
            </View>

          </ScrollView>

          {/* NAVBAR DE FILTRO INFERIOR */}
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 pb-8 flex-row justify-between items-center shadow-lg">
             {opcoesFiltro.map((item) => {
               const isActive = filtroAtivo === item;
               return (
                 <TouchableOpacity 
                    key={item}
                    onPress={() => setFiltroAtivo(item)}
                    className={`px-4 py-2 rounded-full ${isActive ? 'bg-blue-600' : 'transparent'}`}
                 >
                    <Text className={`font-bold text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}>
                        {item}
                    </Text>
                 </TouchableOpacity>
               );
             })}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}