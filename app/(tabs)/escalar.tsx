import { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useCollection } from '../../src/contexts/CollectionContext';
import { CartaJogador } from '../../src/components/CartaJogador';
import { Player, Posicao } from '../../src/types/Player';

const POSICOES: Posicao[] = ['goleiro', 'zagueiro', 'lateral', 'meia', 'atacante'];

export default function Escalar() {
  const { colecao } = useCollection();
  const [escalacao, setEscalacao] = useState<Record<Posicao, Player | null>>({
    goleiro: null,
    zagueiro: null,
    lateral: null,
    meia: null,
    atacante: null,
  });

  const completo = POSICOES.every((p) => escalacao[p] !== null);

  function selecionar(jogador: Player) {
    setEscalacao((prev) => ({ ...prev, [jogador.posicao]: jogador }));
  }

  function irParaPartida() {
    // Passa o time escalado pra tela de partida via parâmetro serializado.
    const time = POSICOES.map((p) => escalacao[p]);
    router.push({
      pathname: '/(tabs)/partida',
      params: { time: JSON.stringify(time) },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Escale 1 jogador por posição</Text>
      {POSICOES.map((posicao) => (
        <View key={posicao} style={styles.secao}>
          <Text style={styles.posicaoTitulo}>
            {posicao} {escalacao[posicao] ? `— ${escalacao[posicao]!.nome} ✅` : ''}
          </Text>
          <FlatList
            horizontal
            data={colecao.filter((j) => j.posicao === posicao)}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => (
              <Pressable onPress={() => selecionar(item)}>
                <CartaJogador
                  jogador={item}
                  compacta
                  destaque={escalacao[posicao]?.id === item.id}
                />
              </Pressable>
            )}
          />
        </View>
      ))}
      <Pressable
        style={[styles.botao, !completo && styles.botaoDesabilitado]}
        onPress={irParaPartida}
        disabled={!completo}
      >
        <Text style={styles.botaoTexto}>Ir para a partida</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, gap: 8 },
  titulo: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  secao: { marginBottom: 10 },
  posicaoTitulo: { textTransform: 'capitalize', fontWeight: '600', marginBottom: 4 },
  botao: {
    backgroundColor: '#1b7a3d',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  botaoDesabilitado: { backgroundColor: '#aaa' },
  botaoTexto: { color: '#fff', fontWeight: '600' },
});
