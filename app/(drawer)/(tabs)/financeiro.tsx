import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Calendar, CreditCard, Banknote, Wallet, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react-native";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get("window");

// --- PALETA DE CORES (Padronizada) ---
const COLORS = {
  PRIMARY: '#023151',    // Azul Escuro (Marca)
  ACCENT: '#FF6600',     // Laranja (Destaque)
  WHITE: '#FFFFFF',
  BG: '#F9FAFB',         // Fundo Cinza Claro
  TEXT_DARK: '#111827',
  TEXT_LIGHT: '#6B7280',
  SUCCESS: '#10B981',    // Verde (Receitas/Pix)
  DANGER: '#EF4444',     // Vermelho (Despesas)
  GRAY_ICON: '#64748b'
};

// --- DADOS ---

const DETALHAMENTO_DADOS = [
  { mes: "Jan/25", receitas: 4500, despesas: 3200, saldo: 1300 },
  { mes: "Fev/25", receitas: 5200, despesas: 2800, saldo: 2400 },
  { mes: "Mar/25", receitas: 4800, despesas: 4100, saldo: 700 },
  { mes: "Abr/25", receitas: 6100, despesas: 3500, saldo: 2600 },
  { mes: "Mai/25", receitas: 5900, despesas: 3000, saldo: 2900 },
  { mes: "Jun/25", receitas: 7200, despesas: 4500, saldo: 2700 },
  { mes: "Jul/25", receitas: 8400, despesas: 3900, saldo: 4500 },
  { mes: "Ago/25", receitas: 7800, despesas: 4200, saldo: 3600 },
  { mes: "Set/25", receitas: 8900, despesas: 4800, saldo: 4100 },
  { mes: "Out/25", receitas: 9500, despesas: 5100, saldo: 4400 },
  { mes: "Nov/25", receitas: 10200, despesas: 5500, saldo: 4700 },
  { mes: "Dez/25", receitas: 11500, despesas: 6000, saldo: 5500 },
];

const PAYMENT_DATA = [
  { value: 18500, color: COLORS.PRIMARY, text: "48%", label: "Crédito" }, // Azul Marca
  { value: 12200, color: COLORS.SUCCESS, text: "32%", label: "Pix" },     // Verde Padrão
  { value: 5400, color: COLORS.ACCENT, text: "14%", label: "Débito" },    // Laranja Marca
  { value: 2100, color: '#94a3b8', text: "6%", label: "Dinheiro" },       // Cinza
];

// --- COMPONENTES AUXILIARES ---

const SummaryCard = ({ title, value, icon: Icon, color, isVisible }: any) => (
  <View style={styles.summaryCard}>
    <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
      <Icon size={18} color={color} />
    </View>
    <Text style={styles.summaryLabel}>{title}</Text>
    <Text style={[styles.summaryValue, { color: color }]}>
      {isVisible ? value : '••••'}
    </Text>
  </View>
);

const LegendItem = ({ color, label }: any) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

// --- TELA PRINCIPAL ---

