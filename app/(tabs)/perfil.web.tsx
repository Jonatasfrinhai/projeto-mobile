import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { useCollection } from '../../src/contexts/CollectionContext';

export default function PerfilWeb() {
  const { usuario, sair } = useAuth();
  const { colecao, resetarColecao } = useCollection();

  async function handleSair() {
    await sair();
    router.replace('/login');
  }

  function handleResetar() {
    // window.confirm em vez de Alert.alert porque no navegador o Alert do
    // React Native não mostra um diálogo de verdade com botões.
    const confirmou = window.confirm(
      'Isso apaga todos os jogadores que você já ganhou e começa um time novo do zero. Tem certeza?'
    );
    if (confirmou) resetarColecao();
  }

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLetra}>{usuario?.charAt(0)}</Text>
      </View>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#eee',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1b7a3d',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLetra: { color: '#fff', fontSize: 28, fontWeight: '700' },
  nome: { fontSize: 20, fontWeight: '700' },
  info: { color: '#888', marginTop: 4, marginBottom: 20 },
  botaoSecundario: {
    borderWidth: 1,
    borderColor: '#c0392b',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  botaoSecundarioTexto: { color: '#c0392b', fontWeight: '600' },
  botao: { backgroundColor: '#c0392b', padding: 12, borderRadius: 8, paddingHorizontal: 32 },
  botaoTexto: { color: '#fff', fontWeight: '700' },
});
