import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Image 
} from "react-native";
import { Plus, Search, Edit2 } from "lucide-react-native";

export default function MenuDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  const categories = ["Todos", "Lanches", "Bebidas", "Sobremesas"];
  
  const products = [
    { id: 1, name: "X-Salada", price: "R$ 22,00", category: "Lanches", image: "🍔" },
    { id: 2, name: "Coca-Cola 350ml", price: "R$ 6,00", category: "Bebidas", image: "🥤" },
    { id: 3, name: "Pudim", price: "R$ 12,00", category: "Sobremesas", image: "🍮" },
    { id: 4, name: "X-Bacon", price: "R$ 28,00", category: "Lanches", image: "🥓" },
  ];

  return (
    <View style={styles.container}>
      
      {/* Barra de Ação (Busca + Botão Adicionar) */}
      <View style={styles.actionRow}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9ca3af" style={{ marginRight: 8 }} />
          <TextInput 
            placeholder="Buscar produto..." 
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
        </View>
        
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filtros de Categoria (Scroll Horizontal) */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }} // Espaço no final do scroll
        >
          {categories.map((cat, index) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity 
                key={index}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryPill,
                  isActive ? styles.categoryActive : styles.categoryInactive
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  isActive ? styles.categoryTextActive : styles.categoryTextInactive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Produtos */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {products.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardContent}>
                {/* Ícone/Imagem */}
                <View style={styles.imagePlaceholder}>
                  <Text style={{ fontSize: 24 }}>{item.image}</Text>
                </View>
                
                {/* Textos */}
                <View>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>{item.price}</Text>
                </View>
              </View>

              {/* Ações */}
              <TouchableOpacity style={styles.editButton}>
                <Edit2 size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb', // gray-50 opcional, ou transparent se vier do pai
  },
  
  // Barra de Ação
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: '#2563eb', // blue-600
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Categorias
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryActive: {
    backgroundColor: '#1f2937', // gray-800
  },
  categoryInactive: {
    backgroundColor: '#e5e7eb', // gray-200
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  categoryTextInactive: {
    color: '#374151', // gray-700
  },

  // Lista de Produtos
  listContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Sombras
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb', // blue-600
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
});