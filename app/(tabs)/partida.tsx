import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCollection } from '../../src/contexts/CollectionContext';
import { CartaJogador } from '../../src/components/CartaJogador';
import { jogarPartida, ResultadoPartida, AtributoChave } from '../../src/utils/battle';
import { gerarPacote } from '../../src/utils/packs';
import { Player } from '../../src/types/Player';

// Atributo "principal" comparado em cada posição.
const ATRIBUTO_POR_POSICAO: Record<Player['posicao'], AtributoChave> = {
  goleiro: 'defesa',
  zagueiro: 'defesa',
  lateral: 'velocidade',
  meia: 'forma',
  atacante: 'ataque',
};

export default function Partida() {
  const { time: timeParam } = useLocalSearchParams<{ time?: string }>();
  const { todosJogadores, abrirPacoteAposVitoria } = useCollection();
  const [resultado, setResultado] = useState<ResultadoPartida | null>(null);
  const [pacoteGanho, setPacoteGanho] = useState<Player[] | null>(null);

  const timeJogador: Player[] = useMemo(
    () => (timeParam ? JSON.parse(timeParam) : []),
    [timeParam]
  );

  function jogar() {
    if (timeJogador.length < 5 || todosJogadores.length === 0) return;

    // Adversário: time aleatório gerado na hora, pra sempre ter alguém pra enfrentar.
    const timeAdversario = gerarPacote(todosJogadores, 5).map((jogador, i) => ({
      ...jogador,
      posicao: timeJogador[i]?.posicao ?? jogador.posicao,
    }));

    const resultadoPartida = jogarPartida(
      timeJogador,
      timeAdversario,
      (posicao) => ATRIBUTO_POR_POSICAO[posicao]
    );
    setResultado(resultadoPartida);
    setPacoteGanho(null);
  }

  async function resgatarPacote() {
    const novos = await abrirPacoteAposVitoria();
    setPacoteGanho(novos);
  }

  if (timeJogador.length < 5) {
    return (
      <View style={styles.centro}>
        <Text>Vá até a aba "Escalar" e monte seu time primeiro.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!resultado && (
        <Pressable style={styles.botao} onPress={jogar}>
          <Text style={styles.botaoTexto}>Jogar partida</Text>
        </Pressable>
      )}

      {resultado && (
        <View style={{ gap: 8 }}>
          {resultado.rounds.map((round, i) => (
            <View key={i} style={styles.round}>
              <Text style={styles.roundTitulo}>
                {round.posicao} ({round.atributo})
              </Text>
              <View style={styles.confronto}>
                <CartaJogador jogador={round.cartaJogador} compacta destaque={round.vencedor === 'jogador'} />
                <Text style={styles.vs}>vs</Text>
                <CartaJogador jogador={round.cartaAdversario} compacta destaque={round.vencedor === 'adversario'} />
              </View>
              <Text style={styles.roundResultado}>
                {round.vencedor === 'jogador'
                  ? '✅ Você venceu o round'
                  : round.vencedor === 'adversario'
                  ? '❌ Adversário venceu o round'
                  : '➖ Empate'}
              </Text>
            </View>
          ))}

          <Text style={styles.placarFinal}>
            Placar: você {resultado.vitoriasJogador} x {resultado.vitoriasAdversario} adversário
          </Text>

          {resultado.vencedorFinal === 'jogador' && !pacoteGanho && (
            <Pressable style={styles.botao} onPress={resgatarPacote}>
              <Text style={styles.botaoTexto}>Abrir pacote de vitória 🎁</Text>
            </Pressable>
          )}

          {pacoteGanho && (
            <View style={styles.pacote}>
              <Text style={{ fontWeight: '700' }}>Você ganhou:</Text>
              {pacoteGanho.map((j, i) => (
                <Text key={i}>
                  • {j.nome} ({j.posicao})
                </Text>
              ))}
            </View>
          )}

          <Pressable style={styles.botaoSecundario} onPress={() => setResultado(null)}>
            <Text style={styles.botaoSecundarioTexto}>Jogar de novo</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 12 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  botao: {
    backgroundColor: '#1b7a3d',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontWeight: '600' },
  botaoSecundario: { padding: 12, alignItems: 'center' },
  botaoSecundarioTexto: { color: '#1b7a3d', fontWeight: '600' },
  round: { backgroundColor: '#f2f2f2', borderRadius: 8, padding: 10 },
  roundTitulo: { fontWeight: '700', textTransform: 'capitalize' },
  confronto: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  vs: { fontWeight: '700', color: '#888' },
  roundResultado: { marginTop: 4, fontWeight: '600' },
  placarFinal: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  pacote: { backgroundColor: '#fff7d6', padding: 10, borderRadius: 8 },
});
