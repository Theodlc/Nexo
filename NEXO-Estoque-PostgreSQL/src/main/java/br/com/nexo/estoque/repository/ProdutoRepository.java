package br.com.nexo.estoque.repository;

import br.com.nexo.estoque.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * O Spring Data JPA implementa automaticamente os metodos basicos de acesso ao banco.
 */
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
