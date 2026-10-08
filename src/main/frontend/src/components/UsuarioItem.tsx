import type { Usuario } from '../types/Usuario';

interface Props {
  registro: Usuario;
  ocupado: boolean;
  onEditar: (registro: Usuario) => void;
  onExcluir: (registro: Usuario) => void;
}

export default function UsuarioItem({ registro, ocupado, onEditar, onExcluir }: Props) {
  return <tr>
    <td className="record-id">#{registro.id}</td>
    <td><strong>{registro.nome}</strong></td><td>{registro.username}</td><td>{registro.email}</td>
    <td><div className="row-actions">
      <button type="button" disabled={ocupado} onClick={() => onEditar(registro)} aria-label={`Editar ${registro.nome}`}>Editar</button>
      <button type="button" className="danger" disabled={ocupado} onClick={() => onExcluir(registro)} aria-label={`Excluir ${registro.nome}`}>Excluir</button>
    </div></td>
  </tr>;
}
