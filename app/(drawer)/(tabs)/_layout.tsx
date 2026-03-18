import { Tabs } from 'expo-router';
import { FontAwesome6, Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { DashboardHeader } from '../../../components/DashboardHeader';
import { DrawerActions } from '@react-navigation/native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ navigation }) => ({
        // HEADER PADRÃO
        header: ({ options }) => (
            <DashboardHeader
                title={options.title || ""}
                onMenuClick={() => navigation.dispatch(DrawerActions.openDrawer())} 
            />
        ),
        tabBarActiveTintColor: '#2563eb', // Azul
        tabBarInactiveTintColor: '#64748b', // Cinza slate
        tabBarStyle: {
            height: 70, // Altura um pouco maior para conforto visual
            paddingBottom: 12,
            paddingTop: 12,
            borderTopLeftRadius: 24, // Arredondamento superior
            borderTopRightRadius: 24,
            backgroundColor: 'white',
            borderTopWidth: 0, // Remove linha padrão
            elevation: 10, // Sombra Android
            shadowColor: '#000', // Sombra iOS
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            position: 'absolute', // Garante que fique sobreposta se necessário
            bottom: 0,
            left: 0,
            right: 0,
        },
        tabBarLabelStyle: { 
            fontSize: 11, 
            fontWeight: '600', 
            marginTop: 4 
        },
        tabBarIconStyle: {
            marginBottom: 0
        }
      })}
    >
      {/* 1. INÍCIO (Home) */}
      <Tabs.Screen 
        name="home" 
        options={{
          title: "Dashboard",
          tabBarLabel: "Início",
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />
        }} 
      />

      {/* 2. PDV */}
      <Tabs.Screen 
        name="pdv" 
        options={{
          title: "Visão Geral",
          tabBarLabel: "PDV",
          tabBarIcon: ({ color }) => <FontAwesome6 name="store" size={20} color={color} />
        }} 
      />

      {/* 3. CARDÁPIO */}
      <Tabs.Screen 
        name="cardapio" 
        options={{
          title: "Cardápio Digital",
          tabBarLabel: "Cardápio",
          // Ícone de talheres cruzados igual da imagem
          tabBarIcon: ({ color }) => <FontAwesome6 name="utensils" size={20} color={color} />
        }} 
      />

      {/* 4. FATURAMENTO */}
      <Tabs.Screen 
        name="dashboard-faturamento" 
        options={{
          title: "Faturamento",
          tabBarLabel: "Faturam.",
          tabBarIcon: ({ color }) => <MaterialIcons name="bar-chart" size={26} color={color} />
        }} 
      />

      {/* 5. PERFIL */}
      <Tabs.Screen 
        name="perfil" 
        options={{
          title: "Meu Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />
        }} 
      />

      
      <Tabs.Screen 
        name="financeiro" 
        options={{
          href: null, 
          title: "Financeiro",
        }} 
      />

    </Tabs>
  );
}