import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { useCollection } from '../../src/contexts/CollectionContext';

export default function Perfil() {
  const { usuario, sair } = useAuth();
  const { colecao, resetarColecao } = useCollection();

  async function handleSair() {
    await sair();
    router.replace('/login');
  }

  function handleResetar() {
    Alert.alert(
      'Resetar coleção',
      'Isso apaga todos os jogadores que você já ganhou e começa um time novo do zero. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resetar', style: 'destructive', onPress: () => resetarColecao() },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{usuario}</Text>
      <Text style={styles.info}>{colecao.length} jogadores na coleção</Text>
      <Pressable style={styles.botaoSecundario} onPress={handleResetar}>
        <Text style={styles.botaoSecundarioTexto}>Resetar coleção</Text>
      </Pressable>
      <Pressable style={styles.botao} onPress={handleSair}>
        <Text style={styles.botaoTexto}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, alignItems: 'center' },
  nome: { fontSize: 22, fontWeight: '700', marginTop: 24 },
  info: { color: '#666' },
  botaoSecundario: {
    borderWidth: 1,
    borderColor: '#c0392b',
    padding: 10,
    borderRadius: 8,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  botaoSecundarioTexto: { color: '#c0392b', fontWeight: '600' },
  botao: {
    backgroundColor: '#c0392b',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 24,
  },
  botaoTexto: { color: '#fff', fontWeight: '600' },
});
