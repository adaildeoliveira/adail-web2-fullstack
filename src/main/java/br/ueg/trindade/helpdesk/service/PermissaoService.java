package br.ueg.trindade.helpdesk.service;

import br.ueg.trindade.helpdesk.model.Permissao;
import br.ueg.trindade.helpdesk.repository.PermissaoRepository;
import br.ueg.trindade.helpdesk.exception.RecursoNaoEncontradoException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PermissaoService {
    private final PermissaoRepository repository;

    public PermissaoService(PermissaoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Permissao> listarTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Permissao buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Permissao não encontrado."));
    }

    public Permissao criar(Permissao dados) {
        Permissao registro = new Permissao();
        copiarDados(dados, registro);
        return repository.save(registro);
    }

    public Permissao atualizar(Long id, Permissao dados) {
        Permissao registro = buscarPorId(id);
        copiarDados(dados, registro);
        return repository.save(registro);
    }

    public void excluir(Long id) {
        repository.delete(buscarPorId(id));
    }

    private void copiarDados(Permissao dados, Permissao registro) {
        registro.setNome(dados.getNome());
        registro.setDescricao(dados.getDescricao());
    }
}
