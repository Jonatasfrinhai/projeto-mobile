import { Platform } from 'react-native';

// Endereço do backend do projeto "login-login" (porta 8082, definida no application.yml).
// - Web / iOS Simulator: "localhost" funciona normalmente.
// - Emulador Android: o emulador não enxerga "localhost" da máquina host, por isso usamos 10.0.2.2.
// - Celular físico: troque por o IP da sua máquina na mesma rede Wi-Fi (ex: 192.168.0.10).
const HOST = Platform.select({ android: '10.0.2.2', default: 'localhost' });
export const API_URL = `https://login-api-j9cl.onrender.com/fatec/login`;

export interface AuthClaims {
  userId: string;
  username: string;
  roles: string[];
}

// Lê o corpo do erro (quando existir) para mostrar uma mensagem melhor pro usuário.
async function tratarResposta(resp: Response): Promise<AuthClaims> {
  if (!resp.ok) {
    let mensagem = 'Não foi possível concluir a operação. Tente novamente.';

    if (resp.status === 401 || resp.status === 403) {
      mensagem = 'Usuário ou senha inválidos.';
    } else if (resp.status === 409) {
      mensagem = 'Esse usuário já existe.';
    }

    try {
      const corpo = await resp.json();
      if (corpo?.message) mensagem = corpo.message;
    } catch {
      // corpo vazio ou não é JSON: mantém a mensagem padrão acima
    }

    throw new Error(mensagem);
  }

  return resp.json();
}

// POST /fatec/login/v1/auth — autentica usuário e senha já cadastrados.
// O backend devolve o token JWT num cookie httpOnly (por isso credentials: 'include').
export async function login(username: string, password: string): Promise<AuthClaims> {
  const resp = await fetch(`${API_URL}/v1/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
  return tratarResposta(resp);
}

// POST /fatec/login/v1/create — cria um novo usuário e já efetua o login.
export async function cadastrar(
  username: string,
  password: string,
  email: string,
  cep: string
): Promise<AuthClaims> {
  const resp = await fetch(`${API_URL}/v1/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password, email, cep }),
  });
  return tratarResposta(resp);
}

// POST /fatec/login/v1/logout — limpa o cookie do token no backend.
// Feito em "melhor esforço": mesmo se o servidor estiver fora do ar, o app
// ainda limpa o estado local (ver AuthContext).
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/v1/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // sem conexão com o backend: segue o logout local mesmo assim
  }
}
