import { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useCollection } from '../../src/contexts/CollectionContext';
import { CartaJogador } from '../../src/components/CartaJogador';
import { Player } from '../../src/types/Player';
import { combina } from '../../src/utils/busca';

export default function Colecao() {
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
        <Text>Carregando jogadores...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.buscaBox}>
        <TextInput
          style={styles.busca}
          placeholder="Buscar por nome, clube ou posição..."
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
        />
      </View>

      {/* Uma única FlatList com "seções" simuladas via header,
          pra não ter duas listas roláveis brigando uma com a outra no mobile. */}
      <FlatList
        data={faltantesFiltrados}
        keyExtractor={(item, index) => `faltante-${item.id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <CartaJogador jogador={item} bloqueada />
          </View>
        )}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        ListHeaderComponent={
          <View>
            <Text style={styles.tituloSecao}>
              Sua coleção ({colecaoFiltrada.length}
              {busca ? ` de ${colecao.length}` : ''})
            </Text>
            {colecaoFiltrada.map((jogador, index) => (
              <View key={`obtido-${jogador.id}-${index}`} style={styles.item}>
                <CartaJogador jogador={jogador} />
              </View>
            ))}
            {busca !== '' && colecaoFiltrada.length === 0 && (
              <Text style={styles.vazio}>Nenhum jogador da sua coleção bate com a busca.</Text>
            )}
            <Text style={[styles.tituloSecao, { marginTop: 20 }]}>
              Disponíveis ({faltantesFiltrados.length}
              {busca ? ` de ${faltantes.length}` : ''})
            </Text>
          </View>
        }
        ListEmptyComponent={
          busca ? <Text style={styles.vazio}>Nenhum jogador disponível bate com a busca.</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  buscaBox: { padding: 12, paddingBottom: 0 },
  busca: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  tituloSecao: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  item: { marginBottom: 8 },
  vazio: { color: '#888', fontStyle: 'italic', marginBottom: 8 },
});
