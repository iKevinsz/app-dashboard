import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, DollarSign, Package, AlertTriangle } from 'lucide-react-native';

const COLORS = {
  PRIMARY: '#023151',
  ACCENT: '#FF6600',
  WHITE: '#FFFFFF',
  BG: '#F9FAFB',
  TEXT_DARK: '#111827',
  TEXT_LIGHT: '#6B7280',
  BORDER: '#E5E7EB',
};

export default function NotificationsScreen() {
  const router = useRouter();

  // Estados dos Switches
  const [salesAlert, setSalesAlert] = useState(true);
  const [paymentAlert, setPaymentAlert] = useState(true);
  const [stockAlert, setStockAlert] = useState(true);
  const [promoAlert, setPromoAlert] = useState(false);

  const NotificationRow = ({ icon: Icon, title, subtitle, value, onValueChange }: any) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.iconBox}>
          <Icon size={20} color={COLORS.PRIMARY} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: "#d1d5db", true: COLORS.ACCENT }}
        thumbColor={COLORS.WHITE}
        ios_backgroundColor="#d1d5db"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Vendas e Financeiro</Text>
        <View style={styles.card}>
          <NotificationRow 
            icon={DollarSign}
            title="Nova Venda"
            subtitle="Receber alerta a cada venda realizada"
            value={salesAlert}
            onValueChange={setSalesAlert}
          />
          <View style={styles.separator} />
          <NotificationRow 
            icon={Bell}
            title="Pagamentos Recebidos"
            subtitle="Confirmação de PIX e Cartão"
            value={paymentAlert}
            onValueChange={setPaymentAlert}
          />
        </View>

        <Text style={styles.sectionTitle}>Estoque e Loja</Text>
        <View style={styles.card}>
          <NotificationRow 
            icon={Package}
            title="Estoque Baixo"
            subtitle="Alertar quando produto atingir estoque mínimo"
            value={stockAlert}
            onValueChange={setStockAlert}
          />
          <View style={styles.separator} />
          <NotificationRow 
            icon={AlertTriangle}
            title="Novidades e Dicas"
            subtitle="Dicas de gestão para seu negócio"
            value={promoAlert}
            onValueChange={setPromoAlert}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
    backgroundColor: COLORS.BG,
  },
  backButton: { padding: 8, borderRadius: 12, backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.BORDER },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.PRIMARY },
  content: { padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.TEXT_LIGHT, textTransform: 'uppercase', marginBottom: 10, marginLeft: 4, marginTop: 10 },
  card: { backgroundColor: COLORS.WHITE, borderRadius: 16, borderWidth: 1, borderColor: COLORS.BORDER, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  textContainer: { flex: 1, paddingRight: 10 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: COLORS.TEXT_DARK },
  rowSubtitle: { fontSize: 12, color: COLORS.TEXT_LIGHT, marginTop: 2 },
  separator: { height: 1, backgroundColor: COLORS.BORDER, marginLeft: 68 },
});