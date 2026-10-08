package br.ueg.trindade.helpdesk.repository;

import br.ueg.trindade.helpdesk.model.Chamado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChamadoRepository extends JpaRepository<Chamado, Long> {
}
