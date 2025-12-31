import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6, Feather, MaterialIcons } from "@expo/vector-icons";

// --- ITEM DE MENU PERSONALIZADO ---
const DrawerItem = ({ icon, label, route, isActive, onPress }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`flex-row items-center p-4 rounded-xl mb-2 transition-all active:scale-[0.98] ${
      isActive ? 'bg-blue-50' : 'bg-transparent'
    }`}
  >
    <View className={`w-8 items-center justify-center`}>
      {icon(isActive ? "#2563EB" : "#9CA3AF")}
    </View>
    <Text className={`ml-3 font-bold text-sm ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
      {label}
    </Text>
    {isActive && (
      <View className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
    )}
  </TouchableOpacity>
);

// --- CONTEÚDO CUSTOMIZADO DO DRAWER ---
function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname(); 
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-blue-900" style={{ paddingTop: insets.top }}>
      
      {/* 1. CABEÇALHO DO PERFIL */}
      <View className="px-6 pt-6 pb-8">
        <View className="flex-row items-center gap-4">
          <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center border border-white/30 backdrop-blur-md">
             <FontAwesome6 name="user-large" size={24} color="white" />
          </View>
          <View>
            <Text className="text-white font-bold text-lg">KEVIN-TESTE</Text>
            <Text className="text-blue-200 text-xs">CNPJ: 00.000.000/0000-00</Text>
          </View>
        </View>
      </View>

      {/* 2. CORPO BRANCO ARREDONDADO */}
      <View className="flex-1 bg-white mt-2 rounded-t-[35px] overflow-hidden">
        <ScrollView 
          className="flex-1 px-6 pt-8" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text className="text-xs font-bold text-gray-400 uppercase mb-4 ml-2">Principal</Text>

          {/* AJUSTADO: Rota aponta para '/home' */}
          <DrawerItem 
            label="Visão Geral"
            route="/home"
            isActive={pathname === '/home'}
            onPress={() => router.push('/home')}
            icon={(color: string) => <Feather name="grid" size={20} color={color} />}
          />

          <DrawerItem 
            label="Ponto de Venda"
            route="/pdv"
            isActive={pathname === '/pdv'}
            onPress={() => router.push('/pdv')}
            icon={(color: string) => <FontAwesome6 name="cash-register" size={18} color={color} />}
          />

          <DrawerItem 
            label="Cardápio Digital"
            route="/cardapio"
            isActive={pathname === '/cardapio'}
            onPress={() => router.push('/cardapio')}
            icon={(color: string) => <FontAwesome6 name="burger" size={18} color={color} />}
          />

          <Text className="text-xs font-bold text-gray-400 uppercase mb-4 mt-4 ml-2">Gestão</Text>

          {/* AJUSTADO: Aponta corretamente para '/financeiro' */}
          <DrawerItem 
            label="Financeiro"
            route="/financeiro"
            isActive={pathname === '/financeiro'}
            onPress={() => router.push('/financeiro')}
            icon={(color: string) => <MaterialIcons name="attach-money" size={22} color={color} />}
          />

          {/* AJUSTADO: Aponta para '/dashboard-faturamento' */}
          <DrawerItem 
            label="Faturamento"
            route="/dashboard-faturamento"
            isActive={pathname === '/dashboard-faturamento'}
            onPress={() => router.push('/dashboard-faturamento')}
            icon={(color: string) => <MaterialIcons name="bar-chart" size={22} color={color} />}
          />

          <DrawerItem 
            label="Fluxo de Caixa"
            route="/fluxo-caixa"
            isActive={pathname === '/fluxo-caixa'}
            onPress={() => router.push('/fluxo-caixa')}
            icon={(color: string) => <FontAwesome6 name="money-bill-transfer" size={18} color={color} />}
          />

           <DrawerItem 
            label="Configurações"
            route="/config"
            isActive={false} 
            onPress={() => {}}
            icon={(color: string) => <Feather name="settings" size={20} color={color} />}
          />

        </ScrollView>

        {/* 3. RODAPÉ */}
        <View className="p-6 border-t border-gray-100">
          <TouchableOpacity 
            onPress={() => router.replace('/')} // Volta para o Login (raiz)
            className="flex-row items-center justify-center p-4 bg-red-50 rounded-xl active:bg-red-100"
          >
            <Feather name="log-out" size={18} color="#EF4444" />
            <Text className="ml-2 font-bold text-red-500">Sair da Conta</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

// --- CONFIGURAÇÃO DAS ROTAS DO DRAWER ---
export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          drawerStyle: { 
            width: '80%', 
            backgroundColor: 'transparent',
          },
          overlayColor: 'rgba(0,0,0,0.5)',
        }}
      >
        
        <Drawer.Screen name="index" /> 
        
        <Drawer.Screen name="pdv" />
        <Drawer.Screen name="cardapio" />
        <Drawer.Screen name="financeiro" />
        <Drawer.Screen name="dashboard-faturamento" />
        <Drawer.Screen name="fluxo-caixa" />
      </Drawer>
    </GestureHandlerRootView>
  );
}