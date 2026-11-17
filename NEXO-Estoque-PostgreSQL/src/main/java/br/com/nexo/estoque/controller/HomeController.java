package br.com.nexo.estoque.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Encaminha a rota inicial do servidor para a página principal do frontend.
 */
@Controller
public class HomeController {

    @GetMapping("/")
    public String paginaInicial() {
        return "forward:/index.html";
    }
}
