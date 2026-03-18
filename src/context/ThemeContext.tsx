import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Defina suas Paletas de Cores
const lightColors = {
  PRIMARY: '#023151',
  ACCENT: '#FF6600',
  WHITE: '#FFFFFF',
  BG: '#F9FAFB', // Fundo Claro
  TEXT_DARK: '#111827', // Texto Principal Escuro
  TEXT_LIGHT: '#6B7280', // Texto Secundário Cinza
  BORDER: '#E5E7EB',
  CARD_BG: '#FFFFFF',
  DANGER: '#EF4444',
  SUCCESS: '#10B981',
  SUCCESS_BG: '#ECFDF5',
  INPUT_BG: '#F9FAFB'
};

const darkColors = {
  PRIMARY: '#4A90E2', // Azul mais claro para contraste no escuro
  ACCENT: '#FF6600',
  WHITE: '#FFFFFF',
  BG: '#111827', // Fundo Escuro (quase preto)
  TEXT_DARK: '#F9FAFB', // Texto Principal Claro
  TEXT_LIGHT: '#9CA3AF', // Texto Secundário Cinza Claro
  BORDER: '#374151', // Bordas mais escuras
  CARD_BG: '#1F2937', // Cards Cinza Escuro
  DANGER: '#F87171',
  SUCCESS: '#34D399',
  SUCCESS_BG: 'rgba(16, 185, 129, 0.2)',
  INPUT_BG: '#374151'
};

// 2. Criar o Contexto
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  colors: lightColors, // Cores padrão
});

// 3. Criar o Provider
export const ThemeProvider = ({ children }: any) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Carregar preferência salva ao iniciar
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark') setIsDarkMode(true);
    } catch (e) {
      console.log('Erro ao carregar tema');
    }
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
    } catch (e) {
      console.log('Erro ao salvar tema');
    }
  };

  // Seleciona as cores com base no estado
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. Hook personalizado para usar fácil nas telas
export const useTheme = () => useContext(ThemeContext);