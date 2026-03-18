import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  X, 
  Store, 
  UtensilsCrossed, 
  BarChart3, 
  Wallet, 
  User, 
  LogOut 
} from 'lucide-react-native';

// --- CONTEÚDO CUSTOMIZADO DA SIDEBAR ---
function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // --- ITEM DE MENU ---
  const MenuItem = ({ label, icon: Icon, route }: any) => {
    // isActive verifica rota atual (lógica opcional para estilização)
    const isActive = pathname.includes(route.replace('/', ''));
    
    return (
      <TouchableOpacity 
        onPress={() => router.push(route)}
        className="flex-row items-center py-4 px-2 active:bg-gray-50 rounded-lg"
      >
        <Icon size={22} color="#4b5563" /> 
        <Text className="ml-4 text-gray-700 font-medium text-base">{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    // PaddingTop ajusta para a barra de status
    <View style={{ flex: 1, paddingTop: insets.top }} className="bg-white">
      
      {/* 1. HEADER: Logo e Fechar */}
      <View className="flex-row justify-between items-center p-6 border-b border-gray-100 mt-2">
        <Text className="text-xl font-bold text-gray-900">
          Datacaixa <Text className="text-orange-700">App</Text>
        </Text>
        
        <TouchableOpacity 
          onPress={() => props.navigation.closeDrawer()}
          className="p-1"
        >
           <X size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* 2. LISTA DE NAVEGAÇÃO */}
      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <MenuItem label="Dashboard PDV" icon={Store} route="/pdv" />
        <MenuItem label="Cardápio" icon={UtensilsCrossed} route="/cardapio" />
        <MenuItem label="Faturamento" icon={BarChart3} route="/dashboard-faturamento" />
        <MenuItem label="Financeiro" icon={Wallet} route="/financeiro" />
        <MenuItem label="Meu Perfil" icon={User} route="/perfil" />
      </ScrollView>

      {/* 3. RODAPÉ: Sair */}
      <View className="p-6 border-t border-gray-100 mb-6">
        <TouchableOpacity 
          onPress={() => router.replace('/')} 
          className="flex-row items-center px-2 py-2"
        >
          <LogOut size={22} color="#dc2626" />
          <Text className="ml-4 text-red-600 font-medium text-base">Sair</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

// --- LAYOUT PRINCIPAL DO DRAWER ---
export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false, // Header controlado pelas Tabs internas
          drawerType: 'front', // Sobrepõe o conteúdo
          drawerStyle: { 
            width: '80%', 
            backgroundColor: 'white',
            borderTopRightRadius: 24, 
            borderBottomRightRadius: 24, 
          },
          overlayColor: 'rgba(0,0,0,0.5)', 
        }}
      >
        {/* Rota principal: Grupo de Abas */}
        <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Rotas secundárias ocultas */}
        <Drawer.Screen name="home" options={{ headerShown: false }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}