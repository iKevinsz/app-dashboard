import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { PieChart, BarChart } from "react-native-gifted-charts";
import { DollarSign, TrendingDown, Wallet, Percent } from "lucide-react-native";

const { width } = Dimensions.get("window");
// Cálculos de largura para garantir responsividade sem cortes
const PADDING_HORIZONTAL = 16;
const CARD_PADDING = 16;
const AVAILABLE_WIDTH = width - (PADDING_HORIZONTAL * 2) - (CARD_PADDING * 2);

// --- PALETA DE CORES ---
const COLORS = {
  PRIMARY: '#023151',    // Azul Escuro (Marca)
  ACCENT: '#FF6600',     // Laranja (Destaque)
  WHITE: '#FFFFFF',
  BG: '#F9FAFB',
  TEXT_DARK: '#111827',
  TEXT_LIGHT: '#6B7280',
  SUCCESS: '#10B981',    
  DANGER: '#EF4444',
  GRAY_LIGHT: '#CBD5E1'
};

// --- DADOS ---

const expensesData = [
  { value: 4500, color: COLORS.PRIMARY, text: '43%', label: 'Insumos' }, // Azul Marca
  { value: 3200, color: COLORS.ACCENT, text: '30%', label: 'Pessoal' },  // Laranja Marca
  { value: 1800, color: '#3b82f6', text: '17%', label: 'Aluguel' },      // Azul Claro
  { value: 950, color: '#94a3b8', text: '9%', label: 'Impostos' },       // Cinza
];

const cashFlowRaw = [
  { month: "Jan", receita: 12500, despesa: 8400 },
  { month: "Fev", receita: 11200, despesa: 7900 },
  { month: "Mar", receita: 14800, despesa: 9100 },
  { month: "Abr", receita: 13500, despesa: 8800 },
];

const cashFlowData: any[] = [];
cashFlowRaw.forEach(item => {
  cashFlowData.push({ 
    value: item.receita, 
    label: item.month, 
    frontColor: COLORS.SUCCESS, // Verde (Padrão financeiro)
    spacing: 4 
  });
  cashFlowData.push({ 
    value: item.despesa, 
    frontColor: COLORS.DANGER, // Vermelho (Padrão financeiro)
    spacing: 32 
  });
});

const dailyProfitData = [
  { label: "Seg", value: 450 },
  { label: "Ter", value: 620 },
  { label: "Qua", value: 890 },
  { label: "Qui", value: 1200 },
  { label: "Sex", value: 2100 },
  { label: "Sáb", value: 2400 },
];

// --- COMPONENTES ---

const MetricCard = ({ title, value, change, isPositive, icon: Icon, color }: any) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
      </View>
      {change && (
        <View style={[styles.badge, { backgroundColor: isPositive ? '#dcfce7' : '#fee2e2' }]}>
          <Text style={[styles.changeText, { color: isPositive ? COLORS.SUCCESS : COLORS.DANGER }]}>
            {change}
          </Text>
        </View>
      )}
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricTitle}>{title}</Text>
  </View>
);

const LegendItem = ({ color, label }: any) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

// --- TELA ---

export default function AnalyticsDashboard() {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer} 
      showsVerticalScrollIndicator={false}
    >
      
      {/* 1. Métricas Principais */}
      <Text style={styles.sectionTitle}>Visão Geral</Text>
      <View style={styles.grid}>
        <MetricCard title="Receita Bruta" value="R$ 52k" change="+12%" isPositive={true} icon={DollarSign} color={COLORS.PRIMARY} />
        <MetricCard title="Despesas" value="R$ 34k" change="+5%" isPositive={false} icon={TrendingDown} color={COLORS.DANGER} />
        <MetricCard title="Lucro Líq." value="R$ 17.8k" change="+18%" isPositive={true} icon={Wallet} color={COLORS.SUCCESS} />
        <MetricCard title="Margem" value="34.2%" change="+2.1%" isPositive={true} icon={Percent} color={COLORS.ACCENT} />
      </View>

      {/* 2. Gráfico de Pizza (Custos) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Composição de Custos</Text>
        </View>
        
        <View style={styles.chartWrapper}>
          <PieChart
            data={expensesData}
            donut
            radius={90}
            innerRadius={60}
            textSize={12}
            showText
            textColor="white"
            fontWeight="bold"
            focusOnPress
          />
          
          <View style={styles.legendGrid}>
            {expensesData.map((item, index) => (
              <LegendItem key={index} color={item.color} label={item.label} />
            ))}
          </View>
        </View>
      </View>

      {/* 3. Fluxo de Caixa */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Fluxo de Caixa</Text>
          <View style={styles.legendRow}>
             <LegendItem color={COLORS.SUCCESS} label="Entrada" />
             <LegendItem color={COLORS.DANGER} label="Saída" />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
           <BarChart
            data={cashFlowData}
            barWidth={12}
            initialSpacing={15}
            spacing={20}
            roundedTop
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: COLORS.TEXT_LIGHT, fontSize: 11 }}
            xAxisLabelTextStyle={{ color: COLORS.TEXT_LIGHT, fontSize: 11 }}
            height={220}
            width={AVAILABLE_WIDTH}
            isAnimated
            maxValue={16000}
            yAxisLabelWidth={45}
            formatYLabel={(label) => `${parseInt(label) / 1000}k`}
          />
        </View>
      </View>

      {/* 4. Lucratividade */}
      <View style={[styles.card, { marginBottom: 30 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Lucro Diário</Text>
          <Text style={styles.cardSubtitle}>Últimos 7 dias</Text>
        </View>
        
        <View style={{ marginTop: 10 }}>
          <BarChart
            data={dailyProfitData.map(item => ({
              value: item.value,
              label: item.label,
              // Laranja para baixo desempenho, Azul para normal
              frontColor: item.value < 500 ? COLORS.ACCENT : COLORS.PRIMARY, 
              topLabelComponent: () => (
                <Text style={{ fontSize: 9, color: COLORS.TEXT_LIGHT, marginBottom: 4 }}>
                  {item.value}
                </Text>
              )
            }))}
            barWidth={26}
            spacing={20}
            initialSpacing={15}
            roundedTop
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: COLORS.TEXT_LIGHT, fontSize: 11 }}
            height={180}
            width={AVAILABLE_WIDTH}
            yAxisLabelWidth={40}
            isAnimated
          />
        </View>
      </View>

    </ScrollView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  contentContainer: {
    padding: PADDING_HORIZONTAL,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_DARK,
    marginBottom: 12,
    marginLeft: 4,
  },
  
  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: (width - 32 - 12) / 2,
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#64748b',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  metricHeader: {
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.TEXT_DARK,
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  metricTitle: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '600',
  },

  // Cards Gráficos
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: CARD_PADDING,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#64748b',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  
  // Layout Charts
  chartWrapper: {
    alignItems: 'center',
    gap: 24,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
});