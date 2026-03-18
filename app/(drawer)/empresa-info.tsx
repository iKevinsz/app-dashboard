import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Camera, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  FileText 
} from 'lucide-react-native';

// --- PALETA DE CORES ---
const COLORS = {
  PRIMARY: '#023151',    
  ACCENT: '#FF6600',     
  WHITE: '#FFFFFF',
  BG: '#F9FAFB',
  TEXT_DARK: '#111827',
  TEXT_LIGHT: '#6B7280',
  BORDER: '#E5E7EB',
  INPUT_BG: '#F3F4F6'
};

// --- COMPONENTE AUXILIAR (MOVIDO PARA FORA) ---
const FormInput = ({ label, value, icon: Icon, placeholder, onChangeText }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <View style={styles.iconContainer}>
        <Icon size={20} color={COLORS.TEXT_LIGHT} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        onChangeText={onChangeText} // Passando a função diretamente
      />
    </View>
  </View>
);

export default function CompanyDataScreen() {
  const router = useRouter();
  
  // Estados do Formulário
  const [formData, setFormData] = useState({
    razaoSocial: 'Kevin Tecnologias Ltda',
    nomeFantasia: 'Datacaixa App',
    cnpj: '14.356.429/0001-20',
    email: 'contato@datacaixa.com.br',
    telefone: '(11) 99999-8888',
    endereco: 'Av. Paulista, 1000 - Bela Vista, SP'
  });

  const handleSave = () => {
    Alert.alert("Sucesso", "Dados da empresa atualizados!");
    router.back();
  };

  // Função auxiliar para atualizar o estado
  const handleChange = (field: string, text: string) => {
    setFormData(prev => ({ ...prev, [field]: text }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados da Empresa</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Logo Upload Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Building2 size={40} color={COLORS.WHITE} />
              <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8}>
                <Camera size={16} color={COLORS.WHITE} />
              </TouchableOpacity>
            </View>
            <Text style={styles.logoText}>Toque para alterar o logo</Text>
          </View>

          {/* Formulário */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
            
            <FormInput 
              label="Razão Social" 
              value={formData.razaoSocial} 
              icon={Building2} 
              onChangeText={(text: string) => handleChange('razaoSocial', text)}
            />
            
            <FormInput 
              label="Nome Fantasia" 
              value={formData.nomeFantasia} 
              icon={FileText} 
              onChangeText={(text: string) => handleChange('nomeFantasia', text)}
            />

            <FormInput 
              label="CNPJ" 
              value={formData.cnpj} 
              icon={FileText} 
              onChangeText={(text: string) => handleChange('cnpj', text)}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Contato e Endereço</Text>
            
            <FormInput 
              label="E-mail Corporativo" 
              value={formData.email} 
              icon={Mail} 
              onChangeText={(text: string) => handleChange('email', text)}
            />

            <FormInput 
              label="Telefone / WhatsApp" 
              value={formData.telefone} 
              icon={Phone} 
              onChangeText={(text: string) => handleChange('telefone', text)}
            />

            <FormInput 
              label="Endereço Completo" 
              value={formData.endereco} 
              icon={MapPin} 
              onChangeText={(text: string) => handleChange('endereco', text)}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer com Botão Salvar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
          <Save size={20} color={COLORS.WHITE} />
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60, 
    paddingBottom: 20,
    backgroundColor: COLORS.BG,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  
  logoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: COLORS.WHITE,
    elevation: 5,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.ACCENT,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  logoText: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },

  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginBottom: 20,
  },

  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    height: 50,
  },
  iconContainer: {
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.TEXT_DARK,
    fontSize: 15,
    paddingRight: 16,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WHITE,
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 4,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  saveButtonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
});