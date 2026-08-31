import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';

const SESSAO_KEY = '@futebol_cards:sessao';

interface Sessao {
  userId: string;
  usuario: string;
  roles: string[];
}

interface AuthContextData {
  usuario: string | null;
  userId: string | null;
  roles: string[];
  carregando: boolean;
  entrar: (nome: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, senha: string, email: string, cep: string) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Login/cadastro integrados com o backend "login-login" (Spring Boot + JWT).
// O token em si fica num cookie httpOnly setado pelo servidor; aqui no app
// guardamos só os dados públicos do usuário (id, nome, roles) pra saber que
// ele está logado e exibir na tela de perfil.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SESSAO_KEY).then((valor) => {
      if (valor) setSessao(JSON.parse(valor));
      setCarregando(false);
    });
  }, []);

  async function salvarSessao(claims: authService.AuthClaims) {
    const novaSessao: Sessao = {
      userId: claims.userId,
      usuario: claims.username,
      roles: claims.roles,
    };
    await AsyncStorage.setItem(SESSAO_KEY, JSON.stringify(novaSessao));
    setSessao(novaSessao);
  }

  async function entrar(nome: string, senha: string) {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo || !senha) return;
    const claims = await authService.login(nomeLimpo, senha);
    await salvarSessao(claims);
  }

  async function cadastrar(nome: string, senha: string, email: string, cep: string) {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo || !senha) return;
    const claims = await authService.cadastrar(nomeLimpo, senha, email.trim(), cep.trim());
    await salvarSessao(claims);
  }

  async function sair() {
    await authService.logout();
    await AsyncStorage.removeItem(SESSAO_KEY);
    setSessao(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario: sessao?.usuario ?? null,
        userId: sessao?.userId ?? null,
        roles: sessao?.roles ?? [],
        carregando,
        entrar,
        cadastrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
