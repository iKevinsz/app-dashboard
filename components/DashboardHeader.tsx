import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  FlatList, 
  TouchableWithoutFeedback,
  Platform,
  StatusBar
} from "react-native";
import { Menu, Bell, Search, X } from "lucide-react-native";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  title: string;
}

const MOCK_NOTIFICATIONS = [
  { id: '1', title: "Novo pedido #1234", time: "Há 5 min", unread: true },
  { id: '2', title: "Estoque baixo: Coca-Cola", time: "Há 1 hora", unread: true },
  { id: '3', title: "Meta diária atingida!", time: "Há 3 horas", unread: false },
];

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = () => {
    console.log("Pesquisando por:", searchQuery);
    setIsSearchOpen(false);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        
        {/* === MODO PESQUISA === */}
        {isSearchOpen ? (
          <View style={styles.searchContainer}>
            <Search size={20} color="#9ca3af" style={styles.searchIconAbsolute} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar pedidos, produtos..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={handleSearchSubmit}
            />
            <TouchableOpacity onPress={() => setIsSearchOpen(false)} style={styles.iconButton}>
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        ) : (
          /* === MODO PADRÃO === */
          <>
            <View style={styles.leftSection}>
              <TouchableOpacity onPress={onMenuClick} style={styles.iconButton}>
                <Menu size={24} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.rightSection}>
              <TouchableOpacity onPress={() => setIsSearchOpen(true)} style={styles.iconButton}>
                <Search size={22} color="#4b5563" />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setIsNotificationsOpen(true)} 
                style={[styles.iconButton, isNotificationsOpen && styles.activeButton]}
              >
                <Bell size={22} color={isNotificationsOpen ? "#2563eb" : "#4b5563"} />
                {/* Bolinha vermelha de notificação */}
                <View style={styles.badge} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* === MODAL DE NOTIFICAÇÕES === */}
      <Modal
        visible={isNotificationsOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsNotificationsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsNotificationsOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownContainer}>
                
                {/* Cabeçalho do Dropdown */}
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownTitle}>Notificações</Text>
                  <TouchableOpacity>
                    <Text style={styles.markReadText}>Marcar lidas</Text>
                  </TouchableOpacity>
                </View>

                {/* Lista de Notificações */}
                <FlatList
                  data={MOCK_NOTIFICATIONS}
                  keyExtractor={(item) => item.id}
                  style={styles.list}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.notificationItem}>
                      <View style={styles.notificationRow}>
                        <Text style={[styles.notificationTitle, item.unread && styles.unreadText]}>
                          {item.title}
                        </Text>
                        {item.unread && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.notificationTime}>{item.time}</Text>
                    </TouchableOpacity>
                  )}
                />

                {/* Rodapé do Dropdown */}
                <TouchableOpacity style={styles.dropdownFooter}>
                  <Text style={styles.viewAllText}>Ver todas</Text>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40, // Ajuste para SafeArea
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#eff6ff', // blue-50
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: '#ef4444',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  
  // Estilos da Pesquisa
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingLeft: 36, // Espaço para o ícone
    paddingRight: 16,
    fontSize: 14,
    color: '#111827',
  },
  searchIconAbsolute: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },

  // Estilos do Modal/Dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)', // Fundo levemente escuro ao abrir menu
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 60 : 100,
    paddingRight: 10,
  },
  dropdownContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  markReadText: {
    fontSize: 12,
    color: '#2563eb',
  },
  list: {
    maxHeight: 250,
  },
  notificationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationTitle: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
  },
  unreadText: {
    fontWeight: '600',
    color: '#111827',
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  dropdownFooter: {
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  }
});