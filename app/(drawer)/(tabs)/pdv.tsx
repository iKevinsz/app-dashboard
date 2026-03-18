import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts";
import { DollarSign, ShoppingBag, Package, TrendingUp, CreditCard, Calendar } from "lucide-react-native";

const screenWidth = Dimensions.get("window").width;

// --- PALETA DE CORES ---
const COLORS = {
  PRIMARY: '#023151',    // Azul Escuro (Marca)
  ACCENT: '#FF6600',     // Laranja (Destaque)
  WHITE: '#FFFFFF',
  BG: '#F9FAFB',
  TEXT_DARK: '#111827',
  TEXT_LIGHT: '#6B7280',
  SUCCESS: '#10B981',    // Verde (Pix/Receita)
  GRAY_BAR: '#CBD5E1'    // Barras inativas
};

// Cálculos de largura
const CHART_WIDTH = screenWidth - 32 - 32 - 40; 

// --- DADOS ---

const hourlyDataDay = [
  { label: "09h", value: 1200 },
  { label: "11h", value: 3800 },
  { label: "13h", value: 4500 },
  { label: "15h", value: 2100 },
  { label: "17h", value: 1800 },
  { label: "19h", value: 5200 },
  { label: "21h", value: 4100 },
];

const hourlyDataMonth = [
  { label: "Sem 1", value: 45000 },
  { label: "Sem 2", value: 52000 },
  { label: "Sem 3", value: 48000 },
  { label: "Sem 4", value: 61000 },
];

// Ajuste nas Cores do Pagamento
const paymentData = [
  { 
    label: "Pix", 
    value: 15700, 
    frontColor: COLORS.SUCCESS, // Verde Padrão
    topLabelComponent: () => <Text style={{fontSize: 10, color: COLORS.SUCCESS, marginBottom: 4}}>15.7k</Text> 
  }, 
  { 
    label: "Créd.", 
    value: 12500, 
    frontColor: COLORS.PRIMARY, // Azul Marca
    topLabelComponent: () => <Text style={{fontSize: 10, color: COLORS.PRIMARY, marginBottom: 4}}>12.5k</Text> 
  },
  { 
    label: "Déb.", 
    value: 8300, 
    frontColor: COLORS.ACCENT, // Laranja Marca
    topLabelComponent: () => <Text style={{fontSize: 10, color: COLORS.ACCENT, marginBottom: 4}}>8.3k</Text> 
  },
  { 
    label: "Dinh.", 
    value: 4200, 
    frontColor: '#6b7280', // Cinza
    topLabelComponent: () => <Text style={{fontSize: 10, color: '#6b7280', marginBottom: 4}}>4.2k</Text> 
  },
];

const weeklyData = [
  { label: "Seg", value: 2400 },
  { label: "Ter", value: 3100 },
  { label: "Qua", value: 3800 },
  { label: "Qui", value: 4200 },
  { label: "Sex", value: 5800, frontColor: COLORS.PRIMARY }, // Destaque Azul Marca
  { label: "Sáb", value: 6500, frontColor: COLORS.PRIMARY }, // Destaque Azul Marca
  { label: "Dom", value: 4300 },
];

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

// --- COMPONENTES AUXILIARES ---

const MetricCard = ({ title, value, change, isPositive, icon: Icon, iconColor }: any) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        <Icon size={14} color="white" />
      </View>
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={[styles.metricChange, { color: isPositive ? COLORS.SUCCESS : '#dc2626' }]}>
      {change}
    </Text>
  </View>
);

const FilterButton = ({ label, active, onPress }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[styles.filterBtn, active && styles.filterBtnActive]}
  >
    <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// --- TELA PRINCIPAL ---

