package br.ueg.trindade.helpdesk.controller;

import br.ueg.trindade.helpdesk.model.Usuario;
import br.ueg.trindade.helpdesk.service.UsuarioService;
import br.ueg.trindade.helpdesk.dto.UsuarioEntrada;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody UsuarioEntrada dados) {
        Usuario registro = service.criar(dados);
        return ResponseEntity.created(URI.create("/api/usuarios/" + registro.getId())).body(registro);
    }

    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable Long id, @RequestBody UsuarioEntrada dados) {
        return service.atualizar(id, dados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
