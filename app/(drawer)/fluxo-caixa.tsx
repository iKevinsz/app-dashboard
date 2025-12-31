import React, { useState, useMemo } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, TextInput, 
  Modal, FlatList, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- TIPAGEM ---
interface Transacao {
  id: number | string;
  descricao: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  data: string;
  status: 'confirmado' | 'pendente';
}

// --- DADOS INICIAIS (MOCK) ---
const INITIAL_TRANSACTIONS: Transacao[] = [
  { id: 1, descricao: 'Venda de Balcão', tipo: 'receita', categoria: 'Vendas', valor: 350.00, data: '2023-10-25', status: 'confirmado' },
  { id: 2, descricao: 'Compra de Bebidas', tipo: 'despesa', categoria: 'Estoque', valor: 1200.00, data: '2023-10-24', status: 'confirmado' },
  { id: 3, descricao: 'Pagamento Motoboy', tipo: 'despesa', categoria: 'Logística', valor: 150.00, data: '2023-10-24', status: 'pendente' },
  { id: 4, descricao: 'Ifood Repasse', tipo: 'receita', categoria: 'Vendas', valor: 4500.00, data: '2023-10-20', status: 'confirmado' },
];

const HIGH_VALUE_THRESHOLD = 10000;

export default function FluxoCaixaScreen() {
  const navigation = useNavigation();

  // --- ESTADOS ---
  const [transacoes, setTransacoes] = useState<Transacao[]>(INITIAL_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('Mês'); // Navbar Inferior
  const opcoesFiltro = ["Dia", "Semana", "Mês", "Ano"];
  
  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHighValueModalOpen, setIsHighValueModalOpen] = useState(false);
  
  // IDs e Forms
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | string | null>(null);
  const [valorInput, setValorInput] = useState('');
  
  const [formData, setFormData] = useState<Transacao>({
    id: 0, descricao: '', tipo: 'receita', valor: 0, data: '', categoria: '', status: 'confirmado'
  });

  // --- CÁLCULOS E FILTROS ---
  const filteredTransacoes = useMemo(() => {
    return transacoes.filter(item => {
      const matchesSearch = item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [transacoes, searchTerm]);

  const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesas = transacoes.filter(t => t.tipo === 'despesa').reduce((acc, curr) => acc + curr.valor, 0);
  const saldoAtual = totalReceitas - totalDespesas;

  // --- FORMATAÇÃO ---
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => { 
    if (!dateStr) return "-"; 
    const [year, month, day] = dateStr.split('-'); 
    return `${day}/${month}/${year}`; 
  };

  // --- AÇÕES ---
  const handleOpenModal = (transacao?: Transacao) => {
    if (transacao) {
      setEditingId(transacao.id);
      setFormData({ ...transacao });
      setValorInput(transacao.valor.toFixed(2));
    } else {
      setEditingId(null);
      const hoje = new Date().toISOString().split('T')[0];
      setFormData({ id: 0, descricao: '', tipo: 'receita', valor: 0, data: hoje, categoria: '', status: 'confirmado' });
      setValorInput('');
    }
    setIsModalOpen(true);
  };

  const handleSaveCheck = () => {
    if (!formData.descricao || !valorInput || !formData.data) {
      Alert.alert("Atenção", "Preencha a descrição, valor e data.");
      return;
    }
    const valorLimpo = valorInput.replace(',', '.'); 
    const valorFinal = parseFloat(valorLimpo);

    if (isNaN(valorFinal)) {
      Alert.alert("Erro", "Valor inválido.");
      return;
    }

    if (valorFinal > HIGH_VALUE_THRESHOLD) {
      setFormData({ ...formData, valor: valorFinal });
      setIsHighValueModalOpen(true);
      return;
    }
    executeSave(valorFinal);
  };

  const executeSave = (valorOverwrite?: number) => {
    const valorParaSalvar = valorOverwrite !== undefined ? valorOverwrite : formData.valor;
    const novaTransacao = { ...formData, valor: valorParaSalvar };

    if (editingId) {
      setTransacoes(prev => prev.map(t => t.id === editingId ? { ...novaTransacao, id: editingId } : t));
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      setTransacoes(prev => [{ ...novaTransacao, id: newId }, ...prev]);
    }
    setIsHighValueModalOpen(false);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (idToDelete) {
      setTransacoes(prev => prev.filter(t => t.id !== idToDelete));
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
    }
  };

  return (
    <View className="flex-1 bg-blue-900">
      <SafeAreaView className="flex-1" edges={['top']}>
        
        {/* --- HEADER --- */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-6">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
              className="bg-blue-800 p-2.5 rounded-xl border border-blue-700/50"
            >
              <FontAwesome6 name="bars" size={20} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-white">Fluxo de Caixa</Text>
              <Text className="text-blue-200 text-xs font-medium">Gestão de entradas e saídas</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={() => handleOpenModal()}
            className="bg-blue-600 p-2.5 rounded-xl border border-blue-500 shadow-sm"
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* --- CONTEÚDO BRANCO ARREDONDADO --- */}
        <View className="flex-1 bg-gray-50 mt-2 rounded-t-[30px] overflow-hidden">
          
          {/* ScrollView para os cards superiores */}
          <View className="px-6 pt-6">
            <Text className="text-gray-500 font-bold text-xs mb-3 uppercase tracking-wider">Resumo Financeiro</Text>
            
            <View className="flex-row justify-between mb-6">
              {/* Card Saldo */}
              <View className="w-full bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-200 mb-4">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-blue-100 text-[10px] font-bold uppercase">Saldo em Caixa</Text>
                  <FontAwesome6 name="wallet" size={14} color="white" opacity={0.6} />
                </View>
                <Text className="text-2xl font-black text-white">{formatMoney(saldoAtual)}</Text>
                
                <View className="flex-row gap-3 mt-4">
                  <View className="flex-1 bg-white/10 p-2 rounded-lg border border-white/10">
                    <Text className="text-white/60 text-[9px] uppercase font-bold">Entradas</Text>
                    <Text className="text-white font-bold text-xs">{formatMoney(totalReceitas)}</Text>
                  </View>
                  <View className="flex-1 bg-white/10 p-2 rounded-lg border border-white/10">
                    <Text className="text-white/60 text-[9px] uppercase font-bold">Saídas</Text>
                    <Text className="text-white font-bold text-xs">{formatMoney(totalDespesas)}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Busca */}
            <View className="flex-row items-center bg-white border border-gray-100 rounded-xl px-4 h-12 shadow-sm mb-4">
              <Feather name="search" size={18} color="#9ca3af" />
              <TextInput 
                placeholder="Buscar por descrição ou categoria..." 
                className="flex-1 ml-2 text-sm text-gray-700"
                placeholderTextColor="#9ca3af"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
          </View>

          {/* Listagem */}
          <FlatList
            data={filteredTransacoes}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 150 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => handleOpenModal(item)}
                className="bg-white p-4 rounded-2xl border border-gray-50 mb-3 flex-row justify-between items-center shadow-sm active:bg-gray-50"
              >
                <View className="flex-row gap-3 items-center flex-1">
                  <View className={`w-10 h-10 rounded-xl items-center justify-center ${item.tipo === 'receita' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <Feather 
                      name={item.tipo === 'receita' ? "arrow-down-left" : "arrow-up-right"} 
                      size={18} 
                      color={item.tipo === 'receita' ? "#16a34a" : "#dc2626"} 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-gray-800 text-sm" numberOfLines={1}>{item.descricao}</Text>
                    <Text className="text-[10px] text-gray-400 font-medium uppercase">{item.categoria} • {formatDate(item.data)}</Text>
                  </View>
                </View>
                
                <View className="items-end ml-2">
                  <Text className={`font-bold text-sm ${item.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.tipo === 'despesa' && "- "}{formatMoney(item.valor)}
                  </Text>
                  <TouchableOpacity 
                    onPress={(e) => { 
                      e.stopPropagation();
                      setIdToDelete(item.id); 
                      setIsDeleteModalOpen(true); 
                    }}
                    className="mt-1"
                  >
                    <Feather name="trash-2" size={14} color="#d1d5db" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View className="items-center py-10 opacity-30">
                <Feather name="inbox" size={48} color="#64748b" />
                <Text className="text-gray-500 mt-2 font-bold">Nenhum lançamento.</Text>
              </View>
            )}
          />

          {/* --- NAVBAR DE FILTRO INFERIOR --- */}
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 pb-8 flex-row justify-between items-center shadow-lg">
             {opcoesFiltro.map((item) => {
               const isActive = filtroAtivo === item;
               return (
                 <TouchableOpacity 
                    key={item}
                    onPress={() => setFiltroAtivo(item)}
                    className={`px-4 py-2 rounded-full transition-all ${
                        isActive ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-transparent'
                    }`}
                 >
                    <Text className={`font-bold text-xs ${
                        isActive ? 'text-white' : 'text-gray-500'
                    }`}>
                        {item}
                    </Text>
                 </TouchableOpacity>
               );
             })}
          </View>
        </View>
      </SafeAreaView>

      {/* --- MODAL FORMULÁRIO (ADD/EDIT) --- */}
      <Modal visible={isModalOpen} animationType="slide" transparent={true} onRequestClose={() => setIsModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-white rounded-t-[35px] h-[85%] overflow-hidden">
              <View className="px-8 py-6 flex-row justify-between items-center border-b border-gray-50">
                <Text className="text-xl font-black text-gray-800">{editingId ? 'Editar Lançamento' : 'Novo Lançamento'}</Text>
                <TouchableOpacity onPress={() => setIsModalOpen(false)} className="bg-gray-100 p-2 rounded-full">
                  <Feather name="x" size={20} color="#4b5563" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
                <View className="flex-row bg-gray-100 p-1.5 rounded-2xl mb-8">
                  <TouchableOpacity onPress={() => setFormData({...formData, tipo: 'receita'})} className={`flex-1 py-3 rounded-xl flex-row justify-center items-center gap-2 ${formData.tipo === 'receita' ? 'bg-white shadow-sm' : ''}`}>
                    <Feather name="arrow-down-left" size={16} color={formData.tipo === 'receita' ? '#16a34a' : '#9ca3af'} />
                    <Text className={`font-bold text-xs ${formData.tipo === 'receita' ? 'text-gray-800' : 'text-gray-400'}`}>ENTRADA</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setFormData({...formData, tipo: 'despesa'})} className={`flex-1 py-3 rounded-xl flex-row justify-center items-center gap-2 ${formData.tipo === 'despesa' ? 'bg-white shadow-sm' : ''}`}>
                    <Feather name="arrow-up-right" size={16} color={formData.tipo === 'despesa' ? '#dc2626' : '#9ca3af'} />
                    <Text className={`font-bold text-xs ${formData.tipo === 'despesa' ? 'text-gray-800' : 'text-gray-400'}`}>SAÍDA</Text>
                  </TouchableOpacity>
                </View>

                <View className="space-y-5">
                  <View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Descrição</Text>
                    <TextInput 
                      className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-800 text-base"
                      placeholder="Ex: Venda de Balcão"
                      value={formData.descricao}
                      onChangeText={(t) => setFormData({...formData, descricao: t})}
                    />
                  </View>

                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Valor (R$)</Text>
                      <TextInput 
                        className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-800 text-base font-bold"
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={valorInput}
                        onChangeText={setValorInput}
                      />
                    </View>
                    <View className="flex-1">
                       <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Data</Text>
                       <TextInput 
                          className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-800 text-base"
                          placeholder="AAAA-MM-DD"
                          value={formData.data}
                          onChangeText={(t) => setFormData({...formData, data: t})}
                        />
                    </View>
                  </View>

                  <View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Categoria</Text>
                    <TextInput 
                      className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-800 text-base"
                      placeholder="Ex: Vendas, Estoque..."
                      value={formData.categoria}
                      onChangeText={(t) => setFormData({...formData, categoria: t})}
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={handleSaveCheck}
                  className="mt-10 w-full bg-blue-600 py-5 rounded-2xl items-center shadow-lg shadow-blue-200"
                >
                  <Text className="text-white font-black text-lg">Salvar Lançamento</Text>
                </TouchableOpacity>
                <View className="h-20" />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- MODAL CONFIRMAÇÃO VALOR ALTO --- */}
      <Modal visible={isHighValueModalOpen} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center p-6">
          <View className="bg-white p-8 rounded-[30px] w-full items-center shadow-2xl">
             <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-6">
                <Feather name="alert-triangle" size={40} color="#f97316" />
             </View>
             <Text className="text-xl font-black text-gray-800 text-center">Valor Elevado</Text>
             <Text className="text-gray-400 text-center mt-3 mb-8 leading-5">
                Você está lançando <Text className="text-gray-800 font-bold">{formatMoney(formData.valor)}</Text>.{"\n"}Deseja confirmar este valor?
             </Text>
             <View className="flex-row gap-3 w-full">
                <TouchableOpacity onPress={() => setIsHighValueModalOpen(false)} className="flex-1 py-4 bg-gray-50 rounded-2xl items-center">
                   <Text className="font-bold text-gray-400">Revisar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => executeSave()} className="flex-1 py-4 bg-orange-500 rounded-2xl items-center shadow-md shadow-orange-200">
                   <Text className="font-bold text-white">Confirmar</Text>
                </TouchableOpacity>
             </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL DELETAR --- */}
      <Modal visible={isDeleteModalOpen} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center p-6">
          <View className="bg-white p-8 rounded-[30px] w-full items-center shadow-2xl">
             <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-6">
                <Feather name="trash-2" size={40} color="#ef4444" />
             </View>
             <Text className="text-xl font-black text-gray-800 text-center">Excluir Registro?</Text>
             <Text className="text-gray-400 text-center mt-3 mb-8 leading-5">Esta ação não poderá ser desfeita.</Text>
             <View className="flex-row gap-3 w-full">
                <TouchableOpacity onPress={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-gray-50 rounded-2xl items-center">
                   <Text className="font-bold text-gray-400">Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} className="flex-1 py-4 bg-red-500 rounded-2xl items-center">
                   <Text className="font-bold text-white">Excluir</Text>
                </TouchableOpacity>
             </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}