import Cabecalho from './components/Cabecalho';
import UsuariosPage from './pages/UsuariosPage';
import PermissoesPage from './pages/PermissoesPage';
import ChamadosPage from './pages/ChamadosPage';

export default function App() {
  return (
    <>
      <Cabecalho />
      <main id="conteudo">
        <ChamadosPage />
        <UsuariosPage />
        <PermissoesPage />
      </main>
    </>
  );
}
