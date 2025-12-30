import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome6, Feather } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [error, setError] = useState('');

  const handleSubmit = () => {
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        
        <View className="bg-white rounded-3xl shadow-lg shadow-gray-200 overflow-hidden">
          
          {/* TOPO / CABEÇALHO */}
          <View className="p-8 pb-0 items-center">
            <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-6">
              {step === 'form' ? (
                <Feather name="key" size={32} color="#2563EB" />
              ) : (
                <Feather name="check-circle" size={32} color="#16A34A" />
              )}
            </View>
            
            <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {step === 'form' ? 'Esqueceu a senha?' : 'Verifique seu e-mail'}
            </Text>
            
            <Text className="text-sm text-gray-500 text-center leading-6 px-4">
              {step === 'form' 
                ? 'Não se preocupe! Digite seu e-mail abaixo e enviaremos instruções para recuperar sua conta.' 
                : `Enviamos um link de recuperação para ${email}. Acesse sua caixa de entrada.`}
            </Text>
          </View>

          {/* CONTEÚDO DO FORMULÁRIO */}
          <View className="p-8 pt-6">
            {step === 'form' ? (
              <View>
                {/* Input de E-mail */}
                <View className="mb-6">
                  <Text className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                    E-mail Cadastrado
                  </Text>
                  <View 
                    className={`flex-row items-center border-2 rounded-xl px-4 h-14 bg-gray-50 ${
                      error ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <Feather name="mail" size={20} color={error ? "#EF4444" : "#9CA3AF"} />
                    <TextInput
                      className="flex-1 ml-3 text-base text-gray-800"
                      placeholder="exemplo@empresa.com"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                  {error ? (
                    <View className="flex-row items-center mt-2 ml-1">
                      <Feather name="alert-circle" size={14} color="#EF4444" />
                      <Text className="text-xs text-red-500 font-medium ml-1">{error}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Botão de Ação */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isLoading}
                  className={`w-full h-14 bg-blue-600 rounded-xl flex-row items-center justify-center shadow-lg shadow-blue-200 active:bg-blue-700 ${isLoading ? 'opacity-70' : ''}`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold text-base">Enviar Link</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              // --- ESTADO DE SUCESSO ---
              <View className="gap-4">
                <View className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <Text className="text-xs text-blue-700 font-medium text-center">
                    Não recebeu? Verifique sua caixa de spam.
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => { setStep('form'); setEmail(''); }}
                  className="w-full h-14 bg-white border border-gray-200 rounded-xl flex-row items-center justify-center active:bg-gray-50"
                >
                  <Text className="text-gray-700 font-bold text-base">Tentar outro e-mail</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* RODAPÉ / VOLTAR */}
            <View className="mt-8 items-center">
              <TouchableOpacity 
                onPress={() => router.back()} // Volta para a tela anterior (Login)
                className="flex-row items-center gap-2 p-2"
              >
                <Feather name="arrow-left" size={16} color="#9CA3AF" />
                <Text className="text-sm font-bold text-gray-400">Voltar para o Login</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
        
        {/* Footer */}
        <Text className="text-center text-xs text-gray-400 mt-8">
          &copy; 2025 Datacaixa Tecnologia.
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}