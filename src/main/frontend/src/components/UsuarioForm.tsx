import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Usuario, UsuarioEntrada } from '../types/Usuario';

interface Props {
  editando: Usuario | null;
  ocupado: boolean;
  onSalvar: (dados: UsuarioEntrada) => Promise<void>;
  onCancelar: () => void;
}

export default function UsuarioForm({ editando, ocupado, onSalvar, onCancelar }: Props) {
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    setNome(editando?.nome ?? '');
    setUsername(editando?.username ?? '');
    setEmail(editando?.email ?? '');
    setSenha('');
  }, [editando]);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    await onSalvar({ nome, username, email, senha });
  }

  return <form onSubmit={enviar} aria-label="Formulário de usuário">
    <h3>{editando ? 'Editar usuário' : 'Cadastrar usuário'}</h3>
    <p className="form-hint">{editando ? `Alterando o registro #${editando.id}.` : 'Preencha os dados abaixo.'}</p>
    <fieldset disabled={ocupado}>
      <label htmlFor="usuarios-nome">Nome</label>
      <input id="usuarios-nome" type="text" value={nome} onChange={e => setNome(e.target.value)} required maxLength={255} />
      <label htmlFor="usuarios-username">Username</label>
      <input id="usuarios-username" type="text" value={username} onChange={e => setUsername(e.target.value)} required maxLength={255} />
      <label htmlFor="usuarios-email">E-mail</label>
      <input id="usuarios-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={255} />
      <label htmlFor="usuarios-senha">Senha</label>
      <input id="usuarios-senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} autoComplete="new-password" aria-describedby="senha-ajuda" maxLength={255} />
      <small id="senha-ajuda">{editando ? "Deixe em branco para manter a senha atual." : "A senha não será exibida na listagem."}</small>
      <div className="form-actions">
        <button className="primary" type="submit">{ocupado ? 'Aguarde…' : editando ? 'Salvar alterações' : 'Cadastrar'}</button>
        {editando && <button type="button" onClick={onCancelar}>Cancelar</button>}
      </div>
    </fieldset>
  </form>;
}
