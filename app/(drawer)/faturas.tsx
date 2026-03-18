import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Modal,
  Alert,
  ActivityIndicator,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  CreditCard, 
  FileText, 
  Download, 
  Zap, 
  Calendar,
  AlertCircle,
  X,
  Smartphone,
  BarChart3,
  Star
} from 'lucide-react-native';

// --- PALETA DE CORES ---
const COLORS = {
  PRIMARY: '#023151',    
  ACCENT: '#FF6600',     
  WHITE: '#FFFFFF',
  BG: '#F3F4F6',
  TEXT_DARK: '#111827',
  TEXT_LIGHT: '#6B7280',
  BORDER: '#E5E7EB',
  SUCCESS: '#10B981',
  SUCCESS_BG: '#ECFDF5',
  WARNING: '#F59E0B',
  WARNING_BG: '#FFFBEB',
  OVERLAY: 'rgba(0,0,0,0.6)',
  INPUT_BG: '#F9FAFB'
};

const INVOICES = [
  { id: '1', date: '10 Jan 2026', amount: 'R$ 149,90', status: 'Pago', pdf: true },
  { id: '2', date: '10 Dez 2025', amount: 'R$ 149,90', status: 'Pago', pdf: true },
  { id: '3', date: '10 Nov 2025', amount: 'R$ 149,90', status: 'Pago', pdf: true },
];

// --- CORREÇÃO: IDs ÚNICOS PARA EVITAR O ERRO DE CHAVE DUPLICADA ---
const PLAN_OPTIONS = [
  {
    id: 'combo_trimestral', 
    name: 'Combo: Gestão + PDV (3 Meses)',
    price: 'R$ 369,90',
    description: 'A solução completa. Frente de caixa e retaguarda integrada com desconto.',
    icon: <Star size={24} color={COLORS.ACCENT} fill={COLORS.ACCENT} />,
    recommended: true
  },
  {
    id: 'gestao_trimestral', 
    name: 'Datacaixa Gestão (3 Meses)',
    price: 'R$ 319,90',
    description: 'Controle financeiro, estoque, NFe e relatórios.',
    icon: <BarChart3 size={24} color={COLORS.PRIMARY} />,
    recommended: false
  },
  {
    id: 'pdv_trimestral',
    name: 'Datacaixa PDV (3 Meses)',
    price: 'R$ 239,00',
    description: 'Frente de caixa ágil e emissão de NFC-e.',
    icon: <Smartphone size={24} color={COLORS.PRIMARY} />,
    recommended: false
  }
];

