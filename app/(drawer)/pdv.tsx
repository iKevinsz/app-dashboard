import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { FontAwesome6, Feather, MaterialIcons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, DrawerActions } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

// --- DADOS DINÂMICOS POR FILTRO ---
const getDataByFilter = (filter: string) => {
  switch (filter) {
    case "Dia":
      return {
        financial: { gross: 1850, net: 520, expenses: 1330, ticket: 45.50, receivable: 120 },
        growth: "+2.5%",
        margin: "28%",
        pieChart: [
          { name: "Crédito", population: 40, color: "#3B82F6", icon: "credit-card" },
          { name: "Pix", population: 45, color: "#22C55E", icon: "pix" },
          { name: "Débito", population: 10, color: "#EAB308", icon: "credit-card" },
          { name: "Dinheiro", population: 5, color: "#F97316", icon: "money-bill-alt" },
        ]
      };
    case "Semana":
      return {
        financial: { gross: 12500, net: 4100, expenses: 8400, ticket: 68.00, receivable: 1500 },
        growth: "+8.1%",
        margin: "32%",
        pieChart: [
          { name: "Crédito", population: 50, color: "#3B82F6", icon: "credit-card" },
          { name: "Pix", population: 30, color: "#22C55E", icon: "pix" },
          { name: "Débito", population: 15, color: "#EAB308", icon: "credit-card" },
          { name: "Dinheiro", population: 5, color: "#F97316", icon: "money-bill-alt" },
        ]
      };
    case "Ano":
      return {
        financial: { gross: 450000, net: 135000, expenses: 315000, ticket: 102.50, receivable: 45000 },
        growth: "+15.4%",
        margin: "30%",
        pieChart: [
          { name: "Crédito", population: 55, color: "#3B82F6", icon: "credit-card" },
          { name: "Pix", population: 25, color: "#22C55E", icon: "pix" },
          { name: "Débito", population: 15, color: "#EAB308", icon: "credit-card" },
          { name: "Dinheiro", population: 5, color: "#F97316", icon: "money-bill-alt" },
        ]
      };
    case "Mês":
    default:
      return {
        financial: { gross: 38000, net: 12000, expenses: 26000, ticket: 92.50, receivable: 4200 },
        growth: "+12%",
        margin: "31%",
        pieChart: [
          { name: "Crédito", population: 48, color: "#3B82F6", icon: "credit-card" },
          { name: "Pix", population: 32, color: "#22C55E", icon: "pix" },
          { name: "Débito", population: 14, color: "#EAB308", icon: "credit-card" },
          { name: "Dinheiro", population: 6, color: "#F97316", icon: "money-bill-alt" },
        ]
      };
  }
};

// --- COMPONENTE AUXILIAR: KPI CARD ---
const KpiCard = ({ title, value, icon, subtext, colorBorder, colorIcon }: any) => (
  <View className={`w-[48%] bg-white p-4 rounded-xl shadow-sm border-l-4 ${colorBorder}`}>
    <View className="flex-row items-center gap-2 mb-2">
      {icon}
      <Text className="text-lg font-bold text-gray-800" numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    </View>
    <Text className="text-xs text-gray-500 font-medium">{title}</Text>
    {subtext && <Text className="text-[10px] mt-1">{subtext}</Text>}
  </View>
);

