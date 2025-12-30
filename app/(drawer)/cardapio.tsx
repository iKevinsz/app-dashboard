import React, { useState } from "react";
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { FontAwesome6, Feather } from "@expo/vector-icons";
import { LineChart, PieChart } from "react-native-chart-kit";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

// --- DADOS MOCKADOS ---
const kpiData = {
  faturamentoMes: 12450.00,
  faturamentoAno: 158900.00,
  pedidos: 452,
  visitas: 3200,
};

// Adaptando dados para o Gráfico de Linha (Simulando Área)
const dadosFaturamentoDiario = {
  labels: ["01", "05", "10", "15", "20", "25", "30"],
  datasets: [
    {
      data: [1200, 2100, 800, 1600, 2400, 1900, 3100],
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Azul
      strokeWidth: 3
    }
  ]
};

// Adaptando dados para o Gráfico de Pizza
const dadosFormaPagamento = [
  { name: "Pix", population: 4000, color: "#10B981", legendFontColor: "#6B7280", legendFontSize: 12 },
  { name: "Crédito", population: 3000, color: "#3B82F6", legendFontColor: "#6B7280", legendFontSize: 12 },
  { name: "Débito", population: 2000, color: "#F59E0B", legendFontColor: "#6B7280", legendFontSize: 12 },
  { name: "Dinheiro", population: 1000, color: "#EF4444", legendFontColor: "#6B7280", legendFontSize: 12 },
];

const topProdutos = [
  { nome: "X-Tudo Artesanal", qtd: 120 },
  { nome: "Coca-Cola 2L", qtd: 98 },
  { nome: "Porção de Batata", qtd: 85 },
  { nome: "Suco de Laranja", qtd: 70 },
  { nome: "Açaí 500ml", qtd: 65 },
];

const screenWidth = Dimensions.get("window").width;

// --- COMPONENTES AUXILIARES ---
const StatCard = ({ title, value, icon, subtext, colorBg, iconColor }: any) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 w-[48%]">
    <View className="flex-row justify-between items-start mb-2">
      <View>
        <Text className="text-xs font-medium text-gray-500 mb-1">{title}</Text>
        <Text className="text-lg font-bold text-gray-800">{value}</Text>
      </View>
      <View className={`p-2.5 rounded-lg ${colorBg} items-center justify-center`}>
         {icon}
      </View>
    </View>
    {subtext && <Text className="text-[10px] text-gray-400 mt-1">{subtext}</Text>}
  </View>
);

export default function DashboardCardapio() {
  const navigation = useNavigation();
  const [filtro, setFiltro] = useState("Este Mês");

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="p-6 pt-12 pb-24">
        
        {/* CABEÇALHO COM MENU LATERAL */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center gap-4">
             <TouchableOpacity 
               onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
               className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm active:bg-gray-100"
             >
                 <FontAwesome6 name="bars" size={18} color="#374151" />
             </TouchableOpacity>
             <View>
                <Text className="text-2xl font-bold text-gray-800">Cardápio</Text>
                <Text className="text-gray-500 text-sm">Performance do delivery.</Text>
             </View>
          </View>
          
          {/* Filtro Simulado */}
          <TouchableOpacity className="bg-white px-3 py-2 rounded-lg border border-gray-200 flex-row items-center gap-2">
            <Text className="text-xs text-gray-700 font-bold">{filtro}</Text>
            <FontAwesome6 name="chevron-down" size={10} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* KPI CARDS (Grid Responsivo) */}
        <View className="flex-row flex-wrap justify-between gap-y-2">
          <StatCard 
            title="Faturamento Mês" 
            value={`R$ ${kpiData.faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`}
            subtext="+ 12% vs anterior"
            icon={<FontAwesome6 name="sack-dollar" size={18} color="#15803d" />} // Green Text
            colorBg="bg-green-100"
          />
          <StatCard 
            title="Anual 2025" 
            value={`R$ ${(kpiData.faturamentoAno / 1000).toFixed(0)}k`}
            subtext="Acumulado"
            icon={<FontAwesome6 name="calendar-check" size={18} color="#1d4ed8" />} // Blue Text
            colorBg="bg-blue-100"
          />
          <StatCard 
            title="Total Pedidos" 
            value={kpiData.pedidos}
            subtext="~15/dia"
            icon={<FontAwesome6 name="cart-shopping" size={18} color="#7e22ce" />} // Purple Text
            colorBg="bg-purple-100"
          />
          <StatCard 
            title="Visitas" 
            value={kpiData.visitas}
            subtext="Conv. 14%"
            icon={<FontAwesome6 name="users" size={18} color="#c2410c" />} // Orange Text
            colorBg="bg-orange-100"
          />
        </View>

        {/* GRÁFICO DE EVOLUÇÃO (Simulando Area Chart com LineChart) */}
        <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-2 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Evolução de Vendas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={dadosFaturamentoDiario}
              width={Math.max(screenWidth - 48, 350)} // Garante largura mínima
              height={220}
              yAxisLabel="R$"
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#2563EB" }
              }}
              bezier // Curvas suaves
              style={{ marginVertical: 8, borderRadius: 16, marginLeft: -10 }}
            />
          </ScrollView>
        </View>

        {/* GRÁFICO DE FORMAS DE PAGAMENTO */}
        <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-2">Meios de Pagamento</Text>
          <PieChart
            data={dadosFormaPagamento}
            width={screenWidth - 48}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[0, 0]}
            absolute={false} // Mostra % se false (depende da lib)
          />
        </View>

        {/* RANKING DE PRODUTOS */}
        <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Top 5 Mais Vendidos</Text>
          <View className="space-y-4">
            {topProdutos.map((produto, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <Text className="w-6 text-gray-400 font-bold text-sm">#{index + 1}</Text>
                <View className="flex-1 ml-2">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-sm font-medium text-gray-700">{produto.nome}</Text>
                    <Text className="text-xs text-gray-500">{produto.qtd} un.</Text>
                  </View>
                  
                  {/* Barra de Progresso Customizada */}
                  <View className="w-full bg-gray-100 rounded-full h-2.5">
                    <View 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(produto.qtd / topProdutos[0].qtd) * 100}%` }}
                    ></View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

      </View>
    </ScrollView>
  );
}