import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  MessageCircle, 
  ExternalLink, 
  BookOpen, 
  Youtube,
  Clock // Importei o ícone de relógio
} from 'lucide-react-native';

const COLORS = {
  PRIMARY: '#023151',
  ACCENT: '#FF6600',
  WHITE: '#FFFFFF',
  BG: '#F9FAFB',
  TEXT_DARK: '#111827',
  TEXT_LIGHT: '#6B7280',
  BORDER: '#E5E7EB',
};

export default function SupportScreen() {
  const router = useRouter();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Erro ao abrir link", err));
  };

  const ContactCard = ({ icon: Icon, title, subtitle, action, color = COLORS.PRIMARY }: any) => (
    <TouchableOpacity style={styles.contactCard} onPress={action} activeOpacity={0.8}>
      <View style={[styles.contactIcon, { backgroundColor: color + '15' }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <ExternalLink size={18} color={COLORS.TEXT_LIGHT} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suporte e Ajuda</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Como podemos ajudar?</Text>
          <Text style={styles.bannerText}>Nossa equipe e materiais estão disponíveis para auxiliar no seu negócio.</Text>
        </View>

        <Text style={styles.sectionTitle}>Canais e Materiais</Text>
        
        <View style={styles.cardContainer}>
          {/* 1. WhatsApp */}
          <ContactCard 
            icon={MessageCircle} 
            title="WhatsApp Suporte" 
            subtitle="Fale com um atendente agora" 
            color="#25D366" 
            action={() => openLink('https://wa.me/5511999999999')} 
          />
          
          {/* 2. Central de Ajuda */}
          <ContactCard 
            icon={BookOpen} 
            title="Central de Ajuda" 
            subtitle="Manuais e artigos passo a passo" 
            color={COLORS.PRIMARY} 
            action={() => openLink('https://www.datacaixa.com.br/ajuda/')} 
          />

          {/* 3. Canal no YouTube */}
          <ContactCard 
            icon={Youtube} 
            title="Canal no YouTube" 
            subtitle="Vídeos tutoriais e treinamentos" 
            color="#FF0000" 
            action={() => openLink('https://www.youtube.com/@Datacaixa')} 
          />
        </View>

        {/* --- CARD DE HORÁRIO --- */}
        <View style={styles.hoursCard}>
          <View style={styles.hoursIconBox}>
             <Clock size={24} color={COLORS.WHITE} />
          </View>
          <View style={styles.hoursInfo}>
             <Text style={styles.hoursTitle}>Horário de Atendimento</Text>
             <Text style={styles.hoursText}>Todos os dias da semana: 08h às 22h</Text>
             <Text style={styles.hoursText}>Incluindo Sábados, Domingos e Feriados!</Text>
          </View>
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
  },
  backButton: { padding: 8, borderRadius: 12, backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.BORDER },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.PRIMARY },
  content: { padding: 20, paddingBottom: 40 },
  
  banner: { backgroundColor: COLORS.WHITE, padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.BORDER },
  bannerTitle: { color: COLORS.PRIMARY, fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  bannerText: { color: COLORS.TEXT_LIGHT, fontSize: 14, lineHeight: 20 },

  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.TEXT_LIGHT, textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
  
  cardContainer: { gap: 12, marginBottom: 24 },
  contactCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE,
    padding: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.BORDER,
  },
  contactIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_DARK },
  contactSubtitle: { fontSize: 12, color: COLORS.TEXT_LIGHT, marginTop: 2 },

  // Estilos do Card de Horário (Azul)
  hoursCard: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  hoursIconBox: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  hoursInfo: {
    flex: 1,
  },
  hoursTitle: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hoursText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    marginBottom: 2,
  }
});