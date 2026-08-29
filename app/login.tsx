import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function Login() {
  const [nome, setNome] = useState('');
  const { entrar } = useAuth();

  async function handleEntrar() {
    if (!nome.trim()) return;
    await entrar(nome);
    router.replace('/(tabs)/colecao');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>⚽ Futebol Cards</Text>
      <Text style={styles.subtitulo}>Como você quer ser chamado?</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu nome"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
      />
      <Pressable style={styles.botao} onPress={handleEntrar}>
        <Text style={styles.botaoTexto}>Começar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  titulo: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitulo: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#1b7a3d',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
