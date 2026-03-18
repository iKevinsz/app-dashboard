import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { Eye, ShoppingBag, MousePointerClick, Share2, TrendingUp } from "lucide-react-native";

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32 - 12) / 2;

// --- PALETA DE CORES ---
const COLORS = {
  PRIMARY: '#023151',    // Azul Escuro (Marca)
  ACCENT: '#FF6600',     // Laranja (Destaque)
  WHITE: '#FFFFFF',
  BG: '#F9FAFB',
  TEXT_DARK: '#111827',
  TEXT_LIGHT: '#6B7280',
  SUCCESS: '#10B981',    
  SUCCESS_BG: '#dcfce7',
  PRIMARY_BG: '#e0f2fe',
  ACCENT_BG: '#fff7ed',
  PURPLE_BG: '#f3e8ff'
};

export default function MenuAnalyticsScreen() {
  
  const stats = [
    { 
      label: "Visitas no Link", 
      value: "1.245", 
      change: "+12%", 
      icon: Eye,
      color: COLORS.PRIMARY, 
      bg: COLORS.PRIMARY_BG 
    },
    { 
      label: "Pedidos Feitos", 
      value: "84", 
      change: "+5%", 
      icon: ShoppingBag,
      color: COLORS.SUCCESS, 
      bg: COLORS.SUCCESS_BG 
    },
    { 
      label: "Taxa de Conversão", 
      value: "6.7%", 
      change: "-1.2%", 
      icon: MousePointerClick,
      color: COLORS.ACCENT, 
      bg: COLORS.ACCENT_BG 
    },
    { 
      label: "Faturamento Web", 
      value: "R$ 4.2k", 
      change: "+8%", 
      icon: TrendingUp,
      color: "#9333ea", 
      bg: COLORS.PURPLE_BG 
    },
  ];

  const topProducts = [
    { name: "Combo Família", views: 145, sales: 22 },
    { name: "Promoção do Dia", views: 98, sales: 18 },
    { name: "Refrigerante 2L", views: 80, sales: 15 },
  ];

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      
      {/* Header Institucional */}
      <LinearGradient
        colors={[COLORS.PRIMARY, '#0c4a6e']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Seu Cardápio Digital</Text>
        <Text style={styles.headerSubtitle}>Acompanhe o desempenho do seu link online.</Text>
        
        {/* Ação Única: Compartilhar */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButtonWhite} activeOpacity={0.8}>
            <Share2 size={20} color={COLORS.PRIMARY} />
            <Text style={styles.actionTextBlue}>Compartilhar Link do Cardápio</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Grid de Estatísticas */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <TouchableOpacity key={index} style={styles.statCard} activeOpacity={0.9}>
            <View style={styles.statHeader}>
              <View style={[styles.iconBox, { backgroundColor: stat.bg }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <View style={[
                  styles.badge, 
                  { backgroundColor: stat.change.includes('+') ? COLORS.SUCCESS_BG : '#fee2e2' }
                ]}>
                <Text style={[
                  styles.changeText, 
                  { color: stat.change.includes('+') ? COLORS.SUCCESS : '#dc2626' }
                ]}>
                  {stat.change}
                </Text>
              </View>
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Gráfico Simplificado (Barras Sobrepostas) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Funil de Vendas (Hoje)</Text>
          <Text style={styles.cardSubtitle}>Visitas vs. Pedidos por hora</Text>
        </View>
        
        <View style={styles.chartContainer}>
          {[40, 65, 30, 85, 50, 90, 60].map((height, i) => (
            <View key={i} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View style={[styles.barVisits, { height: `${height}%` }]}>
                    <View style={[styles.barSales, { height: `${height * 0.4}%` }]} />
                </View>
              </View>
              <Text style={styles.barLabel}>{12 + i}h</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#bfdbfe' }]} />
            <Text style={styles.legendText}>Visitas</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: COLORS.SUCCESS }]} />
            <Text style={styles.legendText}>Pedidos (Conv.)</Text>
          </View>
        </View>
      </View>

      {/* Produtos com Maior Conversão */}
      <View style={[styles.card, { marginBottom: 30 }]}>
        <View style={styles.cardHeaderBorder}>
          <Text style={styles.cardTitle}>Produtos Destaque</Text>
        </View>
        
        <View>
          {topProducts.map((prod, i) => (
            <View key={i} style={[styles.productRow, i === topProducts.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{prod.name}</Text>
                <View style={styles.viewBadge}>
                   <Eye size={12} color={COLORS.TEXT_LIGHT} />
                   <Text style={styles.productViews}>{prod.views}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.productSales}>{prod.sales} vendas</Text>
                <Text style={styles.productConv}>
                   Conv. {((prod.sales / prod.views) * 100).toFixed(0)}%
                </Text>
              </View>
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
    padding: 16,
    paddingBottom: 40,
  },
  
  // Header
  headerGradient: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#dbeafe',
    marginBottom: 20,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
  },
  // Botão Branco (Ação Principal)
  actionButtonWhite: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  actionTextBlue: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '700',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconBox: {
    padding: 10,
    borderRadius: 12,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.TEXT_DARK,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },

  // Card Genérico
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  cardHeaderBorder: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_DARK,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },

  // Gráfico
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 12,
  },
  barColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  barTrack: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 6,
  },
  barVisits: {
    width: 12,
    backgroundColor: '#bfdbfe', 
    borderRadius: 6,
    justifyContent: 'flex-end', 
    overflow: 'hidden',
  },
  barSales: {
    width: '100%',
    backgroundColor: COLORS.SUCCESS,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },

  // Lista
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  productInfo: {
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  viewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productViews: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
  productSales: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.SUCCESS,
  },
  productConv: {
    fontSize: 11,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
});