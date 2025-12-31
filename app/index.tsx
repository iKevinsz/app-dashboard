import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, Keyboard,
  Image // 1. Importação necessária para imagens
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert("Campos vazios", "Por favor, preencha seu e-mail e senha para continuar.");
      return;
    }

    setIsLoading(true);
    try {
      const result: any = await loginUser({ email, password });
      if (result.success) {
        router.replace("/home"); 
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar entrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-blue-900">
      <StatusBar style="light" />
      
      <View pointerEvents="none" className="absolute top-0 left-0 right-0 h-[45%] overflow-hidden">
         <View className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl" />
         <View className="absolute top-20 -right-20 w-60 h-60 bg-indigo-500 rounded-full opacity-20 blur-3xl" />
      </View>

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            
            {/* CABEÇALHO COM LOGO */}
            <View className="h-[35%] justify-center items-center px-6">
                <View className="w-28 h-28 items-center justify-center mb-4">
                    {/* SUBSTITUA O CAMINHO ABAIXO PELO DA SUA LOGO */}
                    <Image 
                      source={require("../assets/images/logo.png")} 
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                </View>
                <Text className="text-white text-3xl font-bold">Datacaixa</Text>
                <Text className="text-blue-100/80 text-sm mt-2 text-center">
                  Gestão inteligente para seu negócio.
                </Text>
            </View>

            {/* CARTÃO DE LOGIN */}
            <View className="flex-1 bg-white rounded-t-[35px] px-8 pt-10 shadow-xl">
              
              <View className="mb-8">
                <Text className="text-2xl font-bold text-gray-800">Bem-vindo!</Text>
                <Text className="text-gray-500 mt-1">Insira seus dados para acessar.</Text>
              </View>

              {/* INPUT: E-MAIL */}
              <View className="mb-5">
                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">E-mail</Text>
                <View className={`flex-row items-center border rounded-xl px-4 h-14 bg-gray-50 ${focusedField === 'email' ? 'border-blue-600 bg-white' : 'border-gray-200'}`}>
                  <Feather name="mail" size={18} color={focusedField === 'email' ? "#2563EB" : "#9CA3AF"} />
                  <TextInput
                    className="flex-1 ml-3 text-base text-gray-800 h-full"
                    placeholder="seu@email.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* INPUT: SENHA */}
              <View className="mb-6">
                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Senha</Text>
                <View className={`flex-row items-center border rounded-xl px-4 h-14 bg-gray-50 ${focusedField === 'password' ? 'border-blue-600 bg-white' : 'border-gray-200'}`}>
                  <Feather name="lock" size={18} color={focusedField === 'password' ? "#2563EB" : "#9CA3AF"} />
                  <TextInput
                    className="flex-1 ml-3 text-base text-gray-800 h-full"
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                    <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => router.push("/auth/forgot-password")} className="self-end mt-3 py-1">
                  <Text className="text-sm font-bold text-blue-600">Esqueceu a senha?</Text>
                </TouchableOpacity>
              </View>

              {/* BOTÃO ENTRAR */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.7}
                className={`w-full h-14 bg-blue-600 rounded-xl flex-row items-center justify-center shadow-lg mb-8 ${isLoading ? 'opacity-70' : ''}`}
              >
                 {isLoading ? <ActivityIndicator color="white" /> : (
                    <>
                      <Text className="text-white font-bold text-lg mr-2">Entrar no Sistema</Text>
                      <Feather name="arrow-right" size={20} color="white" />
                    </>
                 )}
              </TouchableOpacity>

              <View className="mt-auto pb-6 items-center">
                 <View className="flex-row mb-4">
                    <Text className="text-gray-500">Ainda não tem conta? </Text>
                    <TouchableOpacity onPress={() => router.push("/auth/register")}>
                       <Text className="text-blue-600 font-bold">Cadastre-se</Text>
                    </TouchableOpacity>
                 </View>
                 <View className="flex-row items-center opacity-40 gap-2">
                    <Feather name="shield" size={12} color="#10B981" />
                    <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ambiente Seguro</Text>
                 </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}