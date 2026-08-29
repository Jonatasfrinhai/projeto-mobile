import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player, Posicao, Atributos } from '../types/Player';
import { calcularPoder, atribuirRaridades } from '../utils/raridade';

const CARTOLA_URL = 'https://api.cartola.globo.com/atletas/mercado';
const CACHE_KEY = '@futebol_cards:jogadores_snapshot';

// Mapeia o código de posição do Cartola pro nosso tipo Posicao.
// 1 = Goleiro, 2 = Lateral, 3 = Zagueiro, 4 = Meia, 5 = Atacante, 6 = Técnico (ignorado)
const POSICAO_MAP: Record<number, Posicao | null> = {
  1: 'goleiro',
  2: 'lateral',
  3: 'zagueiro',
  4: 'meia',
  5: 'atacante',
  6: null,
};

interface CartolaAtleta {
  atleta_id: number;
  apelido: string;
  foto?: string;
  posicao_id: number;
  clube_id: number;
  pontos_num?: number;
  media_num?: number;
  jogos_num?: number;
}

interface CartolaResponse {
  atletas: CartolaAtleta[];
  clubes: Record<string, { nome: string }>;
}

// Formato intermediário, antes de saber a raridade (que só dá pra calcular
// depois de ver o "poder" de TODOS os jogadores, pra poder ranquear).
interface JogadorSemRaridade {
  id: string;
  nome: string;
  clube: string;
  posicao: Posicao;
  foto?: string;
  atributos: Atributos;
}

// Converte a pontuação/média real do Cartola em atributos de 0-100 para a carta.
// É uma aproximação simples: normaliza os valores num intervalo jogável.
function gerarAtributos(atleta: CartolaAtleta, posicao: Posicao): Atributos {
  const media = atleta.media_num ?? 3;
  const forma = Math.max(10, Math.min(100, Math.round((media / 12) * 100)));

  // Ataque e defesa variam conforme a posição, com um pouco de aleatoriedade
  // pra deixar as cartas menos repetitivas (mas sempre coerente com a posição real).
  const base = Math.max(20, Math.min(95, Math.round(forma * 0.8 + Math.random() * 15)));

  const perfisPorPosicao: Record<Posicao, Partial<Atributos>> = {
    goleiro: { defesa: base, ataque: Math.round(base * 0.2) },
    zagueiro: { defesa: base, ataque: Math.round(base * 0.35) },
    lateral: { defesa: Math.round(base * 0.85), ataque: Math.round(base * 0.6) },
    meia: { defesa: Math.round(base * 0.5), ataque: Math.round(base * 0.75) },
    atacante: { defesa: Math.round(base * 0.25), ataque: base },
  };

  return {
    ataque: perfisPorPosicao[posicao].ataque ?? 50,
    defesa: perfisPorPosicao[posicao].defesa ?? 50,
    velocidade: Math.max(30, Math.min(99, Math.round(50 + Math.random() * 40))),
    forma,
  };
}

// A API do Cartola devolve a foto com um placeholder "FORMATO" no lugar do
// tamanho da imagem (ex: 220x220). Sem substituir isso, a URL não abre.
function resolverFoto(foto?: string): string | undefined {
  if (!foto) return undefined;
  return foto.replace('FORMATO', '220x220');
}

function montarSemRaridade(atleta: CartolaAtleta, nomeClube: string): JogadorSemRaridade | null {
  const posicao = POSICAO_MAP[atleta.posicao_id];
  if (!posicao) return null; // ignora técnicos

  return {
    id: String(atleta.atleta_id),
    nome: atleta.apelido,
    clube: nomeClube,
    posicao,
    foto: resolverFoto(atleta.foto),
    atributos: gerarAtributos(atleta, posicao),
  };
}

// Busca os jogadores na API real. Se falhar (ex: mercado fechado, sem internet),
// cai pro cache local salvo anteriormente.
export async function buscarJogadores(): Promise<Player[]> {
  try {
    const resp = await fetch(CARTOLA_URL);
    if (!resp.ok) throw new Error('Resposta não-OK da API do Cartola');
    const data: CartolaResponse = await resp.json();

    const semRaridade = data.atletas
      .map((a) => montarSemRaridade(a, data.clubes[String(a.clube_id)]?.nome ?? 'Desconhecido'))
      .filter((p): p is JogadorSemRaridade => p !== null);

    // Só dá pra saber quem é "lendário" depois de comparar com os outros —
    // mas a comparação precisa ser DENTRO da mesma posição. Se comparasse
    // todo mundo junto, uma posição cujo atributo principal tem uma escala
    // naturalmente mais alta (ex: velocidade do lateral, sorteada de 30-99)
    // dominaria o topo do ranking só por causa da escala, não da qualidade.
    const porPosicao: Record<Posicao, JogadorSemRaridade[]> = {
      goleiro: [],
      zagueiro: [],
      lateral: [],
      meia: [],
      atacante: [],
    };
    semRaridade.forEach((j) => porPosicao[j.posicao].push(j));

    const raridades = new Map<JogadorSemRaridade, Player['raridade']>();
    (Object.keys(porPosicao) as Posicao[]).forEach((posicao) => {
      const mapaDaPosicao = atribuirRaridades(porPosicao[posicao], (j) =>
        calcularPoder(j.atributos, j.posicao)
      );
      mapaDaPosicao.forEach((raridade, jogador) => raridades.set(jogador, raridade));
    });

    const jogadores: Player[] = semRaridade.map((j) => ({
      ...j,
      raridade: raridades.get(j)!,
    }));

    // Salva um "snapshot" local pra não depender da API toda hora
    // (preço/forma não mudam durante a sessão do usuário).
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(jogadores));
    return jogadores;
  } catch (e) {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
    throw e;
  }
}
