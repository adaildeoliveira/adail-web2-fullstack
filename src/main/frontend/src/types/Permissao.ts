export interface Permissao {
  id: number;
  nome: string;
  descricao: string;
}

export type PermissaoEntrada = Omit<Permissao, 'id'>;
