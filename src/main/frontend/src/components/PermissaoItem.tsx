import type { Permissao } from '../types/Permissao';

interface Props {
  registro: Permissao;
  ocupado: boolean;
  onEditar: (registro: Permissao) => void;
  onExcluir: (registro: Permissao) => void;
}

export default function PermissaoItem({ registro, ocupado, onEditar, onExcluir }: Props) {
  return <tr>
    <td className="record-id">#{registro.id}</td>
    <td><strong>{registro.nome}</strong></td><td className="description">{registro.descricao}</td>
    <td><div className="row-actions">
      <button type="button" disabled={ocupado} onClick={() => onEditar(registro)} aria-label={`Editar ${registro.nome}`}>Editar</button>
      <button type="button" className="danger" disabled={ocupado} onClick={() => onExcluir(registro)} aria-label={`Excluir ${registro.nome}`}>Excluir</button>
    </div></td>
  </tr>;
}
