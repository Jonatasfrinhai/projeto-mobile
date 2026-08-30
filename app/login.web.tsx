import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Animated, Image, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

// Slides do carrossel — substitua os placeholders por imagens reais quando disponíveis
const SLIDES = [
  { id: 1, label: 'Imagem 1', source: require('../assets/images/slide1.jpg') },
  { id: 2, label: 'Imagem 2', source: require('../assets/images/slide2.jpg')},
  { id: 3, label: 'Imagem 3', source: require('../assets/images/slide3.jpg') },
];

const SLIDE_INTERVAL = 4000; // ms

function CarrosselLado() {
  const [ativo, setAtivo] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setAtivo((prev) => (prev + 1) % SLIDES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.lado}>
      {/* Slide placeholder */}
      <Animated.View style={[styles.slidePlaceholder, { opacity: fadeAnim }]}>
        <ImageBackground
          source={SLIDES[ativo].source}
          style={styles.imagem}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Overlay escuro */}
      <View style={styles.overlay} />

      {/* Logo + legenda */}
      <View style={styles.conteudoLado}>
        {/* Área da logo */}
        <View style={styles.logoArea}>
          {/* 1. Ao adicionar as imagens na pasta, descomente as tags <Image> abaixo */}
          {/* 2. Apague (ou comente) as tags <Text> que estão ativas no momento */}
          
          <Image source={require('../assets/images/logo-icon.svg')} style={styles.logoIconeImg} resizeMode="contain" /> 
          <Image source={require('../assets/images/logo-text.svg')} style={styles.logoTextoImg} resizeMode="contain" /> 
        
        </View>

        <Text style={styles.legenda}>
          Colecione, troque e gerencie{'\n'}suas figurinhas favoritas
        </Text>

        {/* Indicadores do carrossel */}
        <View style={styles.indicadores}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.ponto, i === ativo && styles.pontoAtivo]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export default function LoginWeb() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState<'treinador' | 'olheiro'>('treinador');
  const [isLogin, setIsLogin] = useState(true);
  const { entrar } = useAuth();

  async function handleAcao() {
    if (!nome.trim()) return;
    // Como a AuthContext atual armazena o nome sem servidor, chamamos apenas o entrar.
    // Em um backend real, a senha seria validada aqui.
    await entrar(nome);
    router.replace('/(tabs)/colecao');
  }

  return (
    <View style={styles.container}>
      <CarrosselLado />

      <View style={styles.ladoForm}>
        <View style={styles.card}>
          <Text style={styles.titulo}>
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </Text>
          <Text style={styles.subtitulo}>
            {isLogin ? 'Insira seus dados para acessar sua coleção.' : 'Junte-se a nós e comece a colecionar.'}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}> Usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu usuário"
              placeholderTextColor="#bbb"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="none"
            />
          </View>

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

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Perfil</Text>
              <View style={styles.selectorRow}>
                <Pressable
                  style={[styles.selectorOption, perfil === 'treinador' && styles.selectorAtivo]}
                  onPress={() => setPerfil('treinador')}
                >
                  <Text style={[styles.selectorTexto, perfil === 'treinador' && styles.selectorTextoAtivo]}>
                    Treinador
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.selectorOption, perfil === 'olheiro' && styles.selectorAtivo]}
                  onPress={() => setPerfil('olheiro')}
                >
                  <Text style={[styles.selectorTexto, perfil === 'olheiro' && styles.selectorTextoAtivo]}>
                    Olheiro
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={{ height: 8 }} />

          <Pressable style={styles.botao} onPress={handleAcao}>
            <Text style={styles.botaoTexto}>{isLogin ? 'Entrar' : 'Cadastrar'}</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.rodapeForm}>
            <Text style={styles.textoRodape}>
              {isLogin ? 'Ainda não tem uma conta? ' : 'Já possui uma conta? '}
            </Text>
            <Pressable onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.linkRodape}>{isLogin ? 'Cadastre-se' : 'Faça login'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const VERDE = '#1b7a3d';

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', minHeight: '100vh' as any },

  // ── Lado esquerdo ──────────────────────────────────────────────
  lado: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0d1a0f',
  },
  slidePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#152318',
  },
  imagemPlaceholder: {
    alignItems: 'center',
    gap: 8,
    opacity: 0.35,
  },
  placeholderIcone: {
    fontSize: 56,
  },
  placeholderTexto: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 2,
  },
  placeholderDica: {
    color: '#888',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 1,
  },

  // Overlay escuro sobre o slide
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  // Conteúdo sobre o overlay (logo + legenda + indicadores)
  conteudoLado: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 20,
  },

  // Logo
  logoArea: {
    alignItems: 'center',
    gap: 8,
  },
  logoIcone: {
    fontSize: 48,
  },
  logoIconeImg: {
    width: 72,
    height: 72,
  },
  logoTexto: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '200',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  logoTextoImg: {
    width: 220,
    height: 48,
    marginTop: 4,
  },

  // Legenda
  legenda: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '300',
    letterSpacing: 1.5,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Indicadores (dots)
  indicadores: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  ponto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  pontoAtivo: {
    backgroundColor: '#ffffff',
    width: 20,
  },

  imagem: {
  width: '100%',
  height: '100%',
},

  // ── Lado direito (formulário) ──────────────────────────────────
  ladoForm: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: '600', 
    color: '#1a1a1a', 
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  subtitulo: { 
    color: '#999', 
    marginBottom: 32, 
    fontWeight: '300',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  inputGroup: {
    marginBottom: 18,
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
    fontSize: 14,
    fontWeight: '300',
    color: '#333',
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  selectorOption: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  selectorAtivo: {
    backgroundColor: VERDE,
    borderColor: VERDE,
  },
  selectorTexto: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888',
  },
  selectorTextoAtivo: {
    color: '#fff',
    fontWeight: '500',
  },
  botao: { 
    backgroundColor: VERDE, 
    borderRadius: 10, 
    paddingVertical: 14, 
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 6,
  },
  botaoTexto: { 
    color: '#fff', 
    fontWeight: '500', 
    fontSize: 14, 
    letterSpacing: 0.8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e8e8e8',
  },
  dividerText: {
    color: '#bbb',
    fontSize: 12,
    fontWeight: '300',
    paddingHorizontal: 14,
  },
  rodapeForm: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  textoRodape: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '300',
  },
  linkRodape: {
    color: VERDE,
    fontSize: 13,
    fontWeight: '500',
  },
});

