package br.com.nexo.estoque.service;

import br.com.nexo.estoque.model.Produto;
import br.com.nexo.estoque.repository.ProdutoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Produto> listarTodos() {
        return repository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @Transactional(readOnly = true)
    public Optional<Produto> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Produto cadastrar(Produto produto) {
        validar(produto);
        produto.setId(null); // O ID e gerado pelo PostgreSQL.
        return repository.save(produto);
    }

    public Optional<Produto> atualizar(Long id, Produto dadosAtualizados) {
        if (!repository.existsById(id)) {
            return Optional.empty();
        }

        validar(dadosAtualizados);
        dadosAtualizados.setId(id);
        return Optional.of(repository.save(dadosAtualizados));
    }

    public boolean excluir(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }

    private void validar(Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("Os dados do produto não foram enviados.");
        }
        if (produto.getNome() == null || produto.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome do produto é obrigatório.");
        }
        if (produto.getPreco() == null || produto.getPreco().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Informe um preço válido.");
        }
        if (produto.getEstoque() == null || produto.getEstoque() < 0) {
            throw new IllegalArgumentException("Informe uma quantidade de estoque válida.");
        }
        if (produto.getDescricao() == null) {
            produto.setDescricao("");
        }
        if (produto.getNome().trim().length() > 90) {
            throw new IllegalArgumentException("O nome deve ter no máximo 90 caracteres.");
        }
        if (produto.getDescricao().trim().length() > 220) {
            throw new IllegalArgumentException("A descrição deve ter no máximo 220 caracteres.");
        }
        if (produto.getPreco().scale() > 2) {
            produto.setPreco(produto.getPreco().setScale(2, java.math.RoundingMode.HALF_UP));
        }

        produto.setNome(produto.getNome().trim());
        produto.setDescricao(produto.getDescricao().trim());
    }
}
