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
  GRAY_TEXT: '#9CA3AF'
};

export default function RegisterScreen() {
  const router = useRouter();
  
  // Estados do Formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const handleRegister = async () => {
    Keyboard.dismiss();
    
    // Validação básica
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    
    // Simulação de API
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { text: "Fazer Login", onPress: () => router.replace("/") } // Volta para Login
      ]);
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
                  paddingBottom: 30
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

                  <Text style={{ fontSize: 32, fontWeight: '800', color: COLORS.WHITE }}>
                    Criar Conta
                  </Text>
                  <Text style={{ color: '#cbd5e1', marginTop: 8, maxWidth: 300 }}>
                    Junte-se à Datacaixa e transforme a gestão do seu negócio.
                  </Text>
              </Animated.View>

              {/* CARD DO FORMULÁRIO */}
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
                  flex: 1 // Ocupa o resto da tela visualmente
                }}
              >
                
                {/* 1. NOME */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.label}>Nome Completo</Text>
                  <View style={[styles.inputContainer, { borderColor: focusedField === 'name' ? COLORS.PRIMARY_BLUE : 'transparent' }]}>
                    <Feather name="user" size={20} color={focusedField === 'name' ? COLORS.PRIMARY_BLUE : COLORS.GRAY_TEXT} />
                    <TextInput
                      style={styles.input}
                      placeholder="Seu nome"
                      placeholderTextColor={COLORS.GRAY_TEXT}
                      value={name}
                      onChangeText={setName}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>

                {/* 2. EMAIL */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.label}>E-mail Corporativo</Text>
                  <View style={[styles.inputContainer, { borderColor: focusedField === 'email' ? COLORS.PRIMARY_BLUE : 'transparent' }]}>
                    <Feather name="mail" size={20} color={focusedField === 'email' ? COLORS.PRIMARY_BLUE : COLORS.GRAY_TEXT} />
                    <TextInput
                      style={styles.input}
                      placeholder="empresa@email.com"
                      placeholderTextColor={COLORS.GRAY_TEXT}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>

                {/* 3. SENHA */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.label}>Senha</Text>
                  <View style={[styles.inputContainer, { borderColor: focusedField === 'password' ? COLORS.PRIMARY_BLUE : 'transparent' }]}>
                    <Feather name="lock" size={20} color={focusedField === 'password' ? COLORS.PRIMARY_BLUE : COLORS.GRAY_TEXT} />
                    <TextInput
                      style={styles.input}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor={COLORS.GRAY_TEXT}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                      <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={COLORS.GRAY_TEXT} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 4. CONFIRMAR SENHA */}
                <View style={{ marginBottom: 32 }}>
                  <Text style={styles.label}>Confirmar Senha</Text>
                  <View style={[styles.inputContainer, { borderColor: focusedField === 'confirm' ? COLORS.PRIMARY_BLUE : 'transparent' }]}>
                    <Feather name="check-circle" size={20} color={focusedField === 'confirm' ? COLORS.PRIMARY_BLUE : COLORS.GRAY_TEXT} />
                    <TextInput
                      style={styles.input}
                      placeholder="Repita a senha"
                      placeholderTextColor={COLORS.GRAY_TEXT}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocusedField('confirm')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>

                {/* BOTÃO CADASTRAR (LARANJA) */}
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  style={styles.button}
                >
                   {isLoading ? (
                     <ActivityIndicator color="white" />
                   ) : (
                     <>
                       <Text style={styles.buttonText}>Cadastrar</Text>
                       <Feather name="arrow-right" size={22} color="white" />
                     </>
                   )}
                </TouchableOpacity>

                {/* LOGIN LINK */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, paddingBottom: 20 }}>
                   <Text style={{ color: '#64748b', fontSize: 15 }}>Já tem uma conta? </Text>
                   <TouchableOpacity onPress={() => router.back()}>
                      <Text style={{ color: COLORS.PRIMARY_BLUE, fontWeight: 'bold', fontSize: 15, textDecorationLine: 'underline' }}>
                        Fazer Login
                      </Text>
                   </TouchableOpacity>
                </View>

              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Estilos extraídos para organização
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
    borderWidth: 1,
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
    fontSize: 18, 
    marginRight: 8
  }
};