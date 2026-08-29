import { Atributos, Posicao, Raridade } from '../types/Player';

// Cor de destaque de cada raridade, usada na borda/faixa da carta.
export const CORES_RARIDADE: Record<Raridade, string> = {
  comum: '#9e9e9e',
  raro: '#2f80ed',
  epico: '#9b51e0',
  lendario: '#f2a900',
};

export const LABEL_RARIDADE: Record<Raridade, string> = {
  comum: 'Comum',
  raro: 'Raro',
  epico: 'Épico',
  lendario: 'Lendário',
};

// Atributo que mais importa pra julgar a qualidade de um jogador NAQUELA posição.
// Um zagueiro sempre tem ataque baixo de propósito, então usar a média dos 4
// atributos jogava quase todo mundo pra raridade "comum". Usando só o atributo
// relevante da posição, a comparação fica justa.
const ATRIBUTO_PRINCIPAL: Record<Posicao, keyof Atributos> = {
  goleiro: 'defesa',
  zagueiro: 'defesa',
  lateral: 'velocidade',
  meia: 'ataque',
  atacante: 'ataque',
};

// "Poder" do jogador pra fins de raridade: atributo principal da posição + forma.
export function calcularPoder(atributos: Atributos, posicao: Posicao): number {
  const principal = atributos[ATRIBUTO_PRINCIPAL[posicao]];
  return (principal + atributos.forma) / 2;
}

// Define a raridade de cada jogador pela POSIÇÃO DELE NO RANKING de poder entre
// todos os jogadores (percentil), em vez de uma faixa fixa de número. Isso
// garante que sempre existam jogadores em todas as raridades, não importa a
// escala dos números gerados — sempre tem um "top 5%" (lendário), por exemplo.
export function atribuirRaridades<T>(
  itens: T[],
  obterPoder: (item: T) => number
): Map<T, Raridade> {
  const ordenado = [...itens].sort((a, b) => obterPoder(b) - obterPoder(a));
  const total = ordenado.length;
  const mapa = new Map<T, Raridade>();

  ordenado.forEach((item, index) => {
    const percentil = total > 1 ? index / (total - 1) : 0; // 0 = melhor, 1 = pior
    let raridade: Raridade;
    if (percentil < 0.05) raridade = 'lendario';
    else if (percentil < 0.2) raridade = 'epico';
    else if (percentil < 0.5) raridade = 'raro';
    else raridade = 'comum';
    mapa.set(item, raridade);
  });

  return mapa;
}
