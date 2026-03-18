import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { 
  Store, 
  UtensilsCrossed, 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  ChevronRight,
  ArrowUpRight
} from "lucide-react-native";

// Paleta do Projeto
const COLORS = {
  PRIMARY: '#023151',    // Azul Escuro
  ACCENT: '#FF6600',     // Laranja
  WHITE: '#FFFFFF',
  BG: '#F9FAFB',
  TEXT_DARK: '#111827',
  TEXT_LIGHT: '#6B7280',
  SUCCESS: '#10B981',
  SUCCESS_BG: '#ECFDF5',
};

// CÁLCULO CORRIGIDO PARA O GRID
const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 20; // Padding do container
const GAP = 16; // Espaço entre os cards
// (Largura Total - Padding Esquerdo - Padding Direito - Gap Central) / 2 colunas
const CARD_WIDTH = (width - (PADDING_HORIZONTAL * 2) - GAP) / 2;

export default function HomeScreen() {
  const router = useRouter();

  const stats = [
    {
      label: "Vendas Hoje",
      value: "R$ 12.450",
      change: "+15%",
      positive: true,
      icon: DollarSign,
      colorIcon: COLORS.SUCCESS, 
      bgIcon: COLORS.SUCCESS_BG    
    },
    {
      label: "Pedidos",
      value: "127",
      change: "+8%",
      positive: true,
      icon: ShoppingBag,
      colorIcon: "#3B82F6", 
      bgIcon: "#EFF6FF"    
    },
    {
      label: "Ticket Médio",
      value: "R$ 98",
      change: "+5%",
      positive: true,
      icon: TrendingUp,
      colorIcon: "#8B5CF6", 
      bgIcon: "#F5F3FF"    
    },
    {
      label: "Em Aberto",
      value: "R$ 2.340",
      change: "-3%",
      positive: false,
      icon: Clock,
      colorIcon: COLORS.ACCENT, 
      bgIcon: "#FFF7ED"    
    }
  ];

  const quickActions = [
    {
      route: "/pdv",
      title: "PDV",
      description: "Frente de caixa",
      icon: Store,
      color: COLORS.PRIMARY 
    },
    {
      route: "/cardapio",
      title: "Cardápio",
      description: "Dashboard de vendas",
      icon: UtensilsCrossed,
      color: "#10B981" 
    },
    {
      route: "/dashboard-faturamento",
      title: "Faturamento",
      description: "Relatórios gerais",
      icon: BarChart3,
      color: "#8B5CF6" 
    },
    {
      route: "/financeiro",
      title: "Financeiro",
      description: "Contas a pagar",
      icon: Wallet,
      color: COLORS.ACCENT 
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* Welcome Section */}
      <LinearGradient
        colors={[COLORS.PRIMARY, '#0c4a6e']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.welcomeCard}
      >
        <View>
            <Text style={styles.welcomeTitle}>Olá, Empreendedor!</Text>
            <Text style={styles.welcomeSubtitle}>Resumo do seu negócio hoje</Text>
        </View>
        <View style={styles.decorativeCircle} />
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statHeader}>
                <View style={[styles.iconBox, { backgroundColor: stat.bgIcon }]}>
                  <stat.icon size={18} color={stat.colorIcon} />
                </View>
                <View style={[styles.badge, { backgroundColor: stat.positive ? COLORS.SUCCESS_BG : '#FEF2F2' }]}>
                    <Text style={[styles.badgeText, { color: stat.positive ? COLORS.SUCCESS : '#EF4444' }]}>
                        {stat.change}
                    </Text>
                </View>
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.actionsList}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => router.push(action.route as any)}
              style={styles.actionButton}
            >
              <View style={[styles.actionIconBox, { backgroundColor: action.color + '15' }]}>
                <action.icon size={22} color={action.color} />
              </View>
              <View style={styles.actionTexts}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <View style={styles.actionArrow}>
                 <ChevronRight size={18} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atividade Recente</Text>
            <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver tudo</Text>
            </TouchableOpacity>
        </View>
        
        <View style={styles.activityCard}>
          {[
            { time: "10:45", desc: "Venda Mesa 12", value: "R$ 145,00", type: "in" },
            { time: "10:32", desc: "Pedido Ifood #1239", value: "R$ 89,50", type: "in" },
            { time: "09:15", desc: "Sangria de Caixa", value: "- R$ 150,00", type: "out" }
          ].map((activity, index, arr) => (
            <View 
              key={index} 
              style={[
                styles.activityItem, 
                index === arr.length - 1 && { borderBottomWidth: 0 }
              ]}
            >
              <View style={styles.activityLeft}>
                <View style={[styles.activityIconBox, { backgroundColor: activity.type === 'in' ? '#ECFDF5' : '#FEF2F2' }]}>
                  {activity.type === 'in' ? (
                      <ArrowUpRight size={16} color={COLORS.SUCCESS} />
                  ) : (
                      <ArrowUpRight size={16} color="#EF4444" style={{ transform: [{ rotate: '180deg' }] }} />
                  )}
                </View>
                <View>
                  <Text style={styles.activityDesc}>{activity.desc}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
              <Text style={[styles.activityValue, { color: activity.type === 'in' ? COLORS.TEXT_DARK : '#EF4444' }]}>
                {activity.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  contentContainer: {
    padding: PADDING_HORIZONTAL, // 20
    paddingBottom: 40,
  },
  
  // Welcome Section
  welcomeCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative'
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#E0E7FF', 
  },
  decorativeCircle: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.ACCENT, 
    opacity: 0.15
  },

  // Stats Grid - Correção de Layout
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP, // 16
    marginBottom: 24,
    // justifyContent: 'space-between' // Opcional se o gap não for suportado, mas o gap é preferível
  },
  statCard: {
    width: CARD_WIDTH, // Largura exata calculada
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: 'center'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.TEXT_DARK,
    marginBottom: 2,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.PRIMARY, 
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 12,
    color: COLORS.ACCENT,
    fontWeight: '600',
  },
  
  // Quick Actions
  actionsList: {
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionTexts: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_DARK,
  },
  actionDescription: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2
  },
  actionArrow: {
    padding: 4
  },

  // Recent Activity
  activityCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2
  },
  activityValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});