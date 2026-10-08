// Respostas da API nunca incluem senha.
export interface Usuario {
  id: number;
  nome: string;
  username: string;
  email: string;
}

export interface UsuarioEntrada {
  nome: string;
  username: string;
  email: string;
  senha?: string;
}
