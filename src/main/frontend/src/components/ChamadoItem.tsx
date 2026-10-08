import type { Chamado } from '../types/Chamado';
import { nomesStatus } from '../types/Chamado';

interface Props {
  registro: Chamado;
  ocupado: boolean;
  onEditar: (registro: Chamado) => void;
  onExcluir: (registro: Chamado) => void;
}

export default function ChamadoItem({ registro, ocupado, onEditar, onExcluir }: Props) {
  return <tr>
    <td className="record-id">#{registro.id}</td>
    <td><strong>{registro.titulo}</strong><p className="description">{registro.descricao}</p></td>
    <td><span className={`status status-${registro.status.toLowerCase()}`}>{nomesStatus[registro.status]}</span></td>
    <td><div className="row-actions">
      <button type="button" disabled={ocupado} onClick={() => onEditar(registro)} aria-label={`Editar ${registro.titulo}`}>Editar</button>
      <button type="button" className="danger" disabled={ocupado} onClick={() => onExcluir(registro)} aria-label={`Excluir ${registro.titulo}`}>Excluir</button>
    </div></td>
  </tr>;
}
