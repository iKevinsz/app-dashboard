import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { FontAwesome6, Feather } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

// --- DADOS ESTÁTICOS ---
const PAYMENT_METHODS = [
  { name: 'Pix', value: 'R$ 6.425,00', percent: 50, color: 'bg-green-500', hex: '#22c55e', icon: 'smartphone' },
  { name: 'Crédito', value: 'R$ 3.855,00', percent: 30, color: 'bg-blue-500', hex: '#3b82f6', icon: 'credit-card' },
  { name: 'Dinheiro', value: 'R$ 1.927,50', percent: 15, color: 'bg-green-700', hex: '#15803d', icon: 'money-bill' },
  { name: 'Débito', value: 'R$ 642,50', percent: 5, color: 'bg-orange-500', hex: '#f97316', icon: 'credit-card' },
];

const MONTHLY_DATA = [
  { month: 'Jan', value: 12000 }, { month: 'Fev', value: 15000 },
  { month: 'Mar', value: 11000 }, { month: 'Abr', value: 18000 },
  { month: 'Mai', value: 22000 }, { month: 'Jun', value: 25000 },
];

const screenWidth = Dimensions.get("window").width;

// --- COMPONENTE CARD DE MÉTRICA ---
const MetricCard = ({ title, value, icon, trend, isPositive, colorBg }: any) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 w-full relative overflow-hidden">
    {/* Decoração de fundo */}
    <View className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${colorBg}`} />
    
    <View className="flex-row justify-between items-start mb-3">
      <View className={`p-3 rounded-xl ${colorBg}`}>
         {icon}
      </View>
      {trend && (
        <View className={`flex-row items-center px-2 py-1 rounded-full ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
           {isPositive ? <Feather name="arrow-up-right" size={12} color="#15803d" /> : <Feather name="arrow-down-right" size={12} color="#b91c1c" />}
           <Text className={`text-[10px] font-bold ml-1 ${isPositive ? 'text-green-700' : 'text-red-700'}`}>{trend}</Text>
        </View>
      )}
    </View>
    <Text className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{title}</Text>
    <Text className="text-2xl font-bold text-gray-800">
      {value}
    </Text>
  </View>
);

