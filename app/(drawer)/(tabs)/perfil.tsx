import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  CreditCard, 
  Bell 
} from 'lucide-react-native';

// 1. MANTENHA APENAS O IMPORT (Verifique se o caminho ../../../ está correto para sua pasta)
import { useTheme } from '../../../src/context/ThemeContext'; 


export default function ProfileScreen() {
  const router = useRouter();

  // 2. Agora ele vai pegar do arquivo ThemeContext corretamente
  const { colors } = useTheme(); 

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive", 
          onPress: () => router.replace('/') 
        }
      ]
    );
  };

  const MenuOption = ({ icon: Icon, label, subtitle, isDestructive = false, onPress }: any) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      activeOpacity={0.7}
      onPress={onPress ? onPress : (isDestructive ? handleLogout : () => {})}
    >
      <View style={[
        styles.iconBox, 
        { backgroundColor: isDestructive ? colors.DANGER + '15' : colors.PRIMARY + '15' } 
      ]}>
        <Icon size={20} color={isDestructive ? colors.DANGER : colors.PRIMARY} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={[
            styles.menuTitle, 
            { color: colors.TEXT_DARK }, 
            isDestructive && { color: colors.DANGER }
        ]}>
            {label}
        </Text>
        {subtitle && <Text style={[styles.menuSubtitle, { color: colors.TEXT_LIGHT }]}>{subtitle}</Text>}
      </View>
      {!isDestructive && <ChevronRight size={18} color={colors.TEXT_LIGHT} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView 
        style={[styles.container, { backgroundColor: colors.BG }]} 
        contentContainerStyle={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
    >
      
      {/* Cabeçalho do Perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.PRIMARY, borderColor: colors.BG }]}>
             <User size={40} color={colors.WHITE} />
          </View>
          <View style={[styles.onlineBadge, { borderColor: colors.BG }]} />
        </View>
        <Text style={[styles.userName, { color: colors.TEXT_DARK }]}>KEVIN-TESTE</Text>
        <Text style={[styles.userRole, { color: colors.TEXT_LIGHT }]}>CNPJ: 14.356.429/0001-20</Text>
      </View>

      {/* Seção 1: Conta */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.TEXT_LIGHT }]}>Minha Conta</Text>
        <View style={[styles.card, { backgroundColor: colors.CARD_BG, borderColor: colors.BORDER }]}>
          <MenuOption 
            icon={User} 
            label="Dados da Empresa" 
            subtitle="CNPJ, Endereço e Logo" 
            onPress={() => router.push('/empresa-info')}
          />
          <View style={[styles.separator, { backgroundColor: colors.BORDER }]} />
          <MenuOption 
            icon={CreditCard} 
            label="Assinatura e Faturas" 
            subtitle="Gerenciar pagamentos" 
            onPress={() => router.push('/faturas')}
          />
        </View>
      </View>

      {/* Seção 2: App */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.TEXT_LIGHT }]}>Aplicativo</Text>
        <View style={[styles.card, { backgroundColor: colors.CARD_BG, borderColor: colors.BORDER }]}>
          <MenuOption 
            icon={Bell} 
            label="Notificações" 
            subtitle="Alertas de vendas e estoque" 
            onPress={() => router.push('/notificacao')} 
          />
          <View style={[styles.separator, { backgroundColor: colors.BORDER }]} />
          <MenuOption 
            icon={Settings} 
            label="Configurações Gerais" 
            subtitle="Impressoras e Preferências" 
            onPress={() => router.push('/ajustes')}
          />
          <View style={[styles.separator, { backgroundColor: colors.BORDER }]} />
          <MenuOption 
            icon={HelpCircle} 
            label="Suporte e Ajuda" 
            subtitle="Fale com nosso time" 
            onPress={() => router.push('/suporte')}
          />
        </View>
      </View>

      {/* Botão Sair */}
      <View style={styles.section}>
        <View style={[styles.card, { backgroundColor: colors.CARD_BG, borderColor: colors.BORDER }]}>
          <MenuOption 
            icon={LogOut} 
            label="Sair do Aplicativo" 
            isDestructive 
          />
        </View>
      </View>

      <Text style={[styles.versionText, { color: colors.TEXT_LIGHT }]}>Versão 1.0.4 (Build 2024)</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    backgroundColor: '#10B981',
    borderRadius: 11,
    borderWidth: 3,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    height: 1,
    marginLeft: 72, 
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 20,
    fontWeight: '500',
  }
});