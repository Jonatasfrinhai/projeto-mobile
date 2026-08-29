import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useCollection } from '../../src/contexts/CollectionContext';
import { CartaJogador } from '../../src/components/CartaJogador';
import { Player, Posicao } from '../../src/types/Player';

const POSICOES: Posicao[] = ['goleiro', 'zagueiro', 'lateral', 'meia', 'atacante'];

export default function EscalarWeb() {
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
    const time = POSICOES.map((p) => escalacao[p]);
    router.push({ pathname: '/(tabs)/partida', params: { time: JSON.stringify(time) } });
  }

  return (
    <View>
      <Text style={styles.titulo}>Escale seu time</Text>
      <Text style={styles.subtitulo}>Um jogador por posição</Text>

      <View style={styles.colunas}>
        {POSICOES.map((posicao) => (
          <View key={posicao} style={styles.coluna}>
            <Text style={styles.posicaoTitulo}>
              {posicao} {escalacao[posicao] ? '✅' : ''}
            </Text>
            <ScrollView style={styles.listaColuna}>
              {colecao
                .filter((j) => j.posicao === posicao)
                .map((jogador, i) => (
                  <Pressable key={`${jogador.id}-${i}`} onPress={() => selecionar(jogador)} style={{ marginBottom: 8 }}>
                    <CartaJogador
                      jogador={jogador}
                      compacta
                      destaque={escalacao[posicao]?.id === jogador.id}
                    />
                  </Pressable>
                ))}
            </ScrollView>
          </View>
        ))}
      </View>

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
  titulo: { fontSize: 24, fontWeight: '700' },
  subtitulo: { color: '#888', marginBottom: 20 },
  colunas: { flexDirection: 'row', gap: 12 },
  coluna: { flex: 1, minWidth: 160 },
  posicaoTitulo: { textTransform: 'capitalize', fontWeight: '700', marginBottom: 8 },
  listaColuna: { maxHeight: 420 },
  botao: {
    backgroundColor: '#1b7a3d',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    maxWidth: 260,
  },
  botaoDesabilitado: { backgroundColor: '#ccc' },
  botaoTexto: { color: '#fff', fontWeight: '700' },
});
