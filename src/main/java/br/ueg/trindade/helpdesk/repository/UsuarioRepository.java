package br.ueg.trindade.helpdesk.repository;

import br.ueg.trindade.helpdesk.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
