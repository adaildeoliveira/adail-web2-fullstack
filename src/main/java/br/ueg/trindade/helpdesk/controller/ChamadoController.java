package br.ueg.trindade.helpdesk.controller;

import br.ueg.trindade.helpdesk.model.Chamado;
import br.ueg.trindade.helpdesk.service.ChamadoService;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chamados")
@CrossOrigin(origins = "http://localhost:5173")
public class ChamadoController {
    private final ChamadoService service;

    public ChamadoController(ChamadoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Chamado> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Chamado buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Chamado> criar(@RequestBody Chamado dados) {
        Chamado registro = service.criar(dados);
        return ResponseEntity.created(URI.create("/api/chamados/" + registro.getId())).body(registro);
    }

    @PutMapping("/{id}")
    public Chamado atualizar(@PathVariable Long id, @RequestBody Chamado dados) {
        return service.atualizar(id, dados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
