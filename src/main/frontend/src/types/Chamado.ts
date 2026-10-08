export type StatusChamado = 'ABERTO' | 'EM_ATENDIMENTO' | 'CONCLUIDO';

export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  status: StatusChamado;
}

export type ChamadoEntrada = Omit<Chamado, 'id'>;

export const nomesStatus: Record<StatusChamado, string> = {
  ABERTO: 'Aberto',
  EM_ATENDIMENTO: 'Em atendimento',
  CONCLUIDO: 'Concluído',
};