export default function OverviewDashboard() {
  const [filterType, setFilterType] = useState<'Dia' | 'Mês'>('Dia');
  const currentChartData = filterType === 'Dia' ? hourlyDataDay : hourlyDataMonth;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* Header com Filtro */}
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>Dashboard PDV</Text>
        <View style={styles.filterContainer}>
          <FilterButton label="Dia" active={filterType === 'Dia'} onPress={() => setFilterType('Dia')} />
          <FilterButton label="Mês" active={filterType === 'Mês'} onPress={() => setFilterType('Mês')} />
        </View>
      </View>
      
      {/* Grid de Métricas */}
      <View style={styles.metricsGrid}>
        <MetricCard 
            title="Faturamento" 
            value={filterType === 'Dia' ? "R$ 4.5k" : "R$ 135k"} 
            change="+12.5%" 
            isPositive={true} 
            icon={DollarSign} 
            iconColor={COLORS.SUCCESS} 
        />
        <MetricCard 
            title="Pedidos" 
            value={filterType === 'Dia' ? "148" : "4.2k"} 
            change="+8.2%" 
            isPositive={true} 
            icon={ShoppingBag} 
            iconColor={COLORS.PRIMARY} // Azul Marca
        />
        <MetricCard 
            title="Produtos" 
            value={filterType === 'Dia' ? "342" : "12k"} 
            change="-2.1%" 
            isPositive={false} 
            icon={Package} 
            iconColor="#a855f7" 
        />
        <MetricCard 
            title="Ticket Médio" 
            value="R$ 30,54" 
            change="+5.1%" 
            isPositive={true} 
            icon={TrendingUp} 
            iconColor={COLORS.ACCENT} // Laranja Marca
        />
      </View>

      {/* Gráfico 1: Movimento */}
      <View style={styles.chartCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {filterType === 'Dia' ? 'Movimento por Hora' : 'Movimento Semanal'}
          </Text>
          <View style={styles.liveBadge}>
            <View style={styles.dot} />
            <Text style={styles.liveText}>Ao vivo</Text>
          </View>
        </View>
        
        <View style={{ marginLeft: -10 }}>
            <LineChart
                areaChart
                data={currentChartData}
                width={CHART_WIDTH}
                height={220}
                color={COLORS.SUCCESS}
                thickness={3}
                startFillColor="rgba(16, 185, 129, 0.3)"
                endFillColor="rgba(16, 185, 129, 0.05)"
                startOpacity={0.9}
                endOpacity={0.2}
                curved
                isAnimated
                hideRules
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisTextStyle={{color: COLORS.TEXT_LIGHT, fontSize: 10}}
                xAxisLabelTextStyle={{color: COLORS.TEXT_LIGHT, fontSize: 10}}
                yAxisLabelWidth={45}
                formatYLabel={(label) => `${parseInt(label) / 1000}k`}
                pointerConfig={{
                    pointerStripHeight: 160,
                    pointerStripColor: 'lightgray',
                    pointerStripWidth: 2,
                    pointerColor: 'lightgray',
                    radius: 6,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 90,
                    activatePointersOnLongPress: false,
                    autoAdjustPointerLabelPosition: false,
                    pointerComponent: () => (
                    <View style={{ height: 90, width: 100, justifyContent: 'center', marginTop: -30, marginLeft: -40 }}>
                        <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: 'white', elevation: 4 }}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: COLORS.TEXT_DARK }}>Vendas</Text>
                        </View>
                    </View>
                    ),
                }}
            />
        </View>
      </View>

      {/* Gráfico 2: Formas de Pagamento */}
      <View style={styles.chartCard}>
        <View style={styles.cardHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CreditCard size={18} color={COLORS.TEXT_LIGHT} style={{marginRight: 8}}/>
                <Text style={styles.cardTitle}>Formas de Pagamento</Text>
            </View>
        </View>
        
        <View style={{ marginTop: 10, alignItems: 'center' }}>
            <BarChart
                data={paymentData}
                barWidth={32}
                spacing={24}
                roundedTop
                hideRules
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={{color: COLORS.TEXT_LIGHT, fontSize: 10}}
                xAxisLabelTextStyle={{color: COLORS.TEXT_DARK, fontSize: 11, fontWeight: '500'}}
                width={CHART_WIDTH}
                height={180}
                isAnimated
                yAxisLabelWidth={40}
                formatYLabel={(label) => `${parseInt(label) / 1000}k`}
            />
        </View>
      </View>

      {/* Gráfico 3: Histórico Semanal */}
      <View style={[styles.chartCard, { marginBottom: 30 }]}>
        <View style={styles.cardHeader}>
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Calendar size={18} color={COLORS.TEXT_LIGHT} style={{marginRight: 8}}/>
                <Text style={styles.cardTitle}>Desempenho da Semana</Text>
            </View>
        </View>
        
        <View style={{ alignItems: 'center' }}>
            <BarChart
                data={weeklyData}
                barWidth={22}
                spacing={20}
                roundedTop
                hideRules
                xAxisThickness={0}
                yAxisThickness={0}
                frontColor={COLORS.GRAY_BAR} // Cinza claro padrão
                yAxisTextStyle={{color: COLORS.TEXT_LIGHT, fontSize: 10}}
                xAxisLabelTextStyle={{color: COLORS.TEXT_LIGHT, fontSize: 10}}
                width={CHART_WIDTH}
                height={180}
                isAnimated
                yAxisLabelWidth={40}
                formatYLabel={(label) => `${parseInt(label) / 1000}k`}
            />
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
  
  // Header & Filtro
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.TEXT_DARK,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterBtnActive: {
    backgroundColor: COLORS.PRIMARY, // Azul Ativo
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_LIGHT,
  },
  filterTextActive: {
    color: 'white',
  },

  // Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: (screenWidth - 32 - 12) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  iconContainer: {
    padding: 6,
    borderRadius: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_DARK,
    marginBottom: 2,
  },
  metricChange: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Cards de Gráfico
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_DARK,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.SUCCESS,
  },
  liveText: {
    fontSize: 10,
    color: COLORS.SUCCESS,
    fontWeight: '700',
  },
});