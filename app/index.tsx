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

const { width } = Dimensions.get("window");

// Paleta de Cores Definida
const COLORS = {
  PRIMARY_BLUE: '#023151',
  ACCENT_ORANGE: '#FF6600',
  WHITE: '#FFFFFF',
  GRAY_BG: '#F3F4F6',
  GRAY_TEXT: '#9CA3AF'
};

const loginUser = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1500);
  });
};

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert("Campos vazios", "Por favor, preencha seu e-mail e senha.");
      return;
    }

    setIsLoading(true);
    try {
      const result: any = await loginUser({ email, password });
      if (result.success) {
        router.replace("/home"); 
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao realizar login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Wrapper para fechar o teclado ao clicar fora
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: COLORS.PRIMARY_BLUE }}>
        <StatusBar style="light" />
        
        {/* FUNDO COM A COR #023151 E DETALHES VISUAIS */}
        <View className="absolute inset-0 w-full h-full">
          <LinearGradient
              // Gradiente sutil usando a cor base pedida
              colors={[COLORS.PRIMARY_BLUE, '#011d30']} 
              style={{ flex: 1 }}
          />
          {/* Decoração de fundo (Circles) */}
          <View className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full opacity-5 blur-3xl" />
          <View className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: COLORS.ACCENT_ORANGE }} />
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
              
              {/* ÁREA SUPERIOR: LOGO */}
              <Animated.View 
                style={{ 
                  
                  opacity: fadeAnim, 
                  transform: [{ translateY: slideAnim }],
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 40
                }}
              >
                  <View 
                    style={{ 
                      width: 100, 
                      height: 100, 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: 24, 
                      borderWidth: 1, 
                      borderColor: 'rgba(255,255,255,0.2)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 20
                    }}
                  >
                      <Feather name="box" size={48} color={COLORS.WHITE} />
                  </View>

                  <Text style={{ fontSize: 36, fontWeight: '800', color: COLORS.WHITE }}>
                    Datacaixa<Text style={{ color: COLORS.ACCENT_ORANGE }}>.</Text>
                  </Text>
                  <Text style={{ color: '#cbd5e1', marginTop: 8, textAlign: 'center', maxWidth: 280 }}>
                    Gestão inteligente para o seu negócio.
                  </Text>
              </Animated.View>

              {/* CARD DE LOGIN (BRANCO) */}
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
                  elevation: 10
                }}
              >
                <View style={{ marginBottom: 30 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.PRIMARY_BLUE }}>
                    Bem-vindo de volta!
                  </Text>
                  <View style={{ width: 40, height: 4, backgroundColor: COLORS.ACCENT_ORANGE, marginTop: 8, borderRadius: 2 }} />
                </View>

                {/* INPUT E-MAIL */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>
                    E-mail
                  </Text>
                  <View 
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: 56,
                      backgroundColor: COLORS.GRAY_BG,
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      borderColor: focusedField === 'email' ? COLORS.PRIMARY_BLUE : 'transparent'
                    }}
                  >
                    <Feather 
                      name="mail" 
                      size={20} 
                      color={focusedField === 'email' ? COLORS.PRIMARY_BLUE : COLORS.GRAY_TEXT} 
                    />
                    <TextInput
                      style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#334155' }}
                      placeholder="ex: admin@datacaixa.com"
                      placeholderTextColor={COLORS.GRAY_TEXT}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>

                {/* INPUT SENHA */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>
                    Senha
                  </Text>
                  <View 
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: 56,
                      backgroundColor: COLORS.GRAY_BG,
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      borderColor: focusedField === 'password' ? COLORS.PRIMARY_BLUE : 'transparent'
                    }}
                  >
                    <Feather 
                      name="lock" 
                      size={20} 
                      color={focusedField === 'password' ? COLORS.PRIMARY_BLUE : COLORS.GRAY_TEXT} 
                    />
                    <TextInput
                      style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#334155' }}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.GRAY_TEXT}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                      <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={COLORS.GRAY_TEXT} />
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity 
                    onPress={() => router.push("/auth/forgot-password")}
                    style={{ alignSelf: 'flex-end', marginTop: 12 }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.PRIMARY_BLUE }}>
                      Esqueceu a senha?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* BOTÃO DE AÇÃO (LARANJA #FF6600) */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  style={{
                    height: 56,
                    backgroundColor: COLORS.ACCENT_ORANGE,
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: COLORS.ACCENT_ORANGE,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                    marginBottom: 24
                  }}
                >
                   {isLoading ? (
                     <ActivityIndicator color="white" />
                   ) : (
                     <>
                       <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginRight: 8 }}>
                         Entrar
                       </Text>
                       <Feather name="arrow-right" size={22} color="white" />
                     </>
                   )}
                </TouchableOpacity>

                {/* RODAPÉ */}
                <View style={{ alignItems: 'center', paddingBottom: 20 }}>
                   <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ color: '#64748b', fontSize: 15 }}>Ainda não tem conta? </Text>
                      <TouchableOpacity onPress={() => router.push("/auth/register")}>
                         <Text style={{ color: COLORS.PRIMARY_BLUE, fontWeight: 'bold', fontSize: 15, textDecorationLine: 'underline' }}>
                           Cadastre-se
                         </Text>
                      </TouchableOpacity>
                   </View>
                   <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' }}>
                     Versão Teste
                   </Text>
                </View>

              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}