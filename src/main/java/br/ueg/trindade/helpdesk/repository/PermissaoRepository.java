package br.ueg.trindade.helpdesk.repository;

import br.ueg.trindade.helpdesk.model.Permissao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {
}
