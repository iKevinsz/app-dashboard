import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  Keyboard,
  Dimensions,
  Animated,
  TouchableWithoutFeedback
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient"; 
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Paleta de Cores
const COLORS = {
  PRIMARY_BLUE: '#023151',
  ACCENT_ORANGE: '#FF6600',
  WHITE: '#FFFFFF',
  GRAY_BG: '#F3F4F6',
  GRAY_TEXT: '#9CA3AF',
  SUCCESS_GREEN: '#10B981'
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<boolean>(false);

  // Animações
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = () => {
    Keyboard.dismiss();
    setError('');
    
    if (!email) {
      setError('Por favor, digite seu e-mail.');
      return;
    }

    // Simulação de envio
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 2000);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: COLORS.PRIMARY_BLUE }}>
        <StatusBar style="light" />
        
        {/* BACKGROUND PADRÃO */}
        <View className="absolute inset-0 w-full h-full">
          <LinearGradient
              colors={[COLORS.PRIMARY_BLUE, '#011d30']} 
              style={{ flex: 1 }}
          />
          <View className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full opacity-5 blur-3xl" />
          <View className="absolute top-1/4 -right-32 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: COLORS.ACCENT_ORANGE }} />
        </View>

        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView 
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled" 
              showsVerticalScrollIndicator={false}
            >
              
              {/* HEADER COM BOTÃO VOLTAR */}
              <Animated.View 
                style={{ 
                  opacity: fadeAnim, 
                  transform: [{ translateY: slideAnim }],
                  paddingHorizontal: 24,
                  paddingTop: 20,
                  paddingBottom: 20
                }}
              >
                  <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={{ 
                      width: 40, height: 40, 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: 12, 
                      justifyContent: 'center', alignItems: 'center',
                      marginBottom: 20
                    }}
                  >
                    <Feather name="arrow-left" size={24} color="white" />
                  </TouchableOpacity>

                  <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.WHITE }}>
                    {step === 'form' ? 'Recuperar Acesso' : 'E-mail Enviado!'}
                  </Text>
                  <Text style={{ color: '#cbd5e1', marginTop: 8, maxWidth: 320, lineHeight: 22 }}>
                    {step === 'form' 
                      ? 'Digite o e-mail associado à sua conta para redefinir sua senha.' 
                      : `Enviamos as instruções de recuperação para: ${email}`
                    }
                  </Text>
              </Animated.View>

              {/* CARD DE CONTEÚDO */}
              <Animated.View 
                style={{ 
                  opacity: fadeAnim, 
                  transform: [{ translateY: slideAnim }],
                  backgroundColor: COLORS.WHITE,
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40,
                  paddingHorizontal: 32,
                  paddingTop: 40,
                  paddingBottom: 40,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: -2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                  elevation: 10,
                  flex: 1 // Ocupa o resto da tela
                }}
              >
                
                {/* ÍCONE DE STATUS */}
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                   <View style={{ 
                      width: 80, height: 80, 
                      borderRadius: 40, 
                      backgroundColor: step === 'form' ? '#eff6ff' : '#ecfdf5', 
                      justifyContent: 'center', alignItems: 'center',
                      marginBottom: 16
                   }}>
                      {step === 'form' ? (
                        <Feather name="lock" size={32} color={COLORS.PRIMARY_BLUE} />
                      ) : (
                        <Feather name="check" size={32} color={COLORS.SUCCESS_GREEN} />
                      )}
                   </View>
                </View>

                {step === 'form' ? (
                  // --- FORMULÁRIO DE RECUPERAÇÃO ---
                  <View>
                    <View style={{ marginBottom: 24 }}>
                      <Text style={styles.label}>E-mail Cadastrado</Text>
                      <View 
                        style={[
                          styles.inputContainer, 
                          { 
                            borderColor: error ? '#EF4444' : (focusedField ? COLORS.PRIMARY_BLUE : 'transparent'),
                            borderWidth: 1
                          }
                        ]}
                      >
                        <Feather name="mail" size={20} color={error ? '#EF4444' : (focusedField ? COLORS.PRIMARY_BLUE : COLORS.GRAY_TEXT)} />
                        <TextInput
                          style={styles.input}
                          placeholder="ex: admin@datacaixa.com"
                          placeholderTextColor={COLORS.GRAY_TEXT}
                          value={email}
                          onChangeText={setEmail}
                          autoCapitalize="none"
                          keyboardType="email-address"
                          onFocus={() => setFocusedField(true)}
                          onBlur={() => setFocusedField(false)}
                        />
                      </View>
                      
                      {/* Mensagem de Erro */}
                      {error ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                           <Feather name="alert-circle" size={14} color="#EF4444" />
                           <Text style={{ color: '#EF4444', fontSize: 12, marginLeft: 6, fontWeight: '500' }}>
                             {error}
                           </Text>
                        </View>
                      ) : null}
                    </View>

                    {/* BOTÃO ENVIAR (LARANJA) */}
                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={isLoading}
                      activeOpacity={0.8}
                      style={styles.button}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <>
                          <Text style={styles.buttonText}>Enviar Link</Text>
                          <Feather name="send" size={20} color="white" />
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  // --- TELA DE SUCESSO ---
                  <View style={{ gap: 16 }}>
                    <View style={{ backgroundColor: '#eff6ff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#dbeafe' }}>
                       <Text style={{ color: COLORS.PRIMARY_BLUE, textAlign: 'center', fontSize: 14 }}>
                         Não recebeu o e-mail? Verifique sua caixa de <Text style={{ fontWeight: 'bold' }}>Spam</Text> ou <Text style={{ fontWeight: 'bold' }}>Lixo Eletrônico</Text>.
                       </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => { setStep('form'); setEmail(''); setError(''); }}
                      style={[styles.button, { backgroundColor: COLORS.GRAY_BG, shadowOpacity: 0 }]}
                    >
                       <Text style={[styles.buttonText, { color: '#4b5563' }]}>Tentar outro e-mail</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => router.replace("/")} // Volta para Login
                      style={[styles.button, { marginTop: 8 }]}
                    >
                       <Text style={styles.buttonText}>Voltar para o Login</Text>
                    </TouchableOpacity>
                  </View>
                )}

              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Estilos
const styles = {
  label: {
    fontSize: 12, 
    fontWeight: '700' as '700', 
    color: '#64748b', 
    marginBottom: 8, 
    textTransform: 'uppercase' as 'uppercase'
  },
  inputContainer: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    height: 56,
    backgroundColor: COLORS.GRAY_BG,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#334155'
  },
  button: {
    height: 56,
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderRadius: 16,
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    shadowColor: COLORS.ACCENT_ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white', 
    fontWeight: 'bold' as 'bold', 
    fontSize: 16, 
    marginRight: 8
  }
};