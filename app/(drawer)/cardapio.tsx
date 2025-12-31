import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { FontAwesome6, Feather, MaterialIcons } from "@expo/vector-icons";
import { LineChart, PieChart } from "react-native-chart-kit";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

// --- DADOS DINÂMICOS ---
const getDataByFilter = (filter: string) => {
  switch (filter) {
    case "Dia":
      return {
        kpi: { faturamento: 1250, acumulado: 1250, pedidos: 45, visitas: 320 },
        lineChart: {
          labels: ["10h", "12h", "14h", "16h", "18h", "20h", "22h"],
          data: [120, 450, 300, 250, 600, 900, 750]
        },
        pieChart: [
          { name: "Pix", population: 45, color: "#10B981", icon: "pix" },
          { name: "Crédito", population: 30, color: "#3B82F6", icon: "credit-card" },
          { name: "Débito", population: 15, color: "#F59E0B", icon: "credit-card" },
          { name: "Dinheiro", population: 10, color: "#EF4444", icon: "money-bill-alt" },
        ]
      };
    case "Semana":
      return {
        kpi: { faturamento: 8400, acumulado: 32000, pedidos: 210, visitas: 1500 },
        lineChart: {
          labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
          data: [900, 1100, 1050, 1400, 2100, 2800, 1900]
        },
        pieChart: [
          { name: "Pix", population: 55, color: "#10B981", icon: "pix" },
          { name: "Crédito", population: 25, color: "#3B82F6", icon: "credit-card" },
          { name: "Débito", population: 15, color: "#F59E0B", icon: "credit-card" },
          { name: "Dinheiro", population: 5, color: "#EF4444", icon: "money-bill-alt" },
        ]
      };
    case "Ano":
      return {
        kpi: { faturamento: 189000, acumulado: 189000, pedidos: 5400, visitas: 42000 },
        lineChart: {
          labels: ["Jan", "Mar", "Mai", "Jul", "Set", "Nov"],
          data: [12000, 15000, 18000, 16000, 22000, 25000]
        },
        pieChart: [
          { name: "Pix", population: 30, color: "#10B981", icon: "pix" },
          { name: "Crédito", population: 50, color: "#3B82F6", icon: "credit-card" },
          { name: "Débito", population: 10, color: "#F59E0B", icon: "credit-card" },
          { name: "Dinheiro", population: 10, color: "#EF4444", icon: "money-bill-alt" },
        ]
      };
    case "Mês":
    default:
      return {
        kpi: { faturamento: 12450, acumulado: 158900, pedidos: 452, visitas: 3200 },
        lineChart: {
          labels: ["01", "05", "10", "15", "20", "25", "30"],
          data: [1200, 2100, 800, 1600, 2400, 1900, 3100]
        },
        pieChart: [
          { name: "Pix", population: 40, color: "#10B981", icon: "pix" },
          { name: "Crédito", population: 30, color: "#3B82F6", icon: "credit-card" },
          { name: "Débito", population: 20, color: "#F59E0B", icon: "credit-card" },
          { name: "Dinheiro", population: 10, color: "#EF4444", icon: "money-bill-alt" },
        ]
      };
  }
};

const StatCard = ({ title, value, icon, subtext, colorBg }: any) => (
  <View className="bg-white p-4 rounded-xl border border-gray-100 mb-4 w-[48%] shadow-sm">
    <View className="flex-row justify-between items-start mb-3">
      <View className={`p-2 rounded-lg ${colorBg} items-center justify-center`}>
         {icon}
      </View>
    </View>
    <View>
        <Text className="text-lg font-bold text-gray-800">{value}</Text>
        <Text className="text-xs font-medium text-gray-500">{title}</Text>
    </View>
    {subtext && <Text className="text-[10px] text-gray-400 mt-1">{subtext}</Text>}
  </View>
);

