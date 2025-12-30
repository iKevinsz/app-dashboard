import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Esconde o cabeçalho da tela de Login (index) */}
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />

      {/* Esconde o cabeçalho do Drawer (Menu Lateral) */}
      <Stack.Screen 
        name="(drawer)" 
        options={{ headerShown: false }} 
      />

      
      <Stack.Screen 
        name="login" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}