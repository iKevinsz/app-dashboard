import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Moon } from 'lucide-react-native';

// 1. IMPORTE O HOOK
import { useTheme } from '../../src/context/ThemeContext'; 

export default function AppSettingsScreen() {
  const router = useRouter();

  // 2. PEGUE AS FERRAMENTAS DO TEMA
  // isDarkMode: para saber se o switch fica ligado ou desligado
  // toggleTheme: a função que troca a cor
  // colors: as cores atuais
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const SwitchRow = ({ icon: Icon, title, subtitle, value, onValueChange }: any) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, { backgroundColor: colors.PRIMARY + '15' }]}>
          <Icon size={20} color={colors.PRIMARY} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.rowTitle, { color: colors.TEXT_DARK }]}>{title}</Text>
          {subtitle && <Text style={[styles.rowSubtitle, { color: colors.TEXT_LIGHT }]}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        trackColor={{ false: "#d1d5db", true: colors.ACCENT }}
        thumbColor={colors.WHITE}
        // AQUI ESTÁ A MÁGICA:
        value={value} 
        onValueChange={onValueChange} 
      />
    </View>
  );

  return (
    // 3. USE colors.BG NO CONTAINER PRINCIPAL
    <View style={[styles.container, { backgroundColor: colors.BG }]}>
      
      {/* Header com cores dinâmicas */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.CARD_BG, borderColor: colors.BORDER }]}>
          <ArrowLeft size={24} color={colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.PRIMARY }]}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.CARD_BG, borderColor: colors.BORDER }]}>
          
          {/* O SWITCH QUE MUDA TUDO */}
          <SwitchRow 
            icon={Moon}
            title="Modo Escuro"
            subtitle="Mudar aparência do app"
            value={isDarkMode}      // Estado do Contexto
            onValueChange={toggleTheme} // Função do Contexto
          />

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Mantenha apenas layout (flex, padding, margin, radius)
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
  },
  backButton: { padding: 8, borderRadius: 12, borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20 },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  textContainer: { flex: 1, paddingRight: 10 },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowSubtitle: { fontSize: 12, marginTop: 2 },
});