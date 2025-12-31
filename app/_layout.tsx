import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* O login */}
      <Stack.Screen name="index" /> 
      
      {/* O grupo do drawer */}
      <Stack.Screen name="(drawer)" />
      
      {/* Outras telas */}
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="auth/forgot-password" />
    </Stack>
  );
}