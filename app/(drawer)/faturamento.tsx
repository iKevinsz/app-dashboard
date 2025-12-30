import React, { useState, useMemo } from 'react';
import { 
  View, Text, ScrollView, Dimensions, TouchableOpacity, 
  Modal, TextInput, FlatList, KeyboardAvoidingView, Platform 
} from 'react-native';
import { FontAwesome6, Feather } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

// --- MOCK DATA (Mesmos dados da Web) ---
const salesToday = [
  { name: '08h', value: 150 }, { name: '10h', value: 420 }, { name: '12h', value: 850 },
  { name: '14h', value: 600 }, { name: '16h', value: 950 }, { name: '18h', value: 1200 },
  { name: '20h', value: 800 }, { name: '22h', value: 300 },
];
const salesWeek = [
  { name: 'Seg', value: 3200 }, { name: 'Ter', value: 4100 }, { name: 'Qua', value: 3800 },
  { name: 'Qui', value: 5200 }, { name: 'Sex', value: 6900 }, { name: 'Sáb', value: 8400 }, { name: 'Dom', value: 7100 },
];
const salesMonth = [
  { name: 'Sem 1', value: 15400 }, { name: 'Sem 2', value: 18200 }, { name: 'Sem 3', value: 16800 }, { name: 'Sem 4', value: 21500 },
];

const productsToday = [
  { name: 'Pão Fr.', value: 850 }, { name: 'Café', value: 120 }, { name: 'Coca', value: 95 },
  { name: 'P. Queijo', value: 80 }, { name: 'Misto', value: 65 },
];
const productsWeek = [
  { name: 'Heineken', value: 450 }, { name: 'Coca 2L', value: 320 }, { name: 'Água', value: 280 },
  { name: 'Carvão', value: 150 }, { name: 'Gelo', value: 120 },
];
const productsMonth = [
  { name: 'Heineken', value: 1295 }, { name: 'Amstel', value: 945 }, { name: 'Água', value: 830 },
  { name: 'Hein. Gf', value: 545 }, { name: 'Coca', value: 425 },
];

const topCustomersSummary = [
  { name: 'Kawan', value: 2700 }, { name: 'Suelem P.', value: 1200 }, { name: 'Sérgio T.', value: 1100 },
  { name: 'Gilmar S.', value: 950 }, { name: 'Maira S.', value: 450 },
];

const allCustomersData = [
  { id: '1', name: 'Kawan', value: 2700, orders: 15 }, { id: '2', name: 'Suelem Pignatari', value: 1200, orders: 8 },
  { id: '3', name: 'Sérgio Trento', value: 1100, orders: 6 }, { id: '4', name: 'Gilmar da Silva', value: 950, orders: 5 },
  { id: '5', name: 'Maira Silva', value: 450, orders: 3 }, { id: '6', name: 'João Souza', value: 320, orders: 2 },
  { id: '7', name: 'Maria Oliveira', value: 280, orders: 2 }, { id: '8', name: 'Pedro Santos', value: 150, orders: 1 },
  { id: '9', name: 'Ana Costa', value: 120, orders: 1 }, { id: '10', name: 'Lucas Pereira', value: 90, orders: 1 },
];

const screenWidth = Dimensions.get("window").width;

// --- COMPONENTES AUXILIARES ---
const KpiCard = ({ title, value, subtext, icon, colorBg, trendColor }: any) => (
  <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-[48%] mb-4">
    <View className="flex-row justify-between items-start mb-2">
      <View>
        <Text className="text-xs font-medium text-gray-500 mb-1">{title}</Text>
        <Text className="text-lg font-bold text-gray-900">{value}</Text>
      </View>
      <View className={`p-2 rounded-lg ${colorBg}`}>
        {icon}
      </View>
    </View>
    {subtext && <Text className={`text-[10px] ${trendColor || 'text-gray-400'} mt-1`}>{subtext}</Text>}
  </View>
);

