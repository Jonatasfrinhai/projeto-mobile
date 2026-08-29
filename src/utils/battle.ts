import { Player, Atributos } from '../types/Player';

export type AtributoChave = keyof Atributos;

export interface ResultadoRound {
  posicao: string;
  atributo: AtributoChave;
  cartaJogador: Player;
  cartaAdversario: Player;
  vencedor: 'jogador' | 'adversario' | 'empate';
}

export interface ResultadoPartida {
  rounds: ResultadoRound[];
  vitoriasJogador: number;
  vitoriasAdversario: number;
  vencedorFinal: 'jogador' | 'adversario' | 'empate';
}

// Compara duas cartas num atributo específico. Sem sorte: só o número maior ganha.
export function compararRound(
  cartaJogador: Player,
  cartaAdversario: Player,
  atributo: AtributoChave
): ResultadoRound {
  const valorJogador = cartaJogador.atributos[atributo];
  const valorAdversario = cartaAdversario.atributos[atributo];

  let vencedor: ResultadoRound['vencedor'] = 'empate';
  if (valorJogador > valorAdversario) vencedor = 'jogador';
  else if (valorAdversario > valorJogador) vencedor = 'adversario';

  return {
    posicao: cartaJogador.posicao,
    atributo,
    cartaJogador,
    cartaAdversario,
    vencedor,
  };
}

// Joga uma partida completa: 5 rounds, um por posição escalada.
// `escolhas` define qual atributo o jogador quer comparar em cada round
// (no MVP pode ser sempre o atributo "mais forte" da posição, ex: ataque pro atacante).
export function jogarPartida(
  timeJogador: Player[],
  timeAdversario: Player[],
  escolherAtributo: (posicao: Player['posicao']) => AtributoChave
): ResultadoPartida {
  const rounds: ResultadoRound[] = timeJogador.map((cartaJogador) => {
    const cartaAdversario =
      timeAdversario.find((c) => c.posicao === cartaJogador.posicao) ?? timeAdversario[0];
    const atributo = escolherAtributo(cartaJogador.posicao);
    return compararRound(cartaJogador, cartaAdversario, atributo);
  });

  const vitoriasJogador = rounds.filter((r) => r.vencedor === 'jogador').length;
  const vitoriasAdversario = rounds.filter((r) => r.vencedor === 'adversario').length;

  let vencedorFinal: ResultadoPartida['vencedorFinal'] = 'empate';
  if (vitoriasJogador > vitoriasAdversario) vencedorFinal = 'jogador';
  else if (vitoriasAdversario > vitoriasJogador) vencedorFinal = 'adversario';

  return { rounds, vitoriasJogador, vitoriasAdversario, vencedorFinal };
}
