package br.ueg.trindade.helpdesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;

// Mantém os filtros Security, mas não cria usuário/senha padrão para login.
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class HelpdeskApplication {
    public static void main(String[] args) {
        SpringApplication.run(HelpdeskApplication.class, args);
    }
}