export default function DashboardFaturamento() {
  const navigation = useNavigation();
  const [filtroAtivo, setFiltroAtivo] = useState("Mês");
  const opcoesFiltro = ["Dia", "Semana", "Mês", "Ano"];

  const data = useMemo(() => getDataByFilter(filtroAtivo), [filtroAtivo]);

  // Formata moeda
  const formatMoney = (val: number) => {
    if (val >= 1000) return `R$ ${(val / 1000).toFixed(1)}k`;
    return `R$ ${val}`;
  };

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
            <Text className="text-xl font-bold text-white">Faturamento - PDV</Text>
          </View>
        </View>

        {/* CONTEÚDO PRINCIPAL */}
        <View className="flex-1 bg-gray-50 mt-2 rounded-t-[30px] overflow-hidden">
          
          <ScrollView 
            className="flex-1 px-5 pt-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            
            <Text className="text-gray-500 font-bold text-xs mb-3 uppercase">
                Resumo Financeiro ({filtroAtivo})
            </Text>

            {/* SEÇÃO 1: RESUMO FINANCEIRO (Cards Grandes) */}
            <View className="flex-row justify-between mb-6">
              <KpiCard 
                title="Receita Bruta"
                value={formatMoney(data.financial.gross)}
                icon={<MaterialIcons name="bar-chart" size={20} color="#3B82F6" />}
                colorBorder="border-blue-500"
                subtext={<Text className="text-green-500">{data.growth} no período</Text>}
              />
              <KpiCard 
                title="Lucro Líquido"
                value={formatMoney(data.financial.net)}
                icon={<FontAwesome6 name="sack-dollar" size={18} color="#22C55E" />}
                colorBorder="border-green-500"
                subtext={<Text className="text-gray-400">Margem: {data.margin}</Text>}
              />
            </View>

            {/* SEÇÃO 2: INDICADORES CHAVE */}
            <Text className="text-gray-500 font-bold text-xs mb-3 uppercase">Indicadores Chave</Text>
            <View className="flex-row justify-between mb-6">
              
              {/* Despesas */}
              <View className="w-[31%] bg-red-50 rounded-xl p-3 items-center justify-between h-32 border border-red-100">
                <View className="items-center">
                  <Feather name="trending-down" size={18} color="#EF4444" className="mb-2" />
                  <Text className="text-[10px] text-center font-bold text-gray-600 leading-3">Total de{"\n"}Despesas</Text>
                </View>
                <View className="bg-red-500 px-2 py-1 rounded-lg shadow-sm w-full items-center">
                  <Text className="text-white font-bold text-[10px]">{formatMoney(data.financial.expenses)}</Text>
                </View>
              </View>

              {/* Ticket Médio */}
              <View className="w-[31%] bg-blue-50 rounded-xl p-3 items-center justify-between h-32 border border-blue-100">
                <View className="items-center">
                  <FontAwesome6 name="receipt" size={18} color="#3B82F6" className="mb-2" />
                  <Text className="text-[10px] text-center font-bold text-gray-600 leading-3">Ticket{"\n"}Médio</Text>
                </View>
                <View className="bg-blue-600 px-2 py-1 rounded-lg shadow-sm w-full items-center">
                  <Text className="text-white font-bold text-[10px]">R$ {data.financial.ticket.toFixed(0)}</Text>
                </View>
              </View>

              {/* A Receber */}
              <View className="w-[31%] bg-yellow-50 rounded-xl p-3 items-center justify-between h-32 border border-yellow-100">
                <View className="items-center">
                  <MaterialIcons name="pending-actions" size={18} color="#EAB308" className="mb-2" />
                  <Text className="text-[10px] text-center font-bold text-gray-600 leading-3">Contas a{"\n"}Receber</Text>
                </View>
                <View className="bg-yellow-500 px-2 py-1 rounded-lg shadow-sm w-full items-center">
                  <Text className="text-white font-bold text-[10px]">{formatMoney(data.financial.receivable)}</Text>
                </View>
              </View>

            </View>

            {/* SEÇÃO 3: COMPOSIÇÃO DA RECEITA (GRÁFICO MELHORADO) */}
            <Text className="text-gray-500 font-bold text-xs mb-3 uppercase">Composição da Receita</Text>
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
              
              {/* ÁREA DO GRÁFICO (DONUT) */}
              <View className="items-center justify-center mb-6">
                <PieChart
                  data={data.pieChart}
                  width={260}
                  height={260}
                  chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"60"}
                  center={[0, 0]}
                  absolute={false}
                  hasLegend={false}
                />
                
                {/* CÍRCULO CENTRAL */}
                <View className="absolute w-32 h-32 bg-white rounded-full items-center justify-center shadow-sm z-10 top-[65px]">
                    <Text className="text-gray-400 text-xs font-medium">Total</Text>
                    <Text className="text-gray-800 text-xl font-bold">{formatMoney(data.financial.gross)}</Text>
                </View>
              </View>

              {/* LEGENDA EM GRID */}
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {data.pieChart.map((item: any, index: number) => (
                  <View key={index} className="w-[48%] flex-row items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-2" style={{ backgroundColor: item.color + '20' }}>
                        {item.name === 'Pix' ? (
                            <FontAwesome6 name="pix" size={14} color={item.color} />
                        ) : item.name === 'Dinheiro' ? (
                            <FontAwesome6 name="money-bill" size={14} color={item.color} />
                        ) : (
                            <FontAwesome6 name="credit-card" size={14} color={item.color} />
                        )}
                    </View>
                    <View>
                        <Text className="text-gray-500 text-[10px] font-bold uppercase">{item.name}</Text>
                        <Text className="text-gray-800 font-bold text-sm">{item.population}%</Text>
                    </View>
                  </View>
                ))}
              </View>

            </View>

          </ScrollView>

          {/* NAVBAR INFERIOR FUNCIONAL */}
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 pb-8 flex-row justify-between items-center shadow-lg z-50">
             {opcoesFiltro.map((item) => {
               const isActive = filtroAtivo === item;
               return (
                 <TouchableOpacity 
                    key={item}
                    onPress={() => setFiltroAtivo(item)}
                    className={`px-4 py-2 rounded-full transition-all ${
                        isActive ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-transparent'
                    }`}
                 >
                    <Text className={`font-bold text-xs ${
                        isActive ? 'text-white' : 'text-gray-500'
                    }`}>
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