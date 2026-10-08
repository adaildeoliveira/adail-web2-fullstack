package br.ueg.trindade.helpdesk.controller;

import br.ueg.trindade.helpdesk.exception.RecursoNaoEncontradoException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ErroControllerAdvice {
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<Map<String, String>> naoEncontrado(RecursoNaoEncontradoException erro) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensagem", erro.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> dadosInvalidos(IllegalArgumentException erro) {
        return ResponseEntity.badRequest().body(Map.of("mensagem", erro.getMessage()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> jsonInvalido() {
        // Não devolver a mensagem interna: ela pode conter valores enviados, como senha.
        return ResponseEntity.badRequest().body(Map.of("mensagem", "JSON inválido. Confira os campos e o status informado."));
    }
}
