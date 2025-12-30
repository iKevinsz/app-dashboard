import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Image, 
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert 
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FontAwesome6, Feather } from "@expo/vector-icons";

// Mock de Login (Substitua pela sua lógica real)
const loginUser = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simula sucesso sempre (para teste)
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      const result: any = await loginUser({ email, password });
      if (result.success) {
        // Redireciona para o Drawer (Home)
        router.replace("/(drawer)"); 
      } else {
        Alert.alert("Erro", "Credenciais inválidas.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        
        {/* TOPO: BRANDING */}
        <View className="bg-blue-900 h-[40%] items-center justify-center relative overflow-hidden rounded-b-[40px]">
          {/* Efeitos de Fundo (Simulando os circles do CSS) */}
          <View className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl" />
          <View className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-500 rounded-full opacity-20 blur-3xl" />

          {/* Logo e Texto */}
          <View className="items-center z-10 p-6">
            <View className="bg-white/10 p-4 rounded-3xl mb-4 backdrop-blur-md border border-white/20">
               {/* Substituído FontAwesome por Image para carregar logo local */}
               <Image 
                 source={require('./assets/logo.png')} 
                 style={{ width: 80, height: 80 }} 
                 resizeMode="contain" 
               />
            </View>
            <Text className="text-white text-3xl font-bold mb-2">Datacaixa</Text>
            <Text className="text-blue-100 text-center text-sm px-8">
              Verifique suas vendas na palma da sua mão.
            </Text>
          </View>
        </View>

        {/* ÁREA DE LOGIN */}
        <View className="flex-1 px-8 pt-10 pb-6 bg-white">
          
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-800">Bem-vindo de volta!</Text>
            <Text className="text-gray-500 mt-1">Acesse sua conta para continuar.</Text>
          </View>

          {/* INPUT EMAIL */}
          <View className="mb-5">
            <Text className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">E-mail</Text>
            <View 
              className={`flex-row items-center border-2 rounded-xl px-4 h-14 bg-gray-50 transition-all ${
                focusedField === 'email' ? 'border-blue-600 bg-white' : 'border-gray-100'
              }`}
            >
              <Feather name="mail" size={20} color={focusedField === 'email' ? '#2563EB' : '#9CA3AF'} />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-800"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* INPUT SENHA */}
          <View className="mb-8">
            <View className="flex-row justify-between mb-2 ml-1">
               <Text className="text-xs font-bold text-gray-500 uppercase">Senha</Text>
               <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
                <Text className="text-xs font-bold text-blue-600">Esqueceu a senha?</Text>
               </TouchableOpacity>
            </View>
            <View 
              className={`flex-row items-center border-2 rounded-xl px-4 h-14 bg-gray-50 transition-all ${
                focusedField === 'password' ? 'border-blue-600 bg-white' : 'border-gray-100'
              }`}
            >
              <Feather name="lock" size={20} color={focusedField === 'password' ? '#2563EB' : '#9CA3AF'} />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-800"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* BOTÃO LOGIN */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`w-full h-14 bg-blue-600 rounded-xl flex-row items-center justify-center shadow-lg shadow-blue-200 active:bg-blue-700 ${isLoading ? 'opacity-70' : ''}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-white font-bold text-lg mr-2">Entrar</Text>
                <Feather name="arrow-right" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          {/* RODAPÉ */}
          <View className="mt-auto pt-8 items-center space-y-4">
            <View className="flex-row">
              <Text className="text-gray-500">Não tem conta? </Text>
                <TouchableOpacity onPress={() => router.push("/auth/register")}>
                    <Text className="text-blue-600 font-bold">Cadastre-se</Text>
                </TouchableOpacity>
            </View>
            
            <View className="flex-row items-center gap-2 opacity-50">
              <Feather name="shield" size={12} color="#10B981" />
              <Text className="text-[10px] uppercase font-bold text-gray-400">Ambiente Seguro</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}