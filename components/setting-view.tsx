import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ChevronRight, User, Bell, Shield, Palette, Globe } from "lucide-react-native";

const settingsGroups = [
  {
    title: "Account",
    items: [
      { id: "profile", label: "Profile", icon: User },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "privacy", label: "Privacy & Security", icon: Shield },
    ],
  },
  {
    title: "Preferences",
    items: [
      { id: "appearance", label: "Appearance", icon: Palette },
      { id: "language", label: "Language & Region", icon: Globe },
    ],
  },
];

export function SettingsView() {
  return (
    <ScrollView className="flex-1 p-4">
      {settingsGroups.map((group) => (
        <View key={group.title} className="mb-6">
          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            {group.title}
          </Text>
          <View className="bg-white rounded-xl shadow-sm border border-gray-200">
            {group.items.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center gap-3 p-4 ${index !== group.items.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <View className="p-2 bg-gray-100 rounded-lg">
                  <item.icon size={20} color="#4B5563" />
                </View>
                <Text className="flex-1 font-medium text-gray-900">
                  {item.label}
                </Text>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
        <Text className="font-semibold text-gray-900 mb-2">About</Text>
        <View className="space-y-2">
          <Text className="text-sm text-gray-600">Version 1.0.0</Text>
          <Text className="text-sm text-gray-600">© 2026 Dashboard App</Text>
        </View>
      </View>
    </ScrollView>
  );
}
