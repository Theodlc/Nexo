const API_URL = "/produtos";
const LOW_STOCK_LIMIT = 5;

const ui = {
    form: document.getElementById("product-form"),
    id: document.getElementById("product-id"),
    name: document.getElementById("product-name"),
    description: document.getElementById("product-description"),
    price: document.getElementById("product-price"),
    stock: document.getElementById("product-stock"),
    formTitle: document.getElementById("form-title"),
    formSubtitle: document.getElementById("form-subtitle"),
    submit: document.getElementById("submit-button"),
    cancelEdit: document.getElementById("cancel-edit"),
    feedback: document.getElementById("form-feedback"),
    tableBody: document.getElementById("table-body"),
    emptyState: document.getElementById("empty-state"),
    search: document.getElementById("search-input"),
    resultCount: document.getElementById("result-count"),
    toast: document.getElementById("toast"),
    apiDot: document.getElementById("sidebar-dot"),
    apiLabel: document.getElementById("sidebar-connection"),
    lastUpdated: document.getElementById("last-updated")
};

let produtos = [];
let toastTimer;

const moeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

iniciarAplicacao();

function iniciarAplicacao() {
    ui.form.addEventListener("submit", salvarProduto);
    ui.cancelEdit.addEventListener("click", limparFormulario);
    ui.search.addEventListener("input", renderizarTabela);
    document.getElementById("refresh-button").addEventListener("click", carregarProdutos);
    document.getElementById("go-to-form").addEventListener("click", () => {
        document.getElementById("cadastro").scrollIntoView({ behavior: "smooth" });
        ui.name.focus({ preventScroll: true });
    });

    ui.tableBody.addEventListener("click", tratarAcaoDaTabela);
    document.addEventListener("keydown", (evento) => {
        if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === "k") {
            evento.preventDefault();
            ui.search.focus();
        }
    });

    carregarProdutos();
}

async function carregarProdutos() {
    ui.apiLabel.textContent = "Conectando à API...";
    ui.apiDot.classList.remove("online");
    ui.tableBody.innerHTML = '<tr><td colspan="6" class="loading-cell">Atualizando catálogo...</td></tr>';
    ui.emptyState.classList.add("hidden");

    try {
        const resposta = await fetch(API_URL, { method: "GET" });
        if (!resposta.ok) {
            throw new Error(`O servidor respondeu com o código ${resposta.status}.`);
        }

        produtos = await resposta.json();
        if (!Array.isArray(produtos)) {
            throw new Error("A API retornou um formato de dados inesperado.");
        }

        ui.apiLabel.textContent = "API conectada";
        ui.apiDot.classList.add("online");
        ui.lastUpdated.textContent = `Atualizado às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
        atualizarIndicadores();
        renderizarTabela();
    } catch (erro) {
        ui.apiLabel.textContent = "API indisponível";
        ui.apiDot.classList.remove("online");
        ui.tableBody.innerHTML = "";
        ui.emptyState.classList.remove("hidden");
        ui.emptyState.querySelector("strong").textContent = "Não foi possível carregar o catálogo";
        ui.emptyState.querySelector("p").textContent = "Confira se o Spring Boot está em execução e tente novamente.";
        atualizarIndicadores();
        mostrarToast(erro.message, true);
        console.error("Falha ao consultar a API:", erro);
    }
}

function atualizarIndicadores() {
    const totalUnidades = produtos.reduce((soma, produto) => soma + Number(produto.estoque || 0), 0);
    const baixoEstoque = produtos.filter(produto => Number(produto.estoque) <= LOW_STOCK_LIMIT).length;
    const valorTotal = produtos.reduce((soma, produto) => {
        return soma + Number(produto.preco || 0) * Number(produto.estoque || 0);
    }, 0);

    document.getElementById("stat-total").textContent = produtos.length;
    document.getElementById("stat-units").textContent = totalUnidades.toLocaleString("pt-BR");
    document.getElementById("stat-low").textContent = baixoEstoque;
    document.getElementById("stat-value").textContent = moeda.format(valorTotal);
}

function renderizarTabela() {
    const termo = ui.search.value.trim().toLocaleLowerCase("pt-BR");
    const filtrados = produtos.filter(produto => {
        const conteudo = [produto.id, produto.nome, produto.descricao, produto.preco, produto.estoque]
            .map(valor => String(valor ?? "").toLocaleLowerCase("pt-BR"));
        return conteudo.some(valor => valor.includes(termo));
    });

    ui.tableBody.innerHTML = "";
    ui.resultCount.textContent = `${filtrados.length} ${filtrados.length === 1 ? "item" : "itens"}`;

    if (filtrados.length === 0) {
        ui.emptyState.classList.remove("hidden");
        ui.emptyState.querySelector("strong").textContent = termo ? "Nenhum resultado encontrado" : "Seu catálogo está vazio";
        ui.emptyState.querySelector("p").textContent = termo
            ? "Tente buscar por outro nome, descrição ou identificador."
            : "Use o formulário ao lado para cadastrar seu primeiro produto.";
        return;
    }

    ui.emptyState.classList.add("hidden");

    filtrados.forEach(produto => {
        const linha = document.createElement("tr");
        linha.append(
            criarCelula(`<span class="id-chip">#${produto.id}</span>`, true),
            criarCelulaProduto(produto),
            criarCelula(moeda.format(Number(produto.preco))),
            criarCelula(`${produto.estoque} un.`),
            criarCelulaSituacao(produto.estoque),
            criarCelulaAcoes(produto.id)
        );
        ui.tableBody.appendChild(linha);
    });
}

