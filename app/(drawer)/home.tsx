import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { FontAwesome6, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- COMPONENTE AUXILIAR: CARD DE NAVEGAÇÃO ---
const NavCard = ({ title, subtitle, icon, colorBg, route, router }: any) => (
  <TouchableOpacity 
    onPress={() => router.push(route)}
    className="w-[48%] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-4 active:scale-[0.98] transition-transform"
  >
    <View className={`w-12 h-12 ${colorBg} rounded-xl items-center justify-center mb-4 shadow-sm`}>
       {icon}
    </View>
    <Text className="text-gray-800 font-bold text-lg leading-5 mb-1">{title}</Text>
    <Text className="text-gray-400 text-xs leading-4">{subtitle}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // --- ESTADOS ---
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [hasNotifications, setHasNotifications] = useState(true);

  // Função segura para abrir a sidebar
  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Função para lidar com notificações
  const handleNotificationPress = () => {
    setHasNotifications(false);
    Alert.alert("Notificações", "Você não possui novas mensagens no momento.");
  };

  const summaryData = {
    salesToday: 1250.00,
    ordersToday: 18,
    trend: "+15%"
  };

  // Função para formatar moeda ou esconder
  const formatValue = (val: number) => {
    if (!isBalanceVisible) return "••••••";
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <View className="flex-1 bg-blue-900">
      <SafeAreaView className="flex-1" edges={['top']}>
        
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-8">
          {/* Lado Esquerdo: Menu e Boas-vindas */}
          <View className="flex-row items-center gap-4">
             <TouchableOpacity 
               onPress={handleOpenDrawer} 
               className="bg-blue-800 p-2.5 rounded-xl border border-blue-700/50"
             >
                 <FontAwesome6 name="bars" size={20} color="white" />
             </TouchableOpacity>
             <View>
                <Text className="text-blue-200 text-xs font-medium">Bem-vindo de volta,</Text>
                <Text className="text-xl font-bold text-white">KEVIN-TESTE</Text>
             </View>
          </View>
          
          {/* Lado Direito: Notificações Funcional */}
          <TouchableOpacity 
            onPress={handleNotificationPress}
            className="bg-blue-800 p-2.5 rounded-full border border-blue-700/50 relative"
          >
            <Feather name="bell" size={20} color="white" />
            {hasNotifications && (
              <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-blue-900" />
            )}
          </TouchableOpacity>
        </View>

        {/* CONTAINER DE CONTEÚDO */}
        <View className="flex-1 bg-gray-50 mt-[-20px] rounded-t-[35px] overflow-hidden pt-2">
          <ScrollView 
            className="flex-1 px-6 pt-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >

            {/* CARD DE RESUMO PRINCIPAL COM OPÇÃO DE ESCONDER */}
            <View className="bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-200/50 mb-8 relative overflow-hidden">
               <View className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl" />
               
               <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-blue-100 font-medium">Vendas Hoje</Text>
                  <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                    <Feather name={isBalanceVisible ? "eye" : "eye-off"} size={18} color="#BFDBFE" />
                  </TouchableOpacity>
               </View>

               <View className="flex-row items-end gap-2 mb-4">
                 <Text className="text-white text-4xl font-black">
                   {formatValue(summaryData.salesToday)}
                 </Text>
               </View>

               <View className="flex-row items-center gap-4">
                 <View className="flex-row items-center bg-blue-500/50 px-3 py-1.5 rounded-lg gap-2">
                    <Feather name="trending-up" color="#4ade80" size={16} />
                    <Text className="text-white text-xs font-bold">{summaryData.trend} vs. ontem</Text>
                 </View>
                 <Text className="text-blue-100 text-xs">{summaryData.ordersToday} pedidos realizados</Text>
               </View>
            </View>

            {/* NAVEGAÇÃO RÁPIDA */}
            <Text className="text-gray-600 font-bold text-sm mb-4 uppercase tracking-wider">Módulos do Sistema</Text>
            
            <View className="flex-row flex-wrap justify-between">
              <NavCard 
                title="Ponto de Venda"
                subtitle="Realizar vendas."
                icon={<FontAwesome6 name="cash-register" size={22} color="#9333ea" />}
                colorBg="bg-purple-100"
                route="/pdv"
                router={router}
              />

              <NavCard 
                title="Cardápio Digital"
                subtitle="Gerenciar produtos."
                icon={<FontAwesome6 name="burger" size={20} color="#ea580c" />}
                colorBg="bg-orange-100"
                route="/cardapio"
                router={router}
              />

              <NavCard 
                title="Financeiro"
                subtitle="Relatórios gerais."
                icon={<MaterialIcons name="attach-money" size={24} color="#16a34a" />}
                colorBg="bg-green-100"
                route="/financeiro"
                router={router}
              />

              <NavCard 
                title="Faturamento"
                subtitle="Dashboard detalhado."
                icon={<MaterialIcons name="bar-chart" size={24} color="#2563eb" />}
                colorBg="bg-blue-100"
                route="/dashboard-faturamento"
                router={router}
              />

              <NavCard 
                title="Fluxo de Caixa"
                subtitle="Entradas e saídas."
                icon={<FontAwesome6 name="money-bill-transfer" size={20} color="#0891b2" />}
                colorBg="bg-cyan-100"
                route="/fluxo-caixa"
                router={router}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}