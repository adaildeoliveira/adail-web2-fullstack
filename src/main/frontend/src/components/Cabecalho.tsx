import { useEffect, useState } from 'react';

export default function Cabecalho() {
  const [ativo, setAtivo] = useState('chamados');

  useEffect(() => {
    // Destaca a seção visível sem interferir nos dados ou formulários.
    function acompanharRolagem() {
      const secoes = document.querySelectorAll('.crud-section');
      let atual = 'chamados';
      for (const secao of secoes) {
        if (secao.getBoundingClientRect().top <= window.innerHeight * 0.35) atual = secao.id;
      }
      // A última seção pode ser curta e não alcançar o topo da janela.
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) atual = 'permissoes';
      setAtivo(atual);
    }
    acompanharRolagem();
    window.addEventListener('scroll', acompanharRolagem, { passive: true });
    return () => window.removeEventListener('scroll', acompanharRolagem);
  }, []);

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="sidebar">
        <h1 className="brand"><a href="#chamados">HELPDESK</a></h1>
        <p className="nav-label">GERENCIAMENTO</p>
        <nav aria-label="Seções">
          <a href="#chamados" aria-current={ativo === 'chamados' ? 'location' : undefined} onClick={() => setAtivo('chamados')}>Chamados</a>
          <a href="#usuarios" aria-current={ativo === 'usuarios' ? 'location' : undefined} onClick={() => setAtivo('usuarios')}>Usuários</a>
          <a href="#permissoes" aria-current={ativo === 'permissoes' ? 'location' : undefined} onClick={() => setAtivo('permissoes')}>Permissões</a>
        </nav>
      </header>
    </>
  );
}