function criarCelula(conteudo, htmlSeguro = false) {
    const celula = document.createElement("td");
    if (htmlSeguro) {
        celula.innerHTML = conteudo;
    } else {
        celula.textContent = conteudo;
    }
    return celula;
}

function criarCelulaProduto(produto) {
    const celula = document.createElement("td");
    const bloco = document.createElement("div");
    const nome = document.createElement("strong");
    const descricao = document.createElement("small");

    bloco.className = "product-cell";
    nome.textContent = produto.nome;
    descricao.textContent = produto.descricao || "Sem descrição informada";
    bloco.append(nome, descricao);
    celula.appendChild(bloco);
    return celula;
}

function criarCelulaSituacao(quantidade) {
    const celula = document.createElement("td");
    const etiqueta = document.createElement("span");
    const estoque = Number(quantidade);

    etiqueta.className = "stock-badge";
    if (estoque === 0) {
        etiqueta.classList.add("stock-zero");
        etiqueta.textContent = "Sem estoque";
    } else if (estoque <= LOW_STOCK_LIMIT) {
        etiqueta.classList.add("stock-low");
        etiqueta.textContent = "Estoque baixo";
    } else {
        etiqueta.classList.add("stock-ok");
        etiqueta.textContent = "Disponível";
    }

    celula.appendChild(etiqueta);
    return celula;
}

function criarCelulaAcoes(id) {
    const celula = document.createElement("td");
    celula.className = "actions-cell";

    const editar = document.createElement("button");
    editar.type = "button";
    editar.className = "row-action";
    editar.dataset.action = "edit";
    editar.dataset.id = id;
    editar.title = "Editar produto";
    editar.setAttribute("aria-label", `Editar produto ${id}`);
    editar.textContent = "✎";

    const excluir = document.createElement("button");
    excluir.type = "button";
    excluir.className = "row-action delete";
    excluir.dataset.action = "delete";
    excluir.dataset.id = id;
    excluir.title = "Excluir produto";
    excluir.setAttribute("aria-label", `Excluir produto ${id}`);
    excluir.textContent = "×";

    celula.append(editar, excluir);
    return celula;
}

function tratarAcaoDaTabela(evento) {
    const botao = evento.target.closest("button[data-action]");
    if (!botao) return;

    const id = Number(botao.dataset.id);
    const acao = botao.dataset.action;

    if (acao === "edit") {
        prepararEdicao(id);
    } else if (acao === "delete") {
        excluirProduto(id);
    }
}

