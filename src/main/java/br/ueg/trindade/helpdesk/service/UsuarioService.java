package br.ueg.trindade.helpdesk.service;

import br.ueg.trindade.helpdesk.model.Usuario;
import br.ueg.trindade.helpdesk.repository.UsuarioRepository;
import br.ueg.trindade.helpdesk.exception.RecursoNaoEncontradoException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.ueg.trindade.helpdesk.dto.UsuarioEntrada;

@Service
@Transactional
public class UsuarioService {
    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario não encontrado."));
    }

    public Usuario criar(UsuarioEntrada dados) {
        Usuario registro = new Usuario();
        copiarDados(dados, registro);
        return repository.save(registro);
    }

    public Usuario atualizar(Long id, UsuarioEntrada dados) {
        Usuario registro = buscarPorId(id);
        copiarDados(dados, registro);
        return repository.save(registro);
    }

    public void excluir(Long id) {
        repository.delete(buscarPorId(id));
    }

    private void copiarDados(UsuarioEntrada dados, Usuario registro) {
        registro.setNome(dados.nome());
        registro.setUsername(dados.username());
        // Na edição, senha omitida ou vazia mantém a senha atual.
        if (dados.senha() != null && !dados.senha().isBlank()) {
            registro.setSenha(dados.senha());
        }
        registro.setEmail(dados.email());
    }
}
