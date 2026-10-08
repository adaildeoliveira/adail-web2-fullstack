import type { Permissao } from '../types/Permissao';
import PermissaoItem from './PermissaoItem';

interface Props {
  registros: Permissao[];
  carregando: boolean;
  ocupado: boolean;
  onEditar: (registro: Permissao) => void;
  onExcluir: (registro: Permissao) => void;
}

export default function PermissaoList({ registros, carregando, ocupado, onEditar, onExcluir }: Props) {
  return <div className="table-area" aria-busy={carregando}>
    {carregando && <p className="loading" role="status">Carregando permissões…</p>}
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabela de permissões">
      <table>
        <caption className="sr-only">Lista de permissões</caption>
        <thead><tr><th scope="col">ID</th><th scope="col">Nome</th><th scope="col">Descrição</th><th scope="col">Ações</th></tr></thead>
        <tbody>
          {registros.map(registro => <PermissaoItem key={registro.id} registro={registro} ocupado={ocupado} onEditar={onEditar} onExcluir={onExcluir} />)}
        </tbody>
      </table>
    </div>
    {!carregando && registros.length === 0 && <div className="empty-state"><span aria-hidden="true">—</span><strong>Nenhum registro por aqui</strong><p>Use o formulário para cadastrar a primeira permissão.</p></div>}
  </div>;
}
