import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { FontAwesome6, Feather } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from "react";
import { useRouter, usePathname } from 'expo-router';

// --- COMPONENTE VISUAL DO MENU LATERAL ---
function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="flex-1 bg-white">
      {/* CABEÇALHO DO MENU */}
      <View className="p-6 pt-16 bg-blue-600 mb-2">
        <View className="flex-row items-center gap-4">
          <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center border-2 border-white/30">
             <FontAwesome6 name="store" size={24} color="white" />
          </View>
          <View>
            <Text className="text-white font-bold text-lg">Datacaixa Dashboard</Text>
            <Text className="text-blue-200 text-xs">KEVIN-TESTE</Text>
          </View>
        </View>
      </View>

      {/* LISTA DE LINKS */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 10 }}>
        <View className="px-4 gap-2">
          
          <DrawerMenuLink 
            label="Início" 
            icon="house" 
            isActive={pathname === '/'} 
            onPress={() => router.push('/')} 
          />
          
          <DrawerMenuLink 
            label="PDV Mobile" 
            icon="cash-register" 
            isActive={pathname === '/pdv'} 
            onPress={() => router.push('/pdv')} 
          />

          <DrawerMenuLink 
            label="Cardápio" 
            icon="burger" 
            isActive={pathname === '/cardapio'} 
            onPress={() => router.push('/cardapio')} 
          />

          <DrawerMenuLink 
            label="Faturamento" 
            icon="chart-line" 
            isActive={pathname === '/faturamento'} 
            onPress={() => router.push('/faturamento')} 
          />

          <View className="h-[1px] bg-gray-100 my-2 mx-2" />

          <DrawerMenuLink 
            label="Fluxo de Caixa" 
            icon="money-bill-transfer" 
            isActive={pathname === '/fluxo-caixa'} 
            onPress={() => router.push('/fluxo-caixa')} 
          />

        </View>
      </DrawerContentScrollView>

      {/* RODAPÉ */}
      <View className="p-4 border-t border-gray-100 pb-8">
        <TouchableOpacity className="flex-row items-center gap-3 p-3 rounded-xl active:bg-red-50">
          <Feather name="log-out" size={20} color="#EF4444" />
          <Text className="text-gray-600 font-medium text-sm">Sair do App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Botão do Menu (Componente Auxiliar)
const DrawerMenuLink = ({ label, icon, isActive, onPress }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`flex-row items-center gap-3 p-3.5 rounded-xl transition-all ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}
  >
    <View className="w-8 items-center">
      <FontAwesome6 name={icon} size={18} color={isActive ? "#2563EB" : "#6B7280"} />
    </View>
    <Text className={`font-medium text-sm ${isActive ? 'text-blue-700 font-bold' : 'text-gray-600'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

// --- CONFIGURAÇÃO DO DRAWER ---
export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false, // Esconde o header padrão feio
          drawerType: 'front', // Sidebar sobrepõe o conteúdo
          drawerStyle: { width: '80%', backgroundColor: '#fff' },
          overlayColor: 'rgba(0,0,0,0.6)',
        }}
      >
        <Drawer.Screen name="index" />
        <Drawer.Screen name="pdv" />
        <Drawer.Screen name="cardapio" />
        <Drawer.Screen name="faturamento" />
        <Drawer.Screen name="fluxo-caixa" />
      </Drawer>
    </GestureHandlerRootView>
  );
}