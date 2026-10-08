import type { Usuario } from '../types/Usuario';
import UsuarioItem from './UsuarioItem';

interface Props {
  registros: Usuario[];
  carregando: boolean;
  ocupado: boolean;
  onEditar: (registro: Usuario) => void;
  onExcluir: (registro: Usuario) => void;
}

export default function UsuarioList({ registros, carregando, ocupado, onEditar, onExcluir }: Props) {
  return <div className="table-area" aria-busy={carregando}>
    {carregando && <p className="loading" role="status">Carregando usuários…</p>}
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabela de usuários">
      <table>
        <caption className="sr-only">Lista de usuários</caption>
        <thead><tr><th scope="col">ID</th><th scope="col">Nome</th><th scope="col">Username</th><th scope="col">E-mail</th><th scope="col">Ações</th></tr></thead>
        <tbody>
          {registros.map(registro => <UsuarioItem key={registro.id} registro={registro} ocupado={ocupado} onEditar={onEditar} onExcluir={onExcluir} />)}
        </tbody>
      </table>
    </div>
    {!carregando && registros.length === 0 && <div className="empty-state"><span aria-hidden="true">—</span><strong>Nenhum registro por aqui</strong><p>Use o formulário para cadastrar o primeiro usuário.</p></div>}
  </div>;
}
