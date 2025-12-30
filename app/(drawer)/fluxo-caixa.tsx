import React, { useState, useMemo } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, TextInput, 
  Modal, FlatList, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

// --- TIPAGEM ---
interface Transacao {
  id: number | string; // ID misto para aceitar os temporários
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
  const [filterTipo, setFilterTipo] = useState<'todos' | 'receita' | 'despesa'>('todos');
  
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
      const matchesTipo = filterTipo === 'todos' || item.tipo === filterTipo;
      return matchesSearch && matchesTipo;
    });
  }, [transacoes, searchTerm, filterTipo]);

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

    // Converter input de valor (ex: "1.200,50" ou "1200.50")
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
      // Editar
      setTransacoes(prev => prev.map(t => t.id === editingId ? { ...novaTransacao, id: editingId } : t));
    } else {
      // Criar Novo (Gera ID aleatório para simular banco)
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
    <View className="flex-1 bg-gray-50 pt-12">
      
      {/* --- HEADER COM MENU --- */}
      <View className="px-6 mb-6 flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm active:bg-gray-100">
                 <FontAwesome6 name="bars" size={18} color="#374151" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold text-gray-800">Fluxo de Caixa</Text>
              <Text className="text-sm text-gray-500">Entradas e saídas.</Text>
            </View>
        </View>
        
        <TouchableOpacity 
          onPress={() => handleOpenModal()}
          className="bg-blue-600 px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-md active:bg-blue-700"
        >
          <Feather name="plus" size={18} color="white" />
          <Text className="text-white font-bold text-sm">Novo</Text>
        </TouchableOpacity>
      </View>

      {/* --- KPI CARDS (Resumo) --- */}
      <View className="h-32 mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
          {/* Card Receitas */}
          <View className="w-40 p-4 rounded-2xl bg-green-50 border border-green-100 justify-between shadow-sm">
            <View className="flex-row justify-between items-start">
              <Text className="text-[10px] font-bold uppercase text-green-700 opacity-70">Receitas</Text>
              <View className="bg-white p-1.5 rounded-full"><Feather name="trending-up" size={16} color="#15803d" /></View>
            </View>
            <Text className="text-lg font-black text-green-700" numberOfLines={1}>{formatMoney(totalReceitas)}</Text>
          </View>

          {/* Card Despesas */}
          <View className="w-40 p-4 rounded-2xl bg-red-50 border border-red-100 justify-between shadow-sm">
            <View className="flex-row justify-between items-start">
              <Text className="text-[10px] font-bold uppercase text-red-700 opacity-70">Despesas</Text>
              <View className="bg-white p-1.5 rounded-full"><Feather name="trending-down" size={16} color="#b91c1c" /></View>
            </View>
            <Text className="text-lg font-black text-red-700" numberOfLines={1}>{formatMoney(totalDespesas)}</Text>
          </View>

          {/* Card Saldo */}
          <View className={`w-40 p-4 rounded-2xl border justify-between shadow-sm ${saldoAtual >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
            <View className="flex-row justify-between items-start">
              <Text className={`text-[10px] font-bold uppercase opacity-70 ${saldoAtual >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Saldo Atual</Text>
              <View className="bg-white p-1.5 rounded-full"><FontAwesome6 name="wallet" size={14} color={saldoAtual >= 0 ? "#1d4ed8" : "#c2410c"} /></View>
            </View>
            <Text className={`text-lg font-black ${saldoAtual >= 0 ? 'text-blue-700' : 'text-orange-700'}`} numberOfLines={1}>{formatMoney(saldoAtual)}</Text>
          </View>
        </ScrollView>
      </View>

      {/* --- FILTROS --- */}
      <View className="px-6 mb-4 space-y-3">
        {/* Barra de Busca */}
        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-11 shadow-sm">
          <Feather name="search" size={18} color="#9ca3af" />
          <TextInput 
            placeholder="Buscar lançamentos..." 
            className="flex-1 ml-2 text-sm text-gray-700"
            placeholderTextColor="#9ca3af"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        
        {/* Botões de Filtro */}
        <View className="flex-row bg-gray-200 p-1 rounded-lg">
          {['todos', 'receita', 'despesa'].map((tipo) => (
            <TouchableOpacity 
              key={tipo}
              onPress={() => setFilterTipo(tipo as any)}
              className={`flex-1 items-center py-2 rounded-md ${filterTipo === tipo ? 'bg-white shadow-sm' : ''}`}
            >
              <Text className={`text-xs font-bold capitalize ${filterTipo === tipo ? 'text-gray-800' : 'text-gray-500'}`}>{tipo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* --- LISTAGEM (FLATLIST) --- */}
      <FlatList
        data={filteredTransacoes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleOpenModal(item)}
            className="bg-white p-4 rounded-xl border border-gray-100 mb-3 flex-row justify-between items-center active:bg-gray-50"
          >
            {/* Ícone e Info Principal */}
            <View className="flex-row gap-3 items-center flex-1">
              <View className={`w-10 h-10 rounded-full items-center justify-center ${item.tipo === 'receita' ? 'bg-green-100' : 'bg-red-100'}`}>
                <Feather name={item.tipo === 'receita' ? 'arrow-up' : 'arrow-down'} size={18} color={item.tipo === 'receita' ? '#16a34a' : '#dc2626'} />
              </View>
              <View className="flex-1 min-w-0 pr-2">
                <Text className="font-bold text-gray-800 text-sm" numberOfLines={1}>{item.descricao}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">{item.categoria} • {formatDate(item.data)}</Text>
              </View>
            </View>
            
            {/* Valor e Status */}
            <View className="items-end">
              <Text className={`font-black text-sm ${item.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                {item.tipo === 'despesa' && "- "}{formatMoney(item.valor)}
              </Text>
              <View className="flex-row items-center gap-1 mt-1">
                <View className={`w-1.5 h-1.5 rounded-full ${item.status === 'confirmado' ? 'bg-blue-500' : 'bg-yellow-400'}`} />
                <Text className="text-[10px] text-gray-400 capitalize">{item.status}</Text>
              </View>
            </View>

            {/* Botão Deletar (Lado Direito) */}
            <TouchableOpacity 
              onPress={(e) => { 
                e.stopPropagation(); // Impede abrir o modal de editar
                setIdToDelete(item.id); 
                setIsDeleteModalOpen(true); 
              }}
              className="ml-3 p-2 bg-gray-50 rounded-lg active:bg-red-50 active:scale-95"
            >
              <Feather name="trash-2" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View className="items-center py-10 opacity-50">
            <Feather name="inbox" size={48} color="#d1d5db" />
            <Text className="text-gray-400 mt-2 font-medium">Nenhum lançamento encontrado.</Text>
          </View>
        )}
      />

      {/* --- MODAL FORMULÁRIO (ADD/EDIT) --- */}
      <Modal visible={isModalOpen} animationType="slide" transparent={true} onRequestClose={() => setIsModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-white rounded-t-3xl h-[85%] overflow-hidden">
              
              {/* Header Modal */}
              <View className="px-6 py-4 border-b border-gray-100 flex-row justify-between items-center bg-gray-50">
                <Text className="text-lg font-bold text-gray-800">{editingId ? 'Editar Lançamento' : 'Novo Lançamento'}</Text>
                <TouchableOpacity onPress={() => setIsModalOpen(false)} className="p-2 bg-gray-200 rounded-full">
                  <Feather name="x" size={20} color="#4b5563" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
                
                {/* Switch Tipo */}
                <View className="flex-row bg-gray-100 p-1 rounded-xl mb-6">
                  <TouchableOpacity onPress={() => setFormData({...formData, tipo: 'receita'})} className={`flex-1 py-3 rounded-lg flex-row justify-center items-center gap-2 ${formData.tipo === 'receita' ? 'bg-white shadow-sm' : ''}`}>
                    <Feather name="arrow-up-circle" size={18} color={formData.tipo === 'receita' ? '#16a34a' : '#9ca3af'} />
                    <Text className={`font-bold ${formData.tipo === 'receita' ? 'text-green-700' : 'text-gray-500'}`}>Receita</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setFormData({...formData, tipo: 'despesa'})} className={`flex-1 py-3 rounded-lg flex-row justify-center items-center gap-2 ${formData.tipo === 'despesa' ? 'bg-white shadow-sm' : ''}`}>
                    <Feather name="arrow-down-circle" size={18} color={formData.tipo === 'despesa' ? '#dc2626' : '#9ca3af'} />
                    <Text className={`font-bold ${formData.tipo === 'despesa' ? 'text-red-700' : 'text-gray-500'}`}>Despesa</Text>
                  </TouchableOpacity>
                </View>

                {/* Inputs */}
                <View className="space-y-5">
                  <View>
                    <Text className="text-xs font-bold text-gray-500 uppercase mb-1">Descrição</Text>
                    <TextInput 
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                      placeholder="Ex: Venda de Balcão"
                      value={formData.descricao}
                      onChangeText={(t) => setFormData({...formData, descricao: t})}
                    />
                  </View>

                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-gray-500 uppercase mb-1">Valor (R$)</Text>
                      <TextInput 
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base font-bold"
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={valorInput}
                        onChangeText={setValorInput}
                      />
                    </View>
                    <View className="flex-1">
                       <Text className="text-xs font-bold text-gray-500 uppercase mb-1">Data</Text>
                       <TextInput 
                          className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                          placeholder="AAAA-MM-DD"
                          value={formData.data}
                          onChangeText={(t) => setFormData({...formData, data: t})}
                        />
                    </View>
                  </View>

                  <View>
                    <Text className="text-xs font-bold text-gray-500 uppercase mb-1">Categoria</Text>
                    <TextInput 
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
                      placeholder="Ex: Vendas, Estoque..."
                      value={formData.categoria}
                      onChangeText={(t) => setFormData({...formData, categoria: t})}
                    />
                  </View>

                  <View>
                    <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Status do Pagamento</Text>
                    <View className="flex-row gap-3">
                      <TouchableOpacity onPress={() => setFormData({...formData, status: 'confirmado'})} className={`flex-1 py-3 border rounded-xl items-center ${formData.status === 'confirmado' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                        <Text className={formData.status === 'confirmado' ? 'text-blue-700 font-bold' : 'text-gray-500 font-medium'}>Confirmado</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setFormData({...formData, status: 'pendente'})} className={`flex-1 py-3 border rounded-xl items-center ${formData.status === 'pendente' ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
                        <Text className={formData.status === 'pendente' ? 'text-yellow-700 font-bold' : 'text-gray-500 font-medium'}>Pendente</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Botão Salvar */}
                <TouchableOpacity 
                  onPress={handleSaveCheck}
                  className="mt-8 w-full bg-blue-600 py-4 rounded-xl items-center shadow-lg active:bg-blue-700"
                >
                  <Text className="text-white font-bold text-lg">Salvar Lançamento</Text>
                </TouchableOpacity>
                
                <View className="h-20" />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- MODAL CONFIRMAÇÃO VALOR ALTO --- */}
      <Modal visible={isHighValueModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsHighValueModalOpen(false)}>
        <View className="flex-1 bg-black/60 items-center justify-center p-6">
          <View className="bg-white p-6 rounded-2xl w-full max-w-sm items-center shadow-xl">
             <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-4">
                <Feather name="alert-triangle" size={32} color="#ea580c" />
             </View>
             <Text className="text-lg font-bold text-gray-800 text-center">Valor Elevado</Text>
             <Text className="text-gray-500 text-center mt-2 mb-6">
                Você está lançando <Text className="font-bold text-gray-800">{formatMoney(formData.valor)}</Text>.
                {"\n"}Confirma que o valor está correto?
             </Text>
             <View className="flex-row gap-3 w-full">
                <TouchableOpacity onPress={() => setIsHighValueModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl items-center">
                   <Text className="font-bold text-gray-600">Revisar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => executeSave()} className="flex-1 py-3 bg-orange-600 rounded-xl items-center shadow-md">
                   <Text className="font-bold text-white">Confirmar</Text>
                </TouchableOpacity>
             </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL DELETAR --- */}
      <Modal visible={isDeleteModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsDeleteModalOpen(false)}>
        <View className="flex-1 bg-black/60 items-center justify-center p-6">
          <View className="bg-white p-6 rounded-2xl w-full max-w-sm items-center shadow-xl">
             <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                <Feather name="trash-2" size={32} color="#dc2626" />
             </View>
             <Text className="text-lg font-bold text-gray-800 text-center">Excluir Lançamento?</Text>
             <Text className="text-gray-500 text-center mt-2 mb-6">
                Esta ação apagará o registro permanentemente.
             </Text>
             <View className="flex-row gap-3 w-full">
                <TouchableOpacity onPress={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl items-center">
                   <Text className="font-bold text-gray-600">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} className="flex-1 py-3 bg-red-600 rounded-xl items-center shadow-md">
                   <Text className="font-bold text-white">Excluir</Text>
                </TouchableOpacity>
             </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}