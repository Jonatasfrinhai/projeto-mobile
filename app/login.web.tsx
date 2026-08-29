import { useState } from 'react';
import { View, Text, TextInput, Pressable, ImageBackground, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function LoginWeb() {
  const [nome, setNome] = useState('');
  const { entrar } = useAuth();

  async function handleEntrar() {
    if (!nome.trim()) return;
    await entrar(nome);
    router.replace('/(tabs)/colecao');
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/images.jpg')}
        style={styles.lado}
        imageStyle={styles.imagem}
        resizeMode="cover"
      />
      <View style={styles.ladoForm}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Bem-vindo</Text>
          <Text style={styles.subtitulo}>Como você quer ser chamado?</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
            onSubmitEditing={handleEntrar}
          />
          <Pressable style={styles.botao} onPress={handleEntrar}>
            <Text style={styles.botaoTexto}>Começar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const VERDE = '#1b7a3d';

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', minHeight: '100vh' as any },
  lado: {
    flex: 1,
    width: '100%',
    height: '100%' as any,
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  ladoForm: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    width: 340,
    borderWidth: 1,
    borderColor: '#eee',
  },
  titulo: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitulo: { color: '#888', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  botao: { backgroundColor: VERDE, borderRadius: 8, padding: 14, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: '700' },
});
