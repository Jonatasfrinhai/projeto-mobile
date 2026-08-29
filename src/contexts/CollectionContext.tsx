import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player } from '../types/Player';
import { buscarJogadores } from '../services/playerService';
import { gerarTimeInicial, gerarPacote } from '../utils/packs';

const COLECAO_KEY = '@futebol_cards:colecao';

interface CollectionContextData {
  colecao: Player[];
  todosJogadores: Player[];
  carregando: boolean;
  abrirPacoteAposVitoria: () => Promise<Player[]>;
  resetarColecao: () => Promise<void>;
}

const CollectionContext = createContext<CollectionContextData>({} as CollectionContextData);

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [colecao, setColecao] = useState<Player[]>([]);
  const [todosJogadores, setTodosJogadores] = useState<Player[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function iniciar() {
      const jogadores = await buscarJogadores();
      setTodosJogadores(jogadores);

      const salvo = await AsyncStorage.getItem(COLECAO_KEY);
      if (salvo) {
        setColecao(JSON.parse(salvo));
      } else {
        // Primeira vez do usuário: gera e salva um time inicial aleatório
        const timeInicial = gerarTimeInicial(jogadores);
        setColecao(timeInicial);
        await AsyncStorage.setItem(COLECAO_KEY, JSON.stringify(timeInicial));
      }
      setCarregando(false);
    }
    iniciar();
  }, []);

  async function abrirPacoteAposVitoria(): Promise<Player[]> {
    const novosJogadores = gerarPacote(todosJogadores, 2);
    const novaColecao = [...colecao, ...novosJogadores];
    setColecao(novaColecao);
    await AsyncStorage.setItem(COLECAO_KEY, JSON.stringify(novaColecao));
    return novosJogadores;
  }

  // Apaga a coleção salva e gera um novo time inicial aleatório do zero.
  // Útil durante o desenvolvimento/testes, ou se o usuário quiser recomeçar.
  async function resetarColecao(): Promise<void> {
    await AsyncStorage.removeItem(COLECAO_KEY);
    const timeInicial = gerarTimeInicial(todosJogadores);
    setColecao(timeInicial);
    await AsyncStorage.setItem(COLECAO_KEY, JSON.stringify(timeInicial));
  }

  return (
    <CollectionContext.Provider
      value={{ colecao, todosJogadores, carregando, abrirPacoteAposVitoria, resetarColecao }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  return useContext(CollectionContext);
}
