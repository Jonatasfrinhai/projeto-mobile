import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCollection } from '../../src/contexts/CollectionContext';
import { CartaJogador } from '../../src/components/CartaJogador';
import { jogarPartida, ResultadoPartida, AtributoChave } from '../../src/utils/battle';
import { gerarPacote } from '../../src/utils/packs';
import { Player } from '../../src/types/Player';

const ATRIBUTO_POR_POSICAO: Record<Player['posicao'], AtributoChave> = {
  goleiro: 'defesa',
  zagueiro: 'defesa',
  lateral: 'velocidade',
  meia: 'forma',
  atacante: 'ataque',
};

export default function PartidaWeb() {
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
    const timeAdversario = gerarPacote(todosJogadores, 5).map((jogador, i) => ({
      ...jogador,
      posicao: timeJogador[i]?.posicao ?? jogador.posicao,
    }));
    const resultadoPartida = jogarPartida(timeJogador, timeAdversario, (p) => ATRIBUTO_POR_POSICAO[p]);
    setResultado(resultadoPartida);
    setPacoteGanho(null);
  }

  async function resgatarPacote() {
    const novos = await abrirPacoteAposVitoria();
    setPacoteGanho(novos);
  }

  if (timeJogador.length < 5) {
    return (
      <View style={styles.avisoBox}>
        <Text>Vá até a aba "Escalar" e monte seu time primeiro.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.titulo}>Partida</Text>

      {!resultado && (
        <Pressable style={styles.botao} onPress={jogar}>
          <Text style={styles.botaoTexto}>Jogar partida</Text>
        </Pressable>
      )}

      {resultado && (
        <View style={{ gap: 12, marginTop: 16 }}>
          {resultado.rounds.map((round, i) => (
            <View key={i} style={styles.round}>
              <Text style={styles.roundTitulo}>
                {round.posicao} · comparando {round.atributo}
              </Text>
              <View style={styles.confronto}>
                <View style={{ flex: 1 }}>
                  <CartaJogador jogador={round.cartaJogador} destaque={round.vencedor === 'jogador'} />
                </View>
                <Text style={styles.vs}>VS</Text>
                <View style={{ flex: 1 }}>
                  <CartaJogador jogador={round.cartaAdversario} destaque={round.vencedor === 'adversario'} />
                </View>
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
                <Text key={i}>• {j.nome} ({j.posicao})</Text>
              ))}
            </View>
          )}

          <Pressable style={styles.botaoSecundario} onPress={() => setResultado(null)}>
            <Text style={styles.botaoSecundarioTexto}>Jogar de novo</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  avisoBox: { padding: 40 },
  botao: {
    backgroundColor: '#1b7a3d',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth: 260,
  },
  botaoTexto: { color: '#fff', fontWeight: '700' },
  botaoSecundario: { padding: 12, alignItems: 'center' },
  botaoSecundarioTexto: { color: '#1b7a3d', fontWeight: '700' },
  round: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#eee' },
  roundTitulo: { fontWeight: '700', textTransform: 'capitalize', marginBottom: 10 },
  confronto: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  vs: { fontWeight: '700', color: '#aaa', fontSize: 16 },
  roundResultado: { marginTop: 10, fontWeight: '600' },
  placarFinal: { fontSize: 18, fontWeight: '700' },
  pacote: { backgroundColor: '#fff7d6', padding: 14, borderRadius: 10, maxWidth: 300 },
});
