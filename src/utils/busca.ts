import { Player } from '../types/Player';

// Remove acentos pra busca não se importar com "é" vs "e", por exemplo.
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function combina(jogador: Player, termo: string): boolean {
  if (!termo) return true;
  const alvo = normalizar(`${jogador.nome} ${jogador.clube} ${jogador.posicao}`);
  return alvo.includes(normalizar(termo));
}