function prepararEdicao(id) {
    const produto = produtos.find(item => Number(item.id) === id);
    if (!produto) {
        mostrarToast("Não foi possível localizar esse produto na lista.", true);
        return;
    }

    ui.id.value = produto.id;
    ui.name.value = produto.nome ?? "";
    ui.description.value = produto.descricao ?? "";
    ui.price.value = produto.preco ?? "";
    ui.stock.value = produto.estoque ?? "";
    ui.formTitle.textContent = `Editar produto #${produto.id}`;
    ui.formSubtitle.textContent = "Altere os campos necessários e salve as mudanças.";
    ui.submit.innerHTML = 'Salvar alterações <span>→</span>';
    ui.cancelEdit.classList.remove("hidden");
    document.getElementById("cadastro").scrollIntoView({ behavior: "smooth" });
    ui.name.focus({ preventScroll: true });
}

async function salvarProduto(evento) {
    evento.preventDefault();
    ui.feedback.textContent = "";

    const nome = ui.name.value.trim();
    const preco = Number(ui.price.value);
    const estoque = Number(ui.stock.value);

    if (!nome) {
        ui.feedback.textContent = "Informe o nome do produto.";
        ui.name.focus();
        return;
    }
    if (ui.price.value === "" || !Number.isFinite(preco) || preco < 0) {
        ui.feedback.textContent = "Informe um preço válido (zero ou maior).";
        ui.price.focus();
        return;
    }
    if (ui.stock.value === "" || !Number.isInteger(estoque) || estoque < 0) {
        ui.feedback.textContent = "Informe uma quantidade inteira de estoque (zero ou maior).";
        ui.stock.focus();
        return;
    }

    const produto = {
        nome,
        descricao: ui.description.value.trim(),
        preco,
        estoque
    };

    const id = ui.id.value;
    const editando = id !== "";
    const url = editando ? `${API_URL}/${id}` : API_URL;
    const metodo = editando ? "PUT" : "POST";

    ui.submit.disabled = true;
    ui.submit.textContent = editando ? "Atualizando..." : "Cadastrando...";

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });

        if (!resposta.ok) {
            const corpoErro = await resposta.json().catch(() => null);
            throw new Error(corpoErro?.mensagem || `Não foi possível salvar (HTTP ${resposta.status}).`);
        }

        limparFormulario();
        await carregarProdutos();
        mostrarToast(editando ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
    } catch (erro) {
        ui.feedback.textContent = erro.message;
        mostrarToast(erro.message, true);
        console.error("Falha ao salvar produto:", erro);
    } finally {
        ui.submit.disabled = false;
        ui.submit.innerHTML = 'Salvar produto <span>→</span>';
        if (ui.id.value) {
            ui.submit.innerHTML = 'Salvar alterações <span>→</span>';
        }
    }
}

async function excluirProduto(id) {
    const produto = produtos.find(item => Number(item.id) === id);
    const nome = produto?.nome || `#${id}`;
    if (!window.confirm(`Deseja realmente excluir "${nome}"?`)) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!resposta.ok) {
            throw new Error(resposta.status === 404 ? "Esse produto não existe mais." : `Falha ao excluir (HTTP ${resposta.status}).`);
        }

        if (Number(ui.id.value) === id) limparFormulario();
        await carregarProdutos();
        mostrarToast("Produto removido do catálogo.");
    } catch (erro) {
        mostrarToast(erro.message, true);
        console.error("Falha ao excluir produto:", erro);
    }
}

function limparFormulario() {
    ui.form.reset();
    ui.id.value = "";
    ui.formTitle.textContent = "Adicionar produto";
    ui.formSubtitle.textContent = "Preencha os dados para incluir um item no catálogo.";
    ui.submit.innerHTML = 'Salvar produto <span>→</span>';
    ui.cancelEdit.classList.add("hidden");
    ui.feedback.textContent = "";
}

function mostrarToast(mensagem, erro = false) {
    window.clearTimeout(toastTimer);
    ui.toast.textContent = mensagem;
    ui.toast.classList.toggle("error", erro);
    ui.toast.classList.add("visible");
    toastTimer = window.setTimeout(() => ui.toast.classList.remove("visible"), 3600);
}
