import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { FontAwesome6, Feather, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, DrawerActions } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

// --- FUNÇÃO PARA GERAR DADOS REAIS SIMULADOS ---
const getDataByFilter = (filter: string) => {
  const productsBase = [
    { name: "Heineken Lata 350ml", color: "#3B82F6" },
    { name: "Amstel Lata 350ml", color: "#F97316" },
    { name: "Água Mineral 510ml", color: "#EF4444" },
    { name: "Coca-Cola Lata 350ml", color: "#10B981" },
    { name: "Corona Zero 350ml", color: "#A855F7" },
  ];

  const clientsBase = [
    { name: "Kevin" },
    { name: "Juylianne" },
    { name: "Sérgio" },
    { name: "Gilmar" },
  ];

  switch (filter) {
    case "Dia":
      return {
        summary: { totalDia: 1420.50, mesAtual: 12500.00, anoAtual: 79227.85, ticketMedio: 38.40 },
        products: productsBase.map((p, i) => ({ ...p, value: [25, 18, 15, 12, 8][i] })),
        clients: clientsBase.map((c, i) => ({ ...c, value: [150, 95, 80, 45][i] })),
        chart: { labels: ["08h", "12h", "16h", "20h", "23h"], data: [150, 480, 320, 410, 60] }
      };
    case "Semana":
      return {
        summary: { totalDia: 1420.50, mesAtual: 12500.00, anoAtual: 79227.85, ticketMedio: 41.20 },
        products: productsBase.map((p, i) => ({ ...p, value: [140, 98, 85, 70, 50][i] })),
        clients: clientsBase.map((c, i) => ({ ...c, value: [850, 620, 410, 300][i] })),
        chart: { labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"], data: [1100, 1300, 1050, 1600, 2400, 3100, 1800] }
      };
    case "Ano":
      return {
        summary: { totalDia: 1420.50, mesAtual: 12500.00, anoAtual: 79227.85, ticketMedio: 43.75 },
        products: productsBase.map((p, i) => ({ ...p, value: [1240, 980, 850, 710, 540][i] })),
        clients: clientsBase.map((c, i) => ({ ...c, value: [5400, 3200, 2100, 1800][i] })),
        chart: { labels: ["Jan", "Mar", "Mai", "Jul", "Set", "Nov"], data: [12000, 15000, 18000, 16000, 11000, 7227] }
      };
    case "Mês":
    default:
      return {
        summary: { totalDia: 1420.50, mesAtual: 12500.00, anoAtual: 79227.85, ticketMedio: 42.15 },
        products: productsBase.map((p, i) => ({ ...p, value: [295, 245, 228, 145, 85][i] })),
        clients: clientsBase.map((c, i) => ({ ...c, value: [1250, 980, 850, 610][i] })),
        chart: { labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"], data: [2500, 4100, 3200, 2700] }
      };
  }
};

export default function DashboardFaturamento() {
  const navigation = useNavigation();
  const [filtroAtivo, setFiltroAtivo] = useState("Mês");
  const opcoesFiltro = ["Dia", "Semana", "Mês", "Ano"];

  const data = useMemo(() => getDataByFilter(filtroAtivo), [filtroAtivo]);

  return (
    <View className="flex-1 bg-blue-900">
      <SafeAreaView className="flex-1" edges={['top']}>
        
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-4">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="bg-blue-800 p-2 rounded-lg"
            >
              <FontAwesome6 name="bars" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Faturamento</Text>
          </View>
        </View>

        <View className="flex-1 bg-gray-50 mt-2 rounded-t-[30px] overflow-hidden">
          <ScrollView 
            className="flex-1 px-5 pt-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            
            {/* CARDS DE RESUMO */}
            <View className="flex-row justify-between mb-4">
              <View className="w-[31%] bg-white p-3 rounded-xl shadow-sm border border-gray-100 items-center">
                <Feather name="shopping-bag" size={16} color="#3B82F6" />
                <Text className="text-[10px] text-gray-400 mt-1 uppercase font-bold text-center">Vendas Dia</Text>
                <Text className="text-xs font-bold text-gray-800 mt-1">R$ {data.summary.totalDia.toLocaleString('pt-BR')}</Text>
              </View>
              <View className="w-[31%] bg-white p-3 rounded-xl shadow-sm border border-gray-100 items-center">
                <Feather name="calendar" size={16} color="#10B981" />
                <Text className="text-[10px] text-gray-400 mt-1 uppercase font-bold text-center">Mês Atual</Text>
                <Text className="text-xs font-bold text-gray-800 mt-1">R$ {data.summary.mesAtual.toLocaleString('pt-BR')}</Text>
              </View>
              <View className="w-[31%] bg-white p-3 rounded-xl shadow-sm border border-gray-100 items-center">
                <Feather name="trending-up" size={16} color="#F59E0B" />
                <Text className="text-[10px] text-gray-400 mt-1 uppercase font-bold text-center">Ano Atual</Text>
                <Text className="text-xs font-bold text-gray-800 mt-1">R$ {data.summary.anoAtual.toLocaleString('pt-BR')}</Text>
              </View>
            </View>

            {/* TICKET MÉDIO */}
            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex-row items-center justify-center gap-4">
               <View className="bg-blue-50 p-3 rounded-full">
                  <MaterialIcons name="receipt" size={24} color="#3B82F6" />
               </View>
               <View>
                  <Text className="text-[10px] text-gray-400 uppercase font-bold">Ticket Médio ({filtroAtivo})</Text>
                  <Text className="text-xl font-bold text-gray-800">R$ {data.summary.ticketMedio.toFixed(2)}</Text>
               </View>
            </View>

            {/* RANKING PRODUTOS */}
            <Text className="text-gray-500 font-bold text-xs mb-3 uppercase tracking-widest">Top Produtos ({filtroAtivo})</Text>
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
              {data.products.map((item, index) => (
                <View key={index} className="mb-4">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-xs font-bold text-gray-700">{item.name}</Text>
                    <Text className="text-[10px] font-bold text-gray-400">{item.value} un.</Text>
                  </View>
                  <View className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <View 
                      style={{ width: `${(item.value / data.products[0].value) * 100}%`, backgroundColor: item.color }} 
                      className="h-full rounded-full" 
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* RANKING CLIENTES */}
            <Text className="text-gray-500 font-bold text-xs mb-3 uppercase tracking-widest">Maiores Clientes ({filtroAtivo})</Text>
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
              {data.clients.map((item, index) => (
                <View key={index} className="flex-row items-center mb-4">
                  <View className="w-8 h-8 bg-gray-50 rounded-full items-center justify-center mr-3">
                    <Text className="text-[10px] font-bold text-blue-600">{index + 1}º</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-800">{item.name}</Text>
                    <View className="w-full bg-gray-50 h-1.5 rounded-full mt-1">
                       <View 
                        style={{ width: `${(item.value / data.clients[0].value) * 100}%` }} 
                        className="h-full bg-blue-500 rounded-full" 
                       />
                    </View>
                  </View>
                  <Text className="text-[10px] font-bold text-gray-400 ml-4">R$ {item.value.toLocaleString('pt-BR')}</Text>
                </View>
              ))}
            </View>

            {/* EVOLUÇÃO DE FATURAMENTO */}
            <Text className="text-gray-500 font-bold text-xs mb-3 uppercase tracking-widest">Vendas Mensal ({filtroAtivo})</Text>
            <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <LineChart
                data={{
                  labels: data.chart.labels,
                  datasets: [{ data: data.chart.data }]
                }}
                width={screenWidth - 64}
                height={200}
                yAxisLabel="R$"
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
                  propsForDots: { r: "4", strokeWidth: "2", stroke: "#3B82F6" },
                  propsForBackgroundLines: { strokeDasharray: "" }
                }}
                bezier
                style={{ borderRadius: 16 }}
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
                    className={`px-4 py-2 rounded-full transition-all ${
                        isActive ? 'bg-blue-600' : 'bg-transparent'
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