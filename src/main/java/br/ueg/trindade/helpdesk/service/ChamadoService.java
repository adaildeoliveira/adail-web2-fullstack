package br.ueg.trindade.helpdesk.service;

import br.ueg.trindade.helpdesk.model.Chamado;
import br.ueg.trindade.helpdesk.repository.ChamadoRepository;
import br.ueg.trindade.helpdesk.exception.RecursoNaoEncontradoException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ChamadoService {
    private final ChamadoRepository repository;

    public ChamadoService(ChamadoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Chamado> listarTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Chamado buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Chamado não encontrado."));
    }

    public Chamado criar(Chamado dados) {
        validar(dados);
        Chamado registro = new Chamado();
        copiarDados(dados, registro);
        return repository.save(registro);
    }

    public Chamado atualizar(Long id, Chamado dados) {
        Chamado registro = buscarPorId(id);
        validar(dados);
        copiarDados(dados, registro);
        return repository.save(registro);
    }

    public void excluir(Long id) {
        repository.delete(buscarPorId(id));
    }

    private void copiarDados(Chamado dados, Chamado registro) {
        registro.setTitulo(dados.getTitulo());
        registro.setDescricao(dados.getDescricao());
        registro.setStatus(dados.getStatus());
    }

    private void validar(Chamado dados) {
        if (dados.getTitulo() == null || dados.getTitulo().isBlank()) {
            throw new IllegalArgumentException("O título do chamado é obrigatório.");
        }
        if (dados.getDescricao() == null || dados.getDescricao().isBlank()) {
            throw new IllegalArgumentException("A descrição do chamado é obrigatória.");
        }
        if (dados.getStatus() == null) {
            throw new IllegalArgumentException("O status do chamado é obrigatório.");
        }
    }
}
