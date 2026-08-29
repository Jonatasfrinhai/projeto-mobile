import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@futebol_cards:usuario';

interface AuthContextData {
  usuario: string | null;
  carregando: boolean;
  entrar: (nome: string) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Login/cadastro 100% local: não tem servidor, não tem senha, não tem token.
// É só um "quem é você" salvo no dispositivo, pra identificar a coleção do usuário.
// Pensado pra ser substituído depois por um login de verdade sem mexer no resto do app.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(USER_KEY).then((valor) => {
      setUsuario(valor);
      setCarregando(false);
    });
  }, []);

  async function entrar(nome: string) {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) return;
    await AsyncStorage.setItem(USER_KEY, nomeLimpo);
    setUsuario(nomeLimpo);
  }

  async function sair() {
    await AsyncStorage.removeItem(USER_KEY);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