export default function SubscriptionScreen() {
  const router = useRouter();
  
  // Estados
  const [currentPlan, setCurrentPlan] = useState(PLAN_OPTIONS[1]); 
  const [cardLast4, setCardLast4] = useState("8842");
  
  // Modais e Loadings
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(PLAN_OPTIONS[1].id);

  // Estados do Formulário de Cartão
  const [newCardName, setNewCardName] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');

  // --- MÁSCARAS DE INPUT ---
  const handleCardNumberChange = (text: string) => {
    // Remove tudo que não é número
    const cleaned = text.replace(/\D/g, '');
    // Adiciona espaço a cada 4 dígitos
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    
    if (cleaned.length <= 16) {
        setNewCardNumber(formatted);
    }
  };

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
        setNewCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
        setNewCardExpiry(cleaned);
    }
  };

  const handleDownloadInvoice = (id: string) => {
    Alert.alert("Download", `Baixando fatura #${id}...`);
  };

  const handleConfirmChangePlan = () => {
    const newPlan = PLAN_OPTIONS.find(p => p.id === selectedPlanId);
    if (!newPlan) return;

    setPlanModalVisible(false);
    setIsLoading(true);

    setTimeout(() => {
      setCurrentPlan(newPlan);
      setIsLoading(false);
      Alert.alert("Sucesso", `Plano alterado para: ${newPlan.name}`);
    }, 1500);
  };

  const handleSaveNewCard = () => {
    const cleanNumber = newCardNumber.replace(/\s/g, '');
    if(cleanNumber.length < 16) {
        Alert.alert("Erro", "Número de cartão inválido");
        return;
    }
    setCardModalVisible(false);
    setIsLoading(true);
    
    setTimeout(() => {
        setCardLast4(cleanNumber.slice(-4));
        setIsLoading(false);
        setNewCardNumber('');
        setNewCardName('');
        setNewCardExpiry('');
        Alert.alert("Cartão Atualizado", "Sua forma de pagamento foi alterada com sucesso.");
    }, 1500);
  };

  const InvoiceItem = ({ item }: any) => (
    <View style={styles.invoiceItem}>
      <View style={styles.invoiceIcon}>
        <FileText size={20} color={COLORS.PRIMARY} />
      </View>
      <View style={styles.invoiceInfo}>
        <Text style={styles.invoiceDate}>{item.date}</Text>
        <Text style={styles.invoiceAmount}>{item.amount}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: COLORS.SUCCESS_BG }]}>
        <Text style={[styles.statusText, { color: COLORS.SUCCESS }]}>{item.status}</Text>
      </View>
      {item.pdf && (
        <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownloadInvoice(item.id)}>
          <Download size={20} color={COLORS.TEXT_LIGHT} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.ACCENT} />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assinatura</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Card do Plano Atual */}
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={{flex: 1, marginRight: 10}}>
              <Text style={styles.planLabel}>SEU PLANO ATUAL</Text>
              <Text style={styles.planName} numberOfLines={2}>{currentPlan.name}</Text>
            </View>
            <View style={styles.planIcon}>
               <Zap size={24} color={COLORS.WHITE} fill={COLORS.WHITE} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.planDetails}>
             <View style={styles.detailItem}>
                <Calendar size={18} color={COLORS.WHITE} style={{ opacity: 0.8 }} />
                <Text style={styles.detailText}>Renova em: <Text style={{fontWeight: 'bold'}}>10/02/2026</Text></Text>
             </View>
          </View>
          <Text style={styles.planPrice}>{currentPlan.price}<Text style={styles.period}>/ciclo</Text></Text>

          <TouchableOpacity 
            style={styles.upgradeButton} 
            activeOpacity={0.9}
            onPress={() => {
              setSelectedPlanId(currentPlan.id);
              setPlanModalVisible(true);
            }}
          >
             <Text style={styles.upgradeText}>Alterar ou Renovar Plano</Text>
          </TouchableOpacity>
        </View>

        {/* Método de Pagamento */}
        <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
        <View style={styles.card}>
           <View style={styles.paymentRow}>
              <View style={styles.cardIconBox}>
                 <CreditCard size={24} color={COLORS.PRIMARY} />
              </View>
              <View style={{ flex: 1, paddingHorizontal: 10 }}>
                 <Text style={styles.cardBrand} numberOfLines={1}>Mastercard •••• {cardLast4}</Text>
                 <Text style={styles.cardExpiry}>Expira em 12/28</Text>
              </View>
              <TouchableOpacity onPress={() => setCardModalVisible(true)} style={styles.editBtn}>
                 <Text style={styles.editLink}>Trocar</Text>
              </TouchableOpacity>
           </View>
        </View>

        {/* Histórico */}
        <Text style={styles.sectionTitle}>Histórico Recente</Text>
        <View style={styles.invoicesCard}>
           {INVOICES.map((invoice, index) => (
             <View key={invoice.id}>
                <InvoiceItem item={invoice} />
                {index < INVOICES.length - 1 && <View style={styles.separator} />}
             </View>
           ))}
        </View>

        <View style={styles.noteContainer}>
           <AlertCircle size={16} color={COLORS.TEXT_LIGHT} />
           <Text style={styles.noteText}>
             Dúvidas sobre cobrança? Fale com nosso financeiro.
           </Text>
        </View>
      </ScrollView>

      {/* --- MODAL DE ALTERAÇÃO DE PLANO --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={planModalVisible}
        onRequestClose={() => setPlanModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackdrop} onPress={() => setPlanModalVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha seu Plano</Text>
              <TouchableOpacity onPress={() => setPlanModalVisible(false)} style={styles.closeBtn}>
                <X size={20} color={COLORS.TEXT_DARK} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{maxHeight: 400}} showsVerticalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {PLAN_OPTIONS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const isRecommended = plan.recommended;

                  return (
                    <Pressable 
                      key={plan.id} 
                      style={[
                        styles.optionCard, 
                        isSelected && styles.optionCardSelected,
                        isRecommended && styles.optionCardRecommended
                      ]}
                      onPress={() => setSelectedPlanId(plan.id)}
                    >
                      {isRecommended && (
                        <View style={styles.recommendedBadge}>
                            <Text style={styles.recommendedText}>Melhor Escolha</Text>
                        </View>
                      )}

                      <View style={styles.optionHeader}>
                        <View style={[styles.optionIconContainer, isRecommended && {backgroundColor: '#FFF0E6'}]}>
                          {plan.icon}
                        </View>
                        <View style={{flex: 1}}>
                           <Text style={[styles.optionName, isRecommended && {color: COLORS.ACCENT}]}>
                                {plan.name}
                           </Text>
                           <Text style={styles.optionPrice}>{plan.price}</Text>
                        </View>
                        <View style={[styles.radioContainer, isSelected && {borderColor: COLORS.ACCENT}]}>
                          {isSelected && <View style={styles.radioInner} />}
                        </View>
                      </View>
                      <Text style={styles.optionDesc}>{plan.description}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmChangePlan}>
              <Text style={styles.confirmButtonText}>Confirmar Plano</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL DE TROCA DE CARTÃO --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={cardModalVisible}
        onRequestClose={() => setCardModalVisible(false)}
      >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <TouchableWithoutFeedback onPress={() => setCardModalVisible(false)}>
                <View style={styles.modalBackdrop} />
            </TouchableWithoutFeedback>
            
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Novo Cartão</Text>
                    <TouchableOpacity onPress={() => setCardModalVisible(false)} style={styles.closeBtn}>
                        <X size={20} color={COLORS.TEXT_DARK} />
                    </TouchableOpacity>
                </View>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <View style={styles.formContainer}>
                            <Text style={styles.inputLabel}>Número do Cartão</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="0000 0000 0000 0000"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                                maxLength={19} // 16 digitos + 3 espaços
                                value={newCardNumber}
                                onChangeText={handleCardNumberChange}
                            />

                            <View style={styles.rowInputs}>
                                <View style={{flex: 1, marginRight: 10}}>
                                    <Text style={styles.inputLabel}>Validade</Text>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="MM/AA"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="numeric"
                                        maxLength={5}
                                        value={newCardExpiry}
                                        onChangeText={handleExpiryChange}
                                    />
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.inputLabel}>CVV</Text>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="123"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="numeric"
                                        maxLength={3}
                                    />
                                </View>
                            </View>

                            <Text style={styles.inputLabel}>Nome no Cartão</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="COMO ESTA NO CARTAO"
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="characters"
                                value={newCardName}
                                onChangeText={setNewCardName}
                            />
                        </View>

                        <TouchableOpacity style={styles.confirmButton} onPress={handleSaveNewCard}>
                            <Text style={styles.confirmButtonText}>Salvar Cartão</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </View>
          </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 10,
    marginTop: 24,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // PLAN CARD (Main)
  planCard: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  planName: {
    color: COLORS.WHITE,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  planIcon: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  planDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  planPrice: {
    color: COLORS.WHITE,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  period: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
  },
  upgradeButton: {
    backgroundColor: COLORS.ACCENT,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2}
  },
  upgradeText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },

  // PAYMENT METHOD
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    flexWrap: 'wrap', 
  },
  cardExpiry: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },
  editBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  editLink: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
    fontSize: 13,
  },

  // INVOICES
  invoicesCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: 'hidden',
  },
  invoiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  invoiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceDate: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  invoiceAmount: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  downloadBtn: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginLeft: 68,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
    paddingHorizontal: 20,
    opacity: 0.7
  },
  noteText: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
  },

  // MODAL COMMON
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.TEXT_DARK,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  
  // OPTIONS
  optionsContainer: {
    gap: 16,
    marginBottom: 20,
    paddingTop: 10, 
  },
  optionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    position: 'relative',
  },
  optionCardSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: '#F0F9FF',
    borderWidth: 2,
  },
  optionCardRecommended: {
    borderColor: COLORS.ACCENT,
    borderWidth: 2,
    backgroundColor: '#FFFBF5',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  recommendedText: {
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  optionIconContainer: {
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_DARK,
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  optionPrice: {
    fontSize: 15,
    color: COLORS.TEXT_DARK,
    fontWeight: '500',
  },
  optionDesc: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 18,
    marginTop: 4,
  },
  radioContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.ACCENT,
  },
  confirmButton: {
    backgroundColor: COLORS.ACCENT,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // FORM INPUTS
  formContainer: {
      gap: 16,
      marginBottom: 20,
  },
  inputLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: COLORS.TEXT_LIGHT,
      marginBottom: 6,
      textTransform: 'uppercase',
  },
  input: {
      backgroundColor: COLORS.INPUT_BG,
      borderWidth: 1,
      borderColor: COLORS.BORDER,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: COLORS.TEXT_DARK,
  },
  rowInputs: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  }
});