export default function FinanceiroScreen() {
  const [filtroAtivo, setFiltroAtivo] = useState("Ano");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [showFullReport, setShowFullReport] = useState(false);

  const opcoesFiltro = ["Dia", "Semana", "Mês", "Ano"];

  const formatMoney = (val: number) => 
    `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const toggleReport = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFullReport(!showFullReport);
  };

  const tableData = showFullReport ? DETALHAMENTO_DADOS : DETALHAMENTO_DADOS.slice(0, 4);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* 1. Header de Controles (Filtros e Visibilidade) */}
      <View style={styles.controlsHeader}>
        <View style={styles.filterContainer}>
            {opcoesFiltro.map((item) => {
                const isActive = filtroAtivo === item;
                return (
                    <TouchableOpacity 
                        key={item} 
                        onPress={() => setFiltroAtivo(item)}
                        style={[styles.filterButton, isActive && styles.filterButtonActive]}
                    >
                        <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{item}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
        <TouchableOpacity 
            style={styles.eyeButton} 
            onPress={() => setIsBalanceVisible(!isBalanceVisible)}
        >
            {isBalanceVisible ? <Eye size={20} color={COLORS.TEXT_LIGHT} /> : <EyeOff size={20} color="#9ca3af" />}
        </TouchableOpacity>
      </View>

      {/* 2. Cards de Resumo */}
      <View style={styles.summaryGrid}>
        <SummaryCard 
            title="Vendas Dia" 
            value={formatMoney(1250)} 
            icon={Calendar} 
            color={COLORS.GRAY_ICON} 
            isVisible={isBalanceVisible} 
        />
        <SummaryCard 
            title="Mês Atual" 
            value={formatMoney(12450)} 
            icon={CreditCard} 
            color={COLORS.PRIMARY} // Azul Marca
            isVisible={isBalanceVisible} 
        />
        <SummaryCard 
            title="Ano Atual" 
            value={formatMoney(79227.85)} 
            icon={Banknote} 
            color={COLORS.ACCENT} // Laranja Marca (Destaque)
            isVisible={isBalanceVisible} 
        />
      </View>

      {/* 3. Gráfico de Meios de Pagamento */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Meios de Pagamento</Text>
        <View style={styles.chartWrapper}>
             <PieChart
                data={PAYMENT_DATA}
                donut
                radius={70}
                innerRadius={45}
                textSize={10}
                showText
                textColor="white"
                fontWeight="bold"
            />
            <View style={styles.legendColumn}>
                {PAYMENT_DATA.map((item, index) => (
                    <LegendItem key={index} color={item.color} label={item.label} />
                ))}
            </View>
        </View>
      </View>

      {/* 4. Detalhamento Financeiro (Tabela) */}
      <View style={[styles.card, { marginBottom: 40 }]}>
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Detalhamento Financeiro</Text>
            <TouchableOpacity onPress={toggleReport} style={styles.expandButton}>
                <Text style={styles.expandText}>{showFullReport ? "Recolher" : "Ver Tudo"}</Text>
                {showFullReport ? <ChevronUp size={14} color={COLORS.PRIMARY} /> : <ChevronDown size={14} color={COLORS.PRIMARY} />}
            </TouchableOpacity>
        </View>
        
        {/* Cabeçalho Tabela */}
        <View style={styles.tableHeader}>
            <Text style={[styles.colText, { flex: 0.8 }]}>MÊS</Text>
            <Text style={[styles.colText, { textAlign: 'right' }]}>REC.</Text>
            <Text style={[styles.colText, { textAlign: 'right' }]}>DESP.</Text>
            <Text style={[styles.colText, { textAlign: 'right', flex: 1.2 }]}>SALDO</Text>
        </View>

        {/* Linhas */}
        {tableData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
                <Text style={[styles.cellText, { flex: 0.8, color: COLORS.TEXT_LIGHT }]}>{item.mes}</Text>
                
                <Text style={[styles.cellText, { textAlign: 'right', color: COLORS.SUCCESS }]}>
                    {isBalanceVisible ? formatMoney(item.receitas).replace('R$', '') : '•••'}
                </Text>
                
                <Text style={[styles.cellText, { textAlign: 'right', color: COLORS.DANGER }]}>
                    {isBalanceVisible ? formatMoney(item.despesas).replace('R$', '') : '•••'}
                </Text>
                
                <View style={[styles.saldoBadge, { alignSelf: 'flex-end' }]}>
                    <Text style={[styles.cellText, { color: COLORS.PRIMARY, fontWeight: '700' }]}>
                        {isBalanceVisible ? formatMoney(item.saldo).replace('R$', '') : '•••'}
                    </Text>
                </View>
            </View>
        ))}

        {/* Rodapé Total */}
        <View style={styles.tableFooter}>
            <Text style={styles.footerLabel}>TOTAL ACUMULADO</Text>
            <Text style={styles.footerValue}>
                {isBalanceVisible ? formatMoney(426000) : '••••••••'}
            </Text>
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
    padding: 16,
    paddingBottom: 40,
  },
  
  // Header Controls
  controlsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: COLORS.PRIMARY, // Azul Marca
  },
  filterText: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.WHITE,
    fontWeight: '700',
  },
  eyeButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  // Summary Cards
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    width: '31%',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },

  // Generic Card
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_DARK,
    marginBottom: 12,
  },
  
  // Pie Chart
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  legendColumn: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },

  // Table
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  expandText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  colText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },
  cellText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
  },
  saldoBadge: {
    flex: 1.2, 
    alignItems: 'flex-end'
  },
  tableFooter: {
    marginTop: 12,
    backgroundColor: '#eff6ff', // Azul bem claro
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
});