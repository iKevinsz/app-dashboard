import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

const MenuCard = ({ title, subtitle, icon, color, route, router }: any) => (
  <TouchableOpacity 
    onPress={() => router.push(route)}
    className="w-[48%] bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 items-center justify-center py-6 active:bg-gray-50 active:scale-95 transition-all"
  >
    <View className={`w-12 h-12 rounded-full ${color} items-center justify-center mb-3`}>
      {icon}
    </View>
    <Text className="text-gray-800 font-bold text-sm text-center">{title}</Text>
    <Text className="text-gray-400 text-[10px] text-center mt-1">{subtitle}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="p-6 pt-12 pb-24">
        
        {/* HEADER COM BOTÃO MENU */}
        <View className="flex-row justify-between items-center mb-8">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
              className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm"
            >
              <FontAwesome6 name="bars" size={18} color="#374151" />
            </TouchableOpacity>
            <View>
              <Text className="text-gray-500 text-xs uppercase font-bold tracking-wider">Bem-vindo,</Text>
              <Text className="text-xl font-black text-gray-800">Restaurante</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-white p-3 rounded-full border border-gray-200 shadow-sm">
            <FontAwesome6 name="bell" size={18} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* CARD RESUMO */}
        <View className="bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-200 mb-8 relative overflow-hidden">
          <View className="absolute -right-4 -top-4 w-32 h-32 bg-white opacity-10 rounded-full" />
          <Text className="text-blue-100 text-sm font-medium mb-1">Faturamento Hoje</Text>
          <Text className="text-white text-4xl font-black">R$ 1.250,00</Text>
          <View className="flex-row items-center mt-4 gap-2">
            <View className="bg-blue-500 px-3 py-1 rounded-full flex-row items-center">
              <FontAwesome6 name="arrow-trend-up" color="white" size={10} />
              <Text className="text-white text-xs font-bold ml-1">+15%</Text>
            </View>
            <Text className="text-blue-200 text-xs">vs ontem</Text>
          </View>
        </View>

        {/* GRID DE MÓDULOS */}
        <Text className="text-lg font-bold text-gray-800 mb-4 ml-1">Módulos</Text>
        <View className="flex-row flex-wrap justify-between">
          <MenuCard 
            title="PDV Mobile" subtitle="Lançar vendas" color="bg-purple-50"
            icon={<FontAwesome6 name="cash-register" size={20} color="#9333ea" />}
            route="/pdv" router={router}
          />
          <MenuCard 
            title="Cardápio" subtitle="Produtos e preços" color="bg-orange-50"
            icon={<FontAwesome6 name="burger" size={20} color="#ea580c" />}
            route="/cardapio" router={router}
          />
          <MenuCard 
            title="Financeiro" subtitle="Gráficos e Metas" color="bg-green-50"
            icon={<FontAwesome6 name="chart-pie" size={20} color="#16a34a" />}
            route="/financeiro" router={router}
          />
          <MenuCard 
            title="Fluxo de Caixa" subtitle="Entradas e Saídas" color="bg-blue-50"
            icon={<FontAwesome6 name="money-bill-transfer" size={20} color="#2563eb" />}
            route="/fluxo-caixa" router={router}
          />
        </View>
      </View>
    </ScrollView>
  );
}