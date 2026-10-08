import { useEffect, useState } from 'react';
import api, { mensagemErro } from '../services/api';
import type { Permissao, PermissaoEntrada } from '../types/Permissao';
import PermissaoForm from '../components/PermissaoForm';
import PermissaoList from '../components/PermissaoList';
import Mensagens from '../components/Mensagens';

export default function PermissoesPage() {
  const [registros, setRegistros] = useState<Permissao[]>([]);
  const [editando, setEditando] = useState<Permissao | null>(null);
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
      const resposta = await api.get<Permissao[]>('/permissoes');
      setRegistros(resposta.data);
    } catch (erro) {
      setErro(mensagemErro(erro));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { void carregar(); }, []);

  async function salvar(dados: PermissaoEntrada) {
    setErro('');
    setSucesso('');
    setSalvando(true);
    try {
      if (editando) await api.put(`/permissoes/${editando.id}`, dados);
      else await api.post('/permissoes', dados);
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

  async function excluir(registro: Permissao) {
    if (!window.confirm(`Excluir "${registro.nome}"? Esta ação não pode ser desfeita.`)) return;
    setSalvando(true);
    setErro('');
    setSucesso('');
    try {
      await api.delete(`/permissoes/${registro.id}`);
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

  function editar(registro: Permissao) {
    setEditando(registro);
    setErro('');
    setSucesso('');
    document.getElementById('permissoes-nome')?.focus();
  }

  return <section id="permissoes" aria-labelledby="permissoes-titulo" className="crud-section">
    <div className="section-heading">
      <div><h2 id="permissoes-titulo">Permissões <span className="count">{registros.length}</span></h2><p>Gerencie o cadastro de permissões disponíveis.</p></div>
      <button type="button" onClick={() => void carregar()} disabled={ocupado}>Atualizar lista</button>
    </div>
    <Mensagens erro={erro} sucesso={sucesso} />
    <div className="crud-content">
      <PermissaoForm key={formulario} editando={editando} ocupado={ocupado} onSalvar={salvar} onCancelar={() => { setEditando(null); setFormulario(valor => valor + 1); }} />
      <PermissaoList registros={registros} carregando={carregando} ocupado={ocupado} onEditar={editar} onExcluir={excluir} />
    </div>
  </section>;
}