export default function AnalyticsDashboard() {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'month'>('month');
  const [isClientsModalOpen, setIsClientsModalOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  // Lógica de Dados para os Gráficos
  const chartData = useMemo(() => {
    const dataSource = activeFilter === 'today' ? salesToday : activeFilter === 'week' ? salesWeek : salesMonth;
    return {
        labels: dataSource.map(d => d.name),
        datasets: [{ data: dataSource.map(d => d.value) }]
    };
  }, [activeFilter]);

  const productsChartData = useMemo(() => {
    const dataSource = activeFilter === 'today' ? productsToday : activeFilter === 'week' ? productsWeek : productsMonth;
    return {
        labels: dataSource.map(d => d.name),
        datasets: [{ data: dataSource.map(d => d.value) }]
    };
  }, [activeFilter]);

  // Filtro de Clientes
  const filteredClients = allCustomersData.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 pt-12 pb-24">

            {/* HEADER COM MENU */}
            <View className="mb-6 flex-row items-center gap-4">
              <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm active:bg-gray-100">
                 <FontAwesome6 name="bars" size={18} color="#374151" />
              </TouchableOpacity>
              <View>
                <Text className="text-2xl font-bold text-gray-800">Faturamento</Text>
                <Text className="text-sm text-gray-500">Visão geral do negócio.</Text>
              </View>
            </View>

            {/* FILTROS (Abas) */}
            <View className="flex-row bg-white p-1 rounded-xl border border-gray-200 mb-6 shadow-sm">
                {['today', 'week', 'month'].map((filter) => (
                    <TouchableOpacity 
                        key={filter}
                        onPress={() => setActiveFilter(filter as any)}
                        className={`flex-1 py-2 items-center rounded-lg ${activeFilter === filter ? 'bg-blue-50' : 'bg-transparent'}`}
                    >
                        <Text className={`text-xs font-bold capitalize ${activeFilter === filter ? 'text-blue-700' : 'text-gray-500'}`}>
                            {filter === 'today' ? 'Hoje' : filter === 'week' ? '7 Dias' : 'Mês'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* GRID DE KPIS */}
            <View className="flex-row flex-wrap justify-between">
                <KpiCard 
                    title="Vendas Hoje" value={formatCurrency(5270)} subtext="12 pedidos"
                    colorBg="bg-blue-50" icon={<Feather name="shopping-bag" size={16} color="#2563eb" />}
                />
                <KpiCard 
                    title="Faturamento" value={formatCurrency(71900)} subtext="-2% vs mês anterior" trendColor="text-red-500"
                    colorBg="bg-green-50" icon={<Feather name="calendar" size={16} color="#16a34a" />}
                />
                <KpiCard 
                    title="Anual" value={formatCurrency(79227)} subtext="+15% vs ano anterior" trendColor="text-green-600"
                    colorBg="bg-purple-50" icon={<Feather name="dollar-sign" size={16} color="#9333ea" />}
                />
                <KpiCard 
                    title="Ticket Médio" value={formatCurrency(43.75)} subtext="Média 12 meses"
                    colorBg="bg-orange-50" icon={<Feather name="credit-card" size={16} color="#ea580c" />}
                />
            </View>

            {/* GRÁFICO DE EVOLUÇÃO (Line Chart) */}
            <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-6">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-gray-800">Evolução</Text>
                    <View className="bg-green-50 px-2 py-1 rounded flex-row items-center gap-1">
                        <Feather name="trending-up" size={12} color="#16a34a" />
                        <Text className="text-xs font-bold text-green-700">+12.5%</Text>
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <LineChart
                        data={chartData}
                        width={Math.max(screenWidth - 60, chartData.labels.length * 50)}
                        height={220}
                        yAxisLabel="R$"
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                            propsForDots: { r: "4", strokeWidth: "2", stroke: "#2563EB" }
                        }}
                        bezier
                        style={{ borderRadius: 16, paddingRight: 40 }}
                    />
                </ScrollView>
            </View>

            {/* GRÁFICO TOP PRODUTOS (Bar Chart) */}
            <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-6">
                <Text className="text-lg font-bold text-gray-800 mb-4">Top Produtos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <BarChart
                      data={productsChartData}
                      width={Math.max(screenWidth - 60, productsChartData.labels.length * 60)}
                      height={220}
                      yAxisLabel=""
                      yAxisSuffix=""
                      chartConfig={{
                          backgroundColor: "#ffffff",
                          backgroundGradientFrom: "#ffffff",
                          backgroundGradientTo: "#ffffff",
                          decimalPlaces: 0,
                          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                          labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
                          barPercentage: 0.7,
                      }}
                      style={{ borderRadius: 16, paddingRight: 20 }}
                      showValuesOnTopOfBars
                      fromZero
                  />
                </ScrollView>
            </View>

            {/* LISTA TOP CLIENTES */}
            <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-6">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-lg font-bold text-gray-800">Top Clientes</Text>
                    <Feather name="users" size={18} color="#9ca3af" />
                </View>

                <View className="gap-5">
                    {topCustomersSummary.map((customer, index) => (
                        <View key={index}>
                            <View className="flex-row justify-between text-sm mb-1">
                                <Text className="font-medium text-gray-700">{index + 1}. {customer.name}</Text>
                                <Text className="font-bold text-gray-900">{formatCurrency(customer.value)}</Text>
                            </View>
                            <View className="w-full bg-gray-100 rounded-full h-2">
                                <View 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${(customer.value / 3000) * 100}%` }}
                                />
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity 
                    onPress={() => setIsClientsModalOpen(true)}
                    className="mt-6 w-full py-3 bg-blue-50 rounded-lg items-center active:bg-blue-100"
                >
                    <Text className="text-blue-600 font-bold text-sm">Ver todos clientes</Text>
                </TouchableOpacity>
            </View>

        </View>
      </ScrollView>

      {/* --- MODAL DE CLIENTES --- */}
      <Modal
        visible={isClientsModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsClientsModalOpen(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-1 bg-black/60 justify-end">
              <View className="bg-white h-[90%] rounded-t-3xl overflow-hidden">
                  
                  {/* Header Modal */}
                  <View className="px-6 py-4 border-b border-gray-100 flex-row justify-between items-center bg-gray-50">
                      <View>
                          <Text className="text-lg font-bold text-gray-800">Ranking de Clientes</Text>
                          <Text className="text-xs text-gray-500">Listagem por volume de compra.</Text>
                      </View>
                      <TouchableOpacity onPress={() => setIsClientsModalOpen(false)} className="p-2 bg-gray-200 rounded-full">
                          <Feather name="x" size={18} color="#4b5563" />
                      </TouchableOpacity>
                  </View>

                  {/* Busca */}
                  <View className="p-4 border-b border-gray-100">
                      <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-3">
                          <Feather name="search" size={18} color="#9ca3af" />
                          <TextInput 
                              placeholder="Buscar cliente..." 
                              className="flex-1 ml-2 text-sm text-gray-800"
                              placeholderTextColor="#9ca3af"
                              value={clientSearch}
                              onChangeText={setClientSearch}
                          />
                      </View>
                  </View>

                  {/* Lista FlatList */}
                  <FlatList
                      data={filteredClients}
                      keyExtractor={(item) => item.id}
                      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, index }) => (
                          <View className="flex-row justify-between items-center py-4 border-b border-gray-50">
                              <View className="flex-row items-center flex-1">
                                  <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
                                    <Text className="text-blue-600 font-bold text-xs">#{index + 1}</Text>
                                  </View>
                                  <View>
                                      <Text className="font-bold text-gray-800 text-sm">{item.name}</Text>
                                      <Text className="text-xs text-gray-500">{item.orders} pedidos realizados</Text>
                                  </View>
                              </View>
                              <Text className="font-bold text-blue-600 text-sm">{formatCurrency(item.value)}</Text>
                          </View>
                      )}
                      ListEmptyComponent={() => (
                          <Text className="text-center text-gray-400 mt-10">Nenhum cliente encontrado.</Text>
                      )}
                  />
                  
              </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}