import { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useCollection } from '../../src/contexts/CollectionContext';
import { CartaJogador } from '../../src/components/CartaJogador';
import { Player } from '../../src/types/Player';
import { combina } from '../../src/utils/busca';

export default function ColecaoWeb() {
  const { colecao, todosJogadores, carregando } = useCollection();
  const [busca, setBusca] = useState('');

  const idsObtidos = useMemo(() => new Set(colecao.map((j) => j.id)), [colecao]);
  const faltantes: Player[] = useMemo(
    () => todosJogadores.filter((j) => !idsObtidos.has(j.id)),
    [todosJogadores, idsObtidos]
  );

  const colecaoFiltrada = useMemo(() => colecao.filter((j) => combina(j, busca)), [colecao, busca]);
  const faltantesFiltrados = useMemo(
    () => faltantes.filter((j) => combina(j, busca)),
    [faltantes, busca]
  );

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />
        <Text>"Carregando jogadores..."</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.titulo}>"Sua coleção"</Text>

      <TextInput
        style={styles.busca}
        placeholder="Buscar por nome, clube ou posição..."
        value={busca}
        onChangeText={setBusca}
      />

      <Text style={styles.contador}>
        {colecaoFiltrada.length} de {colecao.length} jogadores obtidos
      </Text>
      <View style={styles.grade}>
        {colecaoFiltrada.map((jogador, index) => (
          <View key={`obtido-${jogador.id}-${index}`} style={styles.item}>
            <CartaJogador jogador={jogador} />
          </View>
        ))}
      </View>
      {busca !== '' && colecaoFiltrada.length === 0 && (
        <Text style={styles.vazio}>Nenhum jogador da sua coleção bate com a busca.</Text>
      )}

      <Text style={[styles.titulo, { marginTop: 32 }]}>Disponíveis</Text>
      <Text style={styles.contador}>
        {faltantesFiltrados.length} de {faltantes.length} jogadores ainda não obtidos
      </Text>
      <View style={styles.grade}>
        {faltantesFiltrados.map((jogador, index) => (
          <View key={`faltante-${jogador.id}-${index}`} style={styles.item}>
            <CartaJogador jogador={jogador} bloqueada />
          </View>
        ))}
      </View>
      {busca !== '' && faltantesFiltrados.length === 0 && (
        <Text style={styles.vazio}>Nenhum jogador disponível bate com a busca.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 40 },
  titulo: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  busca: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    marginTop: 12,
    marginBottom: 16,
    maxWidth: 360,
  },
  contador: { color: '#888', marginBottom: 20 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  item: { width: 240 },
  vazio: { color: '#888', fontStyle: 'italic', marginTop: 8 },
});
