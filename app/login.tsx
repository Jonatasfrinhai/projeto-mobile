import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

const VERDE = '#1b7a3d';
const VERDE_ESCURO = '#154f2a';

export default function Login() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { entrar, cadastrar } = useAuth();

  async function handleAcao() {
    if (!nome.trim() || !senha) {
      setErro('Preencha usuário e senha.');
      return;
    }
    if (!isLogin && (!email.trim() || !cep.trim())) {
      setErro('Preencha e-mail e CEP para se cadastrar.');
      return;
    }

    setErro('');
    setCarregando(true);
    try {
      if (isLogin) {
        await entrar(nome, senha);
      } else {
        await cadastrar(nome, senha, email, cep);
      }
      router.replace('/(tabs)/colecao');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao entrar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.tela}>
      <StatusBar barStyle="light-content" backgroundColor={VERDE_ESCURO} />

      {/* Cabeçalho verde com logo */}
      <View style={styles.header}>
        <Text style={styles.logoIcone}>⚽</Text>
        <Text style={styles.logoTexto}>FutebolCards</Text>
        <Text style={styles.logoTagline}>Colecione · Troque · Gerencie</Text>
      </View>

      {/* Card flutuante com formulário */}
      <KeyboardAvoidingView
        style={styles.cardWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Toggle login / cadastro */}
            <View style={styles.toggleRow}>
              <Pressable
                style={[styles.toggleBtn, isLogin && styles.toggleAtivo]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.toggleTexto, isLogin && styles.toggleTextoAtivo]}>
                  Entrar
                </Text>
              </Pressable>
              <Pressable
                style={[styles.toggleBtn, !isLogin && styles.toggleAtivo]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.toggleTexto, !isLogin && styles.toggleTextoAtivo]}>
                  Cadastrar
                </Text>
              </Pressable>
            </View>

            <Text style={styles.titulo}>
              {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </Text>
            <Text style={styles.subtitulo}>
              {isLogin
                ? 'Insira seus dados para acessar sua coleção.'
                : 'Junte-se a nós e comece a colecionar.'}
            </Text>

            {/* Usuário */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Usuário</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu usuário"
                placeholderTextColor="#bbb"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="none"
              />
            </View>

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#bbb"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                onSubmitEditing={handleAcao}
              />
            </View>

            {/* E-mail e CEP — apenas no cadastro (exigidos pelo backend) */}
            {!isLogin && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>E-mail</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor="#bbb"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CEP</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu CEP"
                    placeholderTextColor="#bbb"
                    value={cep}
                    onChangeText={setCep}
                    keyboardType="numeric"
                  />
                </View>
              </>
            )}

            {!!erro && <Text style={styles.erroTexto}>{erro}</Text>}

            <View style={{ height: 8 }} />

            <Pressable style={styles.botao} onPress={handleAcao} disabled={carregando}>
              <Text style={styles.botaoTexto}>
                {carregando ? 'Aguarde...' : isLogin ? 'Entrar' : 'Cadastrar'}
              </Text>
            </Pressable>

            {/* Rodapé */}
            <View style={styles.rodape}>
              <Text style={styles.rodapeTexto}>
                {isLogin ? 'Ainda não tem uma conta? ' : 'Já possui uma conta? '}
              </Text>
              <Pressable onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.rodapeLink}>{isLogin ? 'Cadastre-se' : 'Faça login'}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: VERDE_ESCURO,
  },

  // ── Cabeçalho ──────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    paddingTop: 72,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: VERDE_ESCURO,
  },
  logoIcone: {
    fontSize: 48,
    marginBottom: 8,
  },
  logoTexto: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '200',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  logoTagline: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '300',
    letterSpacing: 2,
    marginTop: 6,
    textTransform: 'uppercase',
  },

  // ── Card ────────────────────────────────────────────────────────
  cardWrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 28,
    paddingTop: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },

  // ── Toggle ──────────────────────────────────────────────────────
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 4,
    marginBottom: 28,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleAtivo: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleTexto: {
    fontSize: 14,
    fontWeight: '400',
    color: '#aaa',
    letterSpacing: 0.3,
  },
  toggleTextoAtivo: {
    color: '#1a1a1a',
    fontWeight: '600',
  },

  // ── Textos ──────────────────────────────────────────────────────
  titulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  subtitulo: {
    fontSize: 13,
    fontWeight: '300',
    color: '#999',
    marginBottom: 28,
    letterSpacing: 0.2,
  },

  // ── Inputs ──────────────────────────────────────────────────────
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#777',
    marginBottom: 6,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '300',
    color: '#333',
  },

  // ── Erro ────────────────────────────────────────────────────────
  erroTexto: {
    color: '#c0392b',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 4,
  },

  // ── Botão ───────────────────────────────────────────────────────
  botao: {
    backgroundColor: VERDE,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: 0.8,
  },

  // ── Rodapé ──────────────────────────────────────────────────────
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  rodapeTexto: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '300',
  },
  rodapeLink: {
    color: VERDE,
    fontSize: 13,
    fontWeight: '500',
  },
});
