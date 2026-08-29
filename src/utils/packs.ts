import { Player, Posicao } from '../types/Player';

const POSICOES: Posicao[] = ['goleiro', 'zagueiro', 'lateral', 'meia', 'atacante'];

function sortearUm(lista: Player[]): Player {
  return lista[Math.floor(Math.random() * lista.length)];
}

// Time inicial: 1 jogador aleatório de cada posição, pra já dar pra jogar
// uma partida completa assim que a conta é criada.
export function gerarTimeInicial(todosJogadores: Player[]): Player[] {
  return POSICOES.map((posicao) => {
    const candidatos = todosJogadores.filter((j) => j.posicao === posicao);
    return sortearUm(candidatos);
  });
}

// Pacote ganho ao vencer uma partida: 2 jogadores aleatórios (de posições aleatórias).
export function gerarPacote(todosJogadores: Player[], quantidade = 2): Player[] {
  const pacote: Player[] = [];
  for (let i = 0; i < quantidade; i++) {
    pacote.push(sortearUm(todosJogadores));
  }
  return pacote;
}
