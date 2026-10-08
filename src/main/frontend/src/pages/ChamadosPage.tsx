import { useEffect, useState } from 'react';
import api, { mensagemErro } from '../services/api';
import type { Chamado, ChamadoEntrada } from '../types/Chamado';
import ChamadoForm from '../components/ChamadoForm';
import ChamadoList from '../components/ChamadoList';
import Mensagens from '../components/Mensagens';

export default function ChamadosPage() {
  const [registros, setRegistros] = useState<Chamado[]>([]);
  const [editando, setEditando] = useState<Chamado | null>(null);
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
      const resposta = await api.get<Chamado[]>('/chamados');
      setRegistros(resposta.data);
    } catch (erro) {
      setErro(mensagemErro(erro));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { void carregar(); }, []);

  async function salvar(dados: ChamadoEntrada) {
    setErro('');
    setSucesso('');
    setSalvando(true);
    try {
      if (editando) await api.put(`/chamados/${editando.id}`, dados);
      else await api.post('/chamados', dados);
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

  async function excluir(registro: Chamado) {
    if (!window.confirm(`Excluir "${registro.titulo}"? Esta ação não pode ser desfeita.`)) return;
    setSalvando(true);
    setErro('');
    setSucesso('');
    try {
      await api.delete(`/chamados/${registro.id}`);
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

  function editar(registro: Chamado) {
    setEditando(registro);
    setErro('');
    setSucesso('');
    document.getElementById('chamados-titulo')?.focus();
  }

  return <section id="chamados" aria-labelledby="chamados-heading" className="crud-section">
    <div className="section-heading">
      <div><h2 id="chamados-heading">Chamados <span className="count">{registros.length}</span></h2><p>Gerencie as solicitações de suporte.</p></div>
      <button type="button" onClick={() => void carregar()} disabled={ocupado}>Atualizar lista</button>
    </div>
    <Mensagens erro={erro} sucesso={sucesso} />
    <div className="crud-content">
      <ChamadoForm key={formulario} editando={editando} ocupado={ocupado} onSalvar={salvar} onCancelar={() => { setEditando(null); setFormulario(valor => valor + 1); }} />
      <ChamadoList registros={registros} carregando={carregando} ocupado={ocupado} onEditar={editar} onExcluir={excluir} />
    </div>
  </section>;
}
