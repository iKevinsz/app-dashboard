import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert 
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FontAwesome6, Feather } from "@expo/vector-icons";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    
    // Simulação de chamada de API
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { text: "OK", onPress: () => router.push("/login") } // Volta para o login
      ]);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        
        {/* TOPO: BRANDING (Laranja para diferenciar do Login Azul) */}
        <View className="bg-orange-600 h-[35%] items-center justify-center relative overflow-hidden rounded-b-[40px]">
          <View className="absolute -top-20 -left-20 w-64 h-64 bg-orange-400 rounded-full opacity-30 blur-3xl" />
          <View className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500 rounded-full opacity-20 blur-3xl" />

          <View className="items-center z-10 p-6">
            <View className="bg-white/10 p-4 rounded-3xl mb-4 backdrop-blur-md border border-white/20">
               <FontAwesome6 name="shield-halved" size={32} color="white" />
            </View>
            <Text className="text-white text-3xl font-bold mb-2 text-center">Comece Agora</Text>
            <Text className="text-orange-100 text-center text-sm px-8">
              Junte-se a milhares de empresas que crescem com a Datacaixa.
            </Text>
          </View>
        </View>

        {/* ÁREA DE FORMULÁRIO */}
        <View className="flex-1 px-8 pt-8 pb-6 bg-white">
          
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800">Criar nova conta</Text>
            <Text className="text-gray-500 mt-1 text-sm">Preencha os dados abaixo.</Text>
          </View>

          {/* INPUT NOME */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nome Completo</Text>
            <View 
              className={`flex-row items-center border-2 rounded-xl px-4 h-12 bg-gray-50 transition-all ${
                focusedField === 'name' ? 'border-orange-500 bg-white' : 'border-gray-100'
              }`}
            >
              <Feather name="user" size={18} color={focusedField === 'name' ? '#F97316' : '#9CA3AF'} />
              <TextInput
                className="flex-1 ml-3 text-sm text-gray-800"
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* INPUT EMAIL */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">E-mail Corporativo</Text>
            <View 
              className={`flex-row items-center border-2 rounded-xl px-4 h-12 bg-gray-50 transition-all ${
                focusedField === 'email' ? 'border-orange-500 bg-white' : 'border-gray-100'
              }`}
            >
              <Feather name="mail" size={18} color={focusedField === 'email' ? '#F97316' : '#9CA3AF'} />
              <TextInput
                className="flex-1 ml-3 text-sm text-gray-800"
                placeholder="empresa@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* INPUT SENHA */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Senha</Text>
            <View 
              className={`flex-row items-center border-2 rounded-xl px-4 h-12 bg-gray-50 transition-all ${
                focusedField === 'password' ? 'border-orange-500 bg-white' : 'border-gray-100'
              }`}
            >
              <Feather name="lock" size={18} color={focusedField === 'password' ? '#F97316' : '#9CA3AF'} />
              <TextInput
                className="flex-1 ml-3 text-sm text-gray-800"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* INPUT CONFIRMAR SENHA */}
          <View className="mb-8">
            <Text className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Confirmar Senha</Text>
            <View 
              className={`flex-row items-center border-2 rounded-xl px-4 h-12 bg-gray-50 transition-all ${
                focusedField === 'confirm' ? 'border-orange-500 bg-white' : 'border-gray-100'
              }`}
            >
              <Feather name="lock" size={18} color={focusedField === 'confirm' ? '#F97316' : '#9CA3AF'} />
              <TextInput
                className="flex-1 ml-3 text-sm text-gray-800"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedField('confirm')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* BOTÃO CADASTRAR */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            className={`w-full h-14 bg-orange-600 rounded-xl flex-row items-center justify-center shadow-lg shadow-orange-200 active:bg-orange-700 ${isLoading ? 'opacity-70' : ''}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-white font-bold text-lg mr-2">Criar Conta</Text>
                <Feather name="arrow-right" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          {/* RODAPÉ */}
          <View className="mt-6 items-center space-y-4 pb-4">
            <View className="flex-row">
              <Text className="text-gray-500">Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="text-blue-600 font-bold">Fazer Login</Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-row items-center gap-2 opacity-50">
              <Feather name="check-circle" size={12} color="#10B981" />
              <Text className="text-[10px] uppercase font-bold text-gray-400">Dados Protegidos</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}