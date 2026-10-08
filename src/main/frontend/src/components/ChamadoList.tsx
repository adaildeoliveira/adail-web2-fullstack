import type { Chamado } from '../types/Chamado';
import ChamadoItem from './ChamadoItem';

interface Props {
  registros: Chamado[];
  carregando: boolean;
  ocupado: boolean;
  onEditar: (registro: Chamado) => void;
  onExcluir: (registro: Chamado) => void;
}

export default function ChamadoList({ registros, carregando, ocupado, onEditar, onExcluir }: Props) {
  return <div className="table-area" aria-busy={carregando}>
    {carregando && <p className="loading" role="status">Carregando chamados…</p>}
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabela de chamados">
      <table>
        <caption className="sr-only">Lista de chamados</caption>
        <thead><tr><th scope="col">ID</th><th scope="col">Chamado</th><th scope="col">Status</th><th scope="col">Ações</th></tr></thead>
        <tbody>
          {registros.map(registro => <ChamadoItem key={registro.id} registro={registro} ocupado={ocupado} onEditar={onEditar} onExcluir={onExcluir} />)}
        </tbody>
      </table>
    </div>
    {!carregando && registros.length === 0 && <div className="empty-state"><span aria-hidden="true">—</span><strong>Nenhum registro por aqui</strong><p>Use o formulário para cadastrar o primeiro chamado.</p></div>}
  </div>;
}
