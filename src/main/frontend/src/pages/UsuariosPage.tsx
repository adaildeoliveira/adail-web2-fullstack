import { useEffect, useState } from 'react';
import api, { mensagemErro } from '../services/api';
import type { Usuario, UsuarioEntrada } from '../types/Usuario';
import UsuarioForm from '../components/UsuarioForm';
import UsuarioList from '../components/UsuarioList';
import Mensagens from '../components/Mensagens';

export default function UsuariosPage() {
  const [registros, setRegistros] = useState<Usuario[]>([]);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [formulario, setFormulario] = useState(0);
  const ocupado = carregando || salvando;

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const resposta = await api.get<Usuario[]>('/usuarios');
      setRegistros(resposta.data);
    } catch (erro) {
      setErro(mensagemErro(erro));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { void carregar(); }, []);

  async function salvar(dados: UsuarioEntrada) {
    setErro('');
    setSucesso('');
    setSalvando(true);
    try {
      if (editando) await api.put(`/usuarios/${editando.id}`, dados);
      else await api.post('/usuarios', dados);
      setSucesso(editando ? 'Alterações salvas com sucesso.' : 'Cadastro realizado com sucesso.');
      setEditando(null);
      setFormulario(valor => valor + 1);
      // O formulário só é limpo após a API confirmar a gravação.
      await carregar();
    } catch (erro) {
      setErro(mensagemErro(erro));
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(registro: Usuario) {
    if (!window.confirm(`Excluir "${registro.nome}"? Esta ação não pode ser desfeita.`)) return;
    setSalvando(true);
    setErro('');
    setSucesso('');
    try {
      await api.delete(`/usuarios/${registro.id}`);
      if (editando?.id === registro.id) {
        setEditando(null);
        setFormulario(valor => valor + 1);
      }
      setSucesso('Registro excluído com sucesso.');
      await carregar();
    } catch (erro) {
      setErro(mensagemErro(erro));
    } finally {
      setSalvando(false);
    }
  }

  function editar(registro: Usuario) {
    setEditando(registro);
    setErro('');
    setSucesso('');
    document.getElementById('usuarios-nome')?.focus();
  }

  return <section id="usuarios" aria-labelledby="usuarios-titulo" className="crud-section">
    <div className="section-heading">
      <div><h2 id="usuarios-titulo">Usuários <span className="count">{registros.length}</span></h2><p>Cadastre e mantenha os usuários do sistema.</p></div>
      <button type="button" onClick={() => void carregar()} disabled={ocupado}>Atualizar lista</button>
    </div>
    <Mensagens erro={erro} sucesso={sucesso} />
    <div className="crud-content">
      <UsuarioForm key={formulario} editando={editando} ocupado={ocupado} onSalvar={salvar} onCancelar={() => { setEditando(null); setFormulario(valor => valor + 1); }} />
      <UsuarioList registros={registros} carregando={carregando} ocupado={ocupado} onEditar={editar} onExcluir={excluir} />
    </div>
  </section>;
}
