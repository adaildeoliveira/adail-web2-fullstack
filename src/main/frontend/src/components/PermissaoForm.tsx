import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Permissao, PermissaoEntrada } from '../types/Permissao';

interface Props {
  editando: Permissao | null;
  ocupado: boolean;
  onSalvar: (dados: PermissaoEntrada) => Promise<void>;
  onCancelar: () => void;
}

export default function PermissaoForm({ editando, ocupado, onSalvar, onCancelar }: Props) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    setNome(editando?.nome ?? '');
    setDescricao(editando?.descricao ?? '');
  }, [editando]);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    await onSalvar({ nome, descricao });
  }

  return <form onSubmit={enviar} aria-label="Formulário de permissão">
    <h3>{editando ? 'Editar permissão' : 'Cadastrar permissão'}</h3>
    <p className="form-hint">{editando ? `Alterando o registro #${editando.id}.` : 'Preencha os dados abaixo.'}</p>
    <fieldset disabled={ocupado}>
      <label htmlFor="permissoes-nome">Nome</label>
      <input id="permissoes-nome" type="text" value={nome} onChange={e => setNome(e.target.value)} required maxLength={255} />
      <label htmlFor="permissoes-descricao">Descrição</label>
      <textarea id="permissoes-descricao" value={descricao} onChange={e => setDescricao(e.target.value)} required maxLength={4000} rows={3} />
      <div className="form-actions">
        <button className="primary" type="submit">{ocupado ? 'Aguarde…' : editando ? 'Salvar alterações' : 'Cadastrar'}</button>
        {editando && <button type="button" onClick={onCancelar}>Cancelar</button>}
      </div>
    </fieldset>
  </form>;
}
