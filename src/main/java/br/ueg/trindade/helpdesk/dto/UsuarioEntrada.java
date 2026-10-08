package br.ueg.trindade.helpdesk.dto;

// Recebe a senha sem precisar expô-la na entidade serializada nas respostas.
public record UsuarioEntrada(String nome, String username, String senha, String email) {
}