export default function DashboardCardapio() {
  const navigation = useNavigation();
  const [filtroAtivo, setFiltroAtivo] = useState("Mês");
  const opcoesFiltro = ["Dia", "Semana", "Mês", "Ano"];

  const dataAtual = useMemo(() => getDataByFilter(filtroAtivo), [filtroAtivo]);

  return (
    <View className="flex-1 bg-blue-900">
      <SafeAreaView className="flex-1" edges={['top']}>
        
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-6">
          <View className="flex-row items-center gap-4">
             <TouchableOpacity 
               onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
               className="bg-blue-800 p-2 rounded-lg"
             >
                 <FontAwesome6 name="bars" size={20} color="white" />
             </TouchableOpacity>
             <Text className="text-xl font-bold text-white">Dashboard - Cardápio</Text>
          </View>
        </View>

        {/* CONTAINER CONTEÚDO */}
        <View className="flex-1 bg-gray-50 mt-2 rounded-t-[30px] overflow-hidden">
          
          <ScrollView 
            className="flex-1 px-6 pt-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <Text className="text-gray-500 font-bold text-xs mb-3 uppercase">
                Visão Geral ({filtroAtivo})
            </Text>

            {/* KPIs */}
            <View className="flex-row flex-wrap justify-between gap-y-2 mb-6">
              <StatCard 
                title="Faturamento" 
                value={`R$ ${dataAtual.kpi.faturamento.toLocaleString('pt-BR')}`}
                subtext="Receita Bruta"
                icon={<FontAwesome6 name="sack-dollar" size={16} color="#15803d" />} 
                colorBg="bg-green-100"
              />
              <StatCard 
                title="Total Período" 
                value={`R$ ${(dataAtual.kpi.acumulado / 1000).toFixed(1)}k`}
                subtext="Meta atingida"
                icon={<FontAwesome6 name="calendar-check" size={16} color="#1d4ed8" />} 
                colorBg="bg-blue-100"
              />
              <StatCard 
                title="Pedidos" 
                value={dataAtual.kpi.pedidos}
                subtext="Confirmados"
                icon={<FontAwesome6 name="cart-shopping" size={16} color="#7e22ce" />} 
                colorBg="bg-purple-100"
              />
              <StatCard 
                title="Visitas" 
                value={dataAtual.kpi.visitas}
                subtext="App & Site"
                icon={<FontAwesome6 name="users" size={16} color="#c2410c" />} 
                colorBg="bg-orange-100"
              />
            </View>

            {/* GRÁFICO DE LINHA */}
            <Text className="text-gray-500 font-bold text-xs mb-3 uppercase">Evolução do Faturamento</Text>
            <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{
                    labels: dataAtual.lineChart.labels,
                    datasets: [{ data: dataAtual.lineChart.data }]
                  }}
                  width={Math.max(screenWidth - 64, 350)}
                  height={220}
                  yAxisLabel="R$"
                  yAxisSuffix=""
                  withInnerLines={false}
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: { r: "5", strokeWidth: "2", stroke: "#2563EB", fill: "#fff" }
                  }}
                  bezier
                  style={{ marginVertical: 8, borderRadius: 16, marginLeft: -10 }}
                />
              </ScrollView>
            </View>

            {/* --- SEÇÃO DE MEIOS DE PAGAMENTO (REDESENHADA) --- */}
            <Text className="text-gray-500 font-bold text-xs mb-3 uppercase">Formas de Pagamento</Text>
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
              
              {/* ÁREA DO GRÁFICO (DONUT) */}
              <View className="items-center justify-center mb-6">
                <PieChart
                  data={dataAtual.pieChart}
                  width={260} // Largura fixa para garantir centralização
                  height={260}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"60"} // Empurra o gráfico para o centro visual
                  center={[0, 0]}
                  absolute={false}
                  hasLegend={false}
                />
                
                {/* CÍRCULO CENTRAL (EFEITO DONUT) */}
                <View className="absolute w-32 h-32 bg-white rounded-full items-center justify-center shadow-sm z-10 top-[65px]">
                    <Text className="text-gray-400 text-xs font-medium">Total</Text>
                    <Text className="text-gray-800 text-xl font-bold">100%</Text>
                </View>
              </View>

              {/* LEGENDA EM GRID 2X2 (MAIS ORGANIZADA) */}
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {dataAtual.pieChart.map((item: any, index: number) => (
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

          {/* NAVBAR INFERIOR */}
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