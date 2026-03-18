import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

// Componente interno para acessar o hook useTheme
function RootNavigator() {
  const { colors, isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: colors.BG },
        headerTintColor: colors.TEXT_DARK,
        contentStyle: { backgroundColor: colors.BG }, // Fundo global
        headerShown: false
      }}>
        {/* Suas telas */}
      </Stack>
    </>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}