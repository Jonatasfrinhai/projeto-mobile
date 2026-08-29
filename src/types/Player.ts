// Posições possíveis de um jogador (igual à categorização usada pela API do Cartola)
export type Posicao = 'goleiro' | 'zagueiro' | 'lateral' | 'meia' | 'atacante';

// Raridade calculada a partir da média dos atributos do jogador.
export type Raridade = 'comum' | 'raro' | 'epico' | 'lendario';

// Atributos usados nas cartas (Super Trunfo). Todos de 0 a 100.
export interface Atributos {
  ataque: number;
  defesa: number;
  velocidade: number;
  forma: number; // "momento atual" do jogador (ex: baseado na pontuação recente)
}

export interface Player {
  id: string;
  nome: string;
  clube: string;
  posicao: Posicao;
  foto?: string;
  atributos: Atributos;
  raridade: Raridade;
}

// Um "pacote" ganho ao vencer uma partida
export interface Pack {
  jogadores: Player[];
}
