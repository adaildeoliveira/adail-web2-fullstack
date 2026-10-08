package br.ueg.trindade.helpdesk.controller;

import br.ueg.trindade.helpdesk.model.Permissao;
import br.ueg.trindade.helpdesk.service.PermissaoService;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/permissoes")
@CrossOrigin(origins = "http://localhost:5173")
public class PermissaoController {
    private final PermissaoService service;

    public PermissaoController(PermissaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Permissao> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Permissao buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Permissao> criar(@RequestBody Permissao dados) {
        Permissao registro = service.criar(dados);
        return ResponseEntity.created(URI.create("/api/permissoes/" + registro.getId())).body(registro);
    }

    @PutMapping("/{id}")
    public Permissao atualizar(@PathVariable Long id, @RequestBody Permissao dados) {
        return service.atualizar(id, dados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
