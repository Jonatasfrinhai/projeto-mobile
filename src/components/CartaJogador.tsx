import { View, Text, Image, StyleSheet } from 'react-native';
import { Player } from '../types/Player';
import { CORES_RARIDADE, LABEL_RARIDADE } from '../utils/raridade';

interface CartaJogadorProps {
  jogador: Player;
  destaque?: boolean; // usado pra realçar, ex: jogador já escalado
  compacta?: boolean; // versão menor, usada em listas horizontais (ex: escalar)
  bloqueada?: boolean; // jogador que o usuário ainda não tem (mostra em silhueta)
}

export function CartaJogador({ jogador, destaque, compacta, bloqueada }: CartaJogadorProps) {
  const corRaridade = CORES_RARIDADE[jogador.raridade];

  if (compacta) {
    return (
      <View
        style={[
          styles.cartaCompacta,
          { borderColor: corRaridade },
          destaque && styles.destaque,
          bloqueada && styles.bloqueada,
        ]}
      >
        <Foto jogador={jogador} tamanho={36} />
        <View>
          <Text style={styles.nomeCompacto}>{jogador.nome}</Text>
          <Text style={styles.clubeCompacto}>{jogador.clube}</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.carta, { borderColor: corRaridade }, destaque && styles.destaque, bloqueada && styles.bloqueada]}
    >
      <View style={styles.topo}>
        <Foto jogador={jogador} tamanho={48} />
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{jogador.nome}</Text>
          <Text style={styles.info}>
            {jogador.posicao} · {jogador.clube}
          </Text>
        </View>
        <View style={[styles.selo, { backgroundColor: corRaridade }]}>
          <Text style={styles.seloTexto}>{LABEL_RARIDADE[jogador.raridade]}</Text>
        </View>
      </View>
      <View style={styles.atributos}>
        <Text style={styles.atributo}>⚔️ {jogador.atributos.ataque}</Text>
        <Text style={styles.atributo}>🛡️ {jogador.atributos.defesa}</Text>
        <Text style={styles.atributo}>💨 {jogador.atributos.velocidade}</Text>
        <Text style={styles.atributo}>📈 {jogador.atributos.forma}</Text>
      </View>
      {bloqueada && (
        <View style={styles.faixaBloqueado}>
          <Text style={styles.faixaBloqueadoTexto}>🔒 Não obtido — ganhe em pacotes de vitória</Text>
        </View>
      )}
    </View>
  );
}

// Foto do jogador, com fallback pra um círculo com a inicial do nome
// (a API nem sempre retorna foto pra todo mundo).
function Foto({ jogador, tamanho }: { jogador: Player; tamanho: number }) {
  const estiloBase = { width: tamanho, height: tamanho, borderRadius: tamanho / 2 };

  if (!jogador.foto) {
    return (
      <View style={[styles.fotoFallback, estiloBase]}>
        <Text style={styles.fotoFallbackTexto}>{jogador.nome.charAt(0)}</Text>
      </View>
    );
  }

  return <Image source={{ uri: jogador.foto }} style={estiloBase} />;
}

const styles = StyleSheet.create({
  carta: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 12,
    borderWidth: 2,
  },
  cartaCompacta: {
    backgroundColor: '#e6e6e6',
    padding: 8,
    borderRadius: 6,
    marginRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
  },
  destaque: { borderWidth: 3 },
  bloqueada: { opacity: 0.7 },
  faixaBloqueado: {
    marginTop: 8,
    backgroundColor: '#00000010',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  faixaBloqueadoTexto: { fontSize: 11, color: '#555', textAlign: 'center' },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  fotoFallback: {
    backgroundColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoFallbackTexto: { color: '#fff', fontWeight: '700' },
  nome: { fontSize: 16, fontWeight: '700' },
  nomeCompacto: { fontWeight: '600' },
  clubeCompacto: { fontSize: 12, color: '#666' },
  info: { color: '#666', textTransform: 'capitalize' },
  selo: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  seloTexto: { color: '#fff', fontSize: 10, fontWeight: '700' },
  atributos: { flexDirection: 'row', gap: 12 },
  atributo: { fontSize: 13 },
});
