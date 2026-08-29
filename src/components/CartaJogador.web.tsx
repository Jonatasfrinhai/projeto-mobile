import { View, Text, Image, StyleSheet } from 'react-native';
import { Player } from '../types/Player';
import { CORES_RARIDADE, LABEL_RARIDADE } from '../utils/raridade';

interface CartaJogadorProps {
  jogador: Player;
  destaque?: boolean;
  compacta?: boolean;
  bloqueada?: boolean;
}

// Versão web: card mais "de site" — sombra, cantos maiores, faixa de raridade.
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
        <Foto jogador={jogador} tamanho={32} />
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
      <View style={[styles.faixaRaridade, { backgroundColor: corRaridade }]}>
        <Text style={styles.faixaTexto}>{LABEL_RARIDADE[jogador.raridade]}</Text>
      </View>
      <View style={styles.header}>
        <Foto jogador={jogador} tamanho={48} />
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{jogador.nome}</Text>
          <Text style={styles.info}>
            {jogador.posicao} · {jogador.clube}
          </Text>
        </View>
      </View>
      <View style={styles.divisor} />
      <View style={styles.atributos}>
        <View style={styles.atributoBox}>
          <Text style={styles.atributoValor}>{jogador.atributos.ataque}</Text>
          <Text style={styles.atributoLabel}>ATA</Text>
        </View>
        <View style={styles.atributoBox}>
          <Text style={styles.atributoValor}>{jogador.atributos.defesa}</Text>
          <Text style={styles.atributoLabel}>DEF</Text>
        </View>
        <View style={styles.atributoBox}>
          <Text style={styles.atributoValor}>{jogador.atributos.velocidade}</Text>
          <Text style={styles.atributoLabel}>VEL</Text>
        </View>
        <View style={styles.atributoBox}>
          <Text style={styles.atributoValor}>{jogador.atributos.forma}</Text>
          <Text style={styles.atributoLabel}>FORMA</Text>
        </View>
      </View>
      {bloqueada && (
        <View style={styles.faixaBloqueado}>
          <Text style={styles.faixaBloqueadoTexto}>🔒 Não obtido — ganhe em pacotes de vitória</Text>
        </View>
      )}
    </View>
  );
}

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

const VERDE = '#1b7a3d';

const styles = StyleSheet.create({
  carta: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,

    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    borderWidth: 2,
    overflow: 'hidden',
  },
  cartaCompacta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginRight: 8,
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    cursor: 'pointer',
  },
  destaque: { borderWidth: 3 },
  bloqueada: { opacity: 0.75 },
  faixaRaridade: {
    marginHorizontal: -18,
    marginTop: -18,
    marginBottom: 12,
    paddingVertical: 4,
    alignItems: 'center',
  },
  faixaTexto: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fotoFallback: { backgroundColor: VERDE, alignItems: 'center', justifyContent: 'center' },
  fotoFallbackTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  nome: { fontSize: 17, fontWeight: '700' },
  nomeCompacto: { fontWeight: '600', fontSize: 13 },
  clubeCompacto: { fontSize: 11, color: '#888' },
  info: { color: '#888', textTransform: 'capitalize', fontSize: 13 },
  divisor: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
  atributos: { flexDirection: 'row', justifyContent: 'space-between' },
  atributoBox: { alignItems: 'center' },
  atributoValor: { fontSize: 18, fontWeight: '700', color: VERDE },
  atributoLabel: { fontSize: 10, color: '#999', marginTop: 2 },
  faixaBloqueado: {
    marginTop: 10,
    backgroundColor: '#00000008',
    borderRadius: 8,
    paddingVertical: 6,
  },
  faixaBloqueadoTexto: { fontSize: 11, color: '#666', textAlign: 'center' },
});
