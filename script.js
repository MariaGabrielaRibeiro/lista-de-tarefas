// ==========================================
// 1. ESTADO E CONSTANTES
// ==========================================
// Melhoria 5: Persistência com localStorage (JSON.parse)
let tarefas = JSON.parse(localStorage.getItem("minhas-tarefas")) || [];
let filtroAtual = "todas";
const LIMITE_CARACTERES = 100;

const lista = document.querySelector("#lista-tarefas");
const contador = document.querySelector("#contador");
const campo = document.querySelector("#campo-tarefa");
const selectPrioridade = document.querySelector("#select-prioridade");
const btnAdicionar = document.querySelector("#btn-adicionar");
const contadorCaracteres = document.querySelector("#contador-caracteres");
const btnLimpar = document.querySelector("#btn-limpar");
const botoesFiltro = document.querySelectorAll(".btn-filtro");

// Salva o estado atual no navegador (JSON.stringify)
const salvarTarefas = () => {
  localStorage.setItem("minhas-tarefas", JSON.stringify(tarefas));
};

// ==========================================
// 2. RENDERIZAÇÃO (Única fonte de verdade)
// ==========================================
const renderizar = () => {
  salvarTarefas();
  lista.innerHTML = "";

  // Melhoria 2: Filtros de visualização sem alterar o array original
  const tarefasVisiveis = tarefas.filter((t) => {
    if (filtroAtual === "pendentes") return !t.concluida;
    if (filtroAtual === "concluidas") return t.concluida;
    return true;
  });

  tarefasVisiveis.forEach((tarefa) => {
    const li = document.createElement("li");
    if (tarefa.concluida) li.classList.add("concluida");

    // Melhoria 4: Classe de destaque conforme a prioridade
    const nivel = tarefa.prioridade || "media";
    li.classList.add(`prioridade-${nivel}`);

    const divConteudo = document.createElement("div");
    divConteudo.classList.add("conteudo-tarefa");

    const badge = document.createElement("span");
    badge.classList.add("badge-prioridade");
    badge.textContent = nivel;

    const spanTexto = document.createElement("span");
    spanTexto.classList.add("texto-tarefa");
    spanTexto.textContent = tarefa.texto;

    divConteudo.appendChild(badge);
    divConteudo.appendChild(spanTexto);
    li.appendChild(divConteudo);

    // Concluir ao clicar na tarefa
    li.addEventListener("click", () => {
      tarefa.concluida = !tarefa.concluida;
      renderizar();
    });

    // Remover ao clicar no botão ✕
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "✕";
    btnRemover.classList.add("btn-remover");
    btnRemover.addEventListener("click", (e) => {
      e.stopPropagation();
      const indiceOriginal = tarefas.indexOf(tarefa);
      tarefas.splice(indiceOriginal, 1);
      renderizar();
    });

    li.appendChild(btnRemover);
    lista.appendChild(li);
  });

  const pendentes = tarefas.filter((t) => !t.concluida).length;
  contador.textContent = `${pendentes} pendente(s) de ${tarefas.length}`;
};

// ==========================================
// 3. EVENTOS
// ==========================================
// Melhoria 3: Contagem regressiva de caracteres
const atualizarContadorCaracteres = () => {
  const restantes = LIMITE_CARACTERES - campo.value.length;
  contadorCaracteres.textContent = `${restantes} caracteres restantes`;

  if (restantes < 0) {
    contadorCaracteres.classList.add("limite-estourado");
  } else {
    contadorCaracteres.classList.remove("limite-estourado");
  }
};

campo.addEventListener("input", atualizarContadorCaracteres);

// Adicionar nova tarefa
const adicionar = () => {
  const texto = campo.value.trim();
  if (texto === "" || texto.length > LIMITE_CARACTERES) return;

  tarefas.push({
    texto,
    concluida: false,
    prioridade: selectPrioridade.value
  });

  campo.value = "";
  selectPrioridade.value = "media";
  atualizarContadorCaracteres();
  campo.focus();
  renderizar();
};

btnAdicionar.addEventListener("click", adicionar);
campo.addEventListener("keydown", (e) => {
  if (e.key === "Enter") adicionar();
});

// Melhoria 1: Botão "Limpar concluídas" (reatribuindo let tarefas com filter)
btnLimpar.addEventListener("click", () => {
  tarefas = tarefas.filter((t) => !t.concluida);
  renderizar();
});

// Melhoria 2: Clique nos botões de filtro
botoesFiltro.forEach((btn) => {
  btn.addEventListener("click", () => {
    botoesFiltro.forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    filtroAtual = btn.dataset.filtro;
    renderizar();
  });
});

// Primeira renderização
renderizar();
