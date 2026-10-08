import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Chamado, ChamadoEntrada, StatusChamado } from '../types/Chamado';

interface Props {
  editando: Chamado | null;
  ocupado: boolean;
  onSalvar: (dados: ChamadoEntrada) => Promise<void>;
  onCancelar: () => void;
}

export default function ChamadoForm({ editando, ocupado, onSalvar, onCancelar }: Props) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<StatusChamado>('ABERTO');

  useEffect(() => {
    setTitulo(editando?.titulo ?? '');
    setDescricao(editando?.descricao ?? '');
    setStatus(editando?.status ?? 'ABERTO');
  }, [editando]);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    await onSalvar({ titulo, descricao, status });
  }

  return <form onSubmit={enviar} aria-label="Formulário de chamado">
    <h3>{editando ? 'Editar chamado' : 'Cadastrar chamado'}</h3>
    <p className="form-hint">{editando ? `Alterando o registro #${editando.id}.` : 'Preencha os dados abaixo.'}</p>
    <fieldset disabled={ocupado}>
      <label htmlFor="chamados-titulo">Título</label>
      <input id="chamados-titulo" type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required maxLength={255} />
      <label htmlFor="chamados-descricao">Descrição</label>
      <textarea id="chamados-descricao" value={descricao} onChange={e => setDescricao(e.target.value)} required maxLength={4000} rows={3} />
      <label htmlFor="chamados-status">Status</label>
      <select id="chamados-status" value={status} onChange={e => setStatus(e.target.value as StatusChamado)}>
        <option value="ABERTO">Aberto</option>
        <option value="EM_ATENDIMENTO">Em atendimento</option>
        <option value="CONCLUIDO">Concluído</option>
      </select>
      <div className="form-actions">
        <button className="primary" type="submit">{ocupado ? 'Aguarde…' : editando ? 'Salvar alterações' : 'Cadastrar'}</button>
        {editando && <button type="button" onClick={onCancelar}>Cancelar</button>}
      </div>
    </fieldset>
  </form>;
}