export default function PdvDashboardScreen() {
  const navigation = useNavigation();
  const today = new Date().toISOString().split('T')[0];
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  const thirtyDaysAgo = lastMonth.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [chartData, setChartData] = useState<{day: string, value: number}[]>([]);
  const [kpiTotalPeriodo, setKpiTotalPeriodo] = useState(0);

  // Gera dados aleatórios para simular API
  useEffect(() => {
    const dataArr = [];
    let totalSum = 0;
    const dtStart = new Date(startDate);
    const dtEnd = new Date(endDate);

    for (let d = new Date(dtStart); d <= dtEnd; d.setDate(d.getDate() + 1)) {
      const randomValue = Math.floor(Math.random() * 2500) + 500;
      dataArr.push({
        day: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        value: randomValue
      });
      totalSum += randomValue;
    }
    setChartData(dataArr);
    setKpiTotalPeriodo(totalSum);
  }, [startDate, endDate]);

  // Formata dados para o gráfico
  const dailyChartData = {
    labels: chartData.map(d => d.day.split('/')[0]), // Pega só o dia
    datasets: [{ data: chartData.map(d => d.value) }]
  };

  const monthlyChartData = {
    labels: MONTHLY_DATA.map(d => d.month),
    datasets: [{ data: MONTHLY_DATA.map(d => d.value) }]
  };

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="p-6 pt-12 pb-24">
        
        {/* HEADER COM MENU LATERAL */}
        <View className="mb-6 flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
            className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm active:bg-gray-100"
          >
             <FontAwesome6 name="bars" size={18} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="text-xs font-medium text-gray-400 uppercase tracking-wider">Gestão</Text>
            <Text className="text-2xl font-bold text-gray-800">Dashboard PDV</Text>
          </View>
        </View>

        {/* BARRA DE FILTROS DE DATA */}
        <View className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-6 flex-row flex-wrap gap-2 items-center justify-between">
           <View className="flex-row items-center gap-2">
              <Feather name="calendar" size={14} color="#6b7280" />
              <Text className="text-xs font-bold text-gray-500 uppercase">Período:</Text>
           </View>
           <View className="flex-row gap-2 items-center">
             <View className="bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
               <Text className="text-xs text-gray-600">{startDate.split('-').reverse().join('/')}</Text>
             </View>
             <Text className="text-gray-400 text-xs">até</Text>
             <View className="bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
               <Text className="text-xs text-gray-600">{endDate.split('-').reverse().join('/')}</Text>
             </View>
           </View>
        </View>

        {/* CARDS DE KPI */}
        <View className="gap-2 mb-6">
            <MetricCard 
                title="Faturamento Período" 
                value={formatMoney(kpiTotalPeriodo)} 
                trend={'+12.5%'} isPositive={true}
                icon={<Feather name="filter" size={20} color="#2563eb" />} 
                colorBg="bg-blue-100"
            />
            <View className="flex-row gap-3">
                <View className="flex-1">
                    <MetricCard 
                        title="Mês Atual" 
                        value={formatMoney(12850)} 
                        trend={'+5.2%'} isPositive={true}
                        icon={<Feather name="dollar-sign" size={20} color="#16a34a" />} 
                        colorBg="bg-green-100"
                    />
                </View>
                <View className="flex-1">
                    <MetricCard 
                        title="Anual (2025)" 
                        value={formatMoney(158400)} 
                        trend={'-2.1%'} isPositive={false}
                        icon={<Feather name="trending-up" size={20} color="#9333ea" />} 
                        colorBg="bg-purple-100"
                    />
                </View>
            </View>
        </View>

        {/* LISTA DE FORMAS DE PAGAMENTO */}
        <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="font-bold text-gray-800 text-lg">Formas de Pagamento</Text>
                <TouchableOpacity><Feather name="settings" size={16} color="#9ca3af"/></TouchableOpacity>
            </View>
            
            <View className="gap-5">
                {PAYMENT_METHODS.map((method, index) => (
                <View key={index}>
                    <View className="flex-row justify-between items-end mb-2">
                        <View className="flex-row items-center gap-2">
                            <View className={`p-1.5 rounded-md ${method.color} bg-opacity-20`}>
                                {method.icon === 'smartphone' && <Feather name="smartphone" size={14} color={method.hex} />}
                                {method.icon === 'credit-card' && <Feather name="credit-card" size={14} color={method.hex} />}
                                {method.icon === 'money-bill' && <FontAwesome6 name="money-bill" size={14} color={method.hex} />}
                            </View>
                            <Text className="text-sm font-medium text-gray-700">{method.name}</Text>
                        </View>
                        <Text className="text-xs font-bold text-gray-800">{method.value}</Text>
                    </View>
                    {/* Barra de Progresso */}
                    <View className="w-full bg-gray-100 rounded-full h-2">
                        <View 
                            className={`h-2 rounded-full ${method.color}`} 
                            style={{ width: `${method.percent}%` }}
                        ></View>
                    </View>
                </View>
                ))}
            </View>
        </View>

        {/* GRÁFICO 1: DIÁRIO (Com Scroll Horizontal) */}
        <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-6">
            <Text className="font-bold text-gray-800 text-lg mb-4">Recebimento Diário</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {chartData.length > 0 && (
                    <BarChart
                        data={dailyChartData}
                        // Largura dinâmica: Se tiver muitos dias, aumenta a largura para permitir scroll
                        width={Math.max(screenWidth - 60, chartData.length * 40)} 
                        height={220}
                        yAxisLabel="R$ "
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // Blue
                            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                            barPercentage: 0.6,
                            fillShadowGradient: "#3b82f6",
                            fillShadowGradientOpacity: 1,
                        }}
                        style={{ borderRadius: 16, paddingRight: 40 }}
                        verticalLabelRotation={0}
                        showValuesOnTopOfBars={false} 
                    />
                )}
            </ScrollView>
        </View>

        {/* GRÁFICO 2: MENSAL */}
        <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <Text className="font-bold text-gray-800 text-lg mb-4">Histórico Mensal</Text>
            <BarChart
                data={monthlyChartData}
                width={screenWidth - 48} // Largura fixa (padding da tela)
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`, // Indigo
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                    barPercentage: 0.7,
                    fillShadowGradient: "#6366f1",
                    fillShadowGradientOpacity: 1,
                }}
                style={{ borderRadius: 16 }}
                showValuesOnTopOfBars={true}
            />
        </View>

      </View>
    </ScrollView>
  );
}