// =====================================================================
//                       ELEMENTOS DO DOM
// =====================================================================
const form = document.querySelector("#form-tarefa");
const inputTarefa = document.querySelector("#tarefa");
const contador = document.querySelector("#contador");
const listaTarefas = document.querySelector("#lista-tarefas");

// =====================================================================
//                  RESGATANDO AS TAREFAS DO LOCALSTORAGE
// =====================================================================
// Se já existir algo salvo no navegador, usamos. Senão, começamos com array vazio.
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];


// =====================================================================
//                       OUVINDO O EVENTO DE ENVIO
// =====================================================================
form.addEventListener("submit", adicionarTarefa);

// =====================================================================
//                       FUNÇÃO PRINCIPAL: ADICIONAR TAREFA
// =====================================================================
function adicionarTarefa(event) {
    // Impede que a página recarregue ao enviar o formulário
    event.preventDefault();

    // Pega o texto digitado e remove espaços em branco no início/fim
    let texto = inputTarefa.value.trim();

    // ===== ESTRUTURA DE DECISÃO =====
    // Se o usuário não digitou nada, mostra alerta e para a função
    if (texto === "") {
        alert("Você precisa informar a tarefa.");
        return; // sai da função
    }

    // Cria um objeto representando a nova tarefa
    const novaTarefa = {
        id: Date.now(),        // id único baseado na data/horário atual
        texto: texto,
        concluido: false       // começa como não concluída
    };
        console.log(novaTarefa); // visualizar no terminal o que foi inserido.

    // Adiciona a nova tarefa no array
    tarefas.push(novaTarefa);

    // Salva no localStorage (transforma o array em texto JSON) - - função criada na linha 64
    salvarTarefa();
    
    // Atualiza a tela (mostra a nova tarefa)
    renderizarTarefas();

    // Limpa o campo de input
    inputTarefa.value = "";
    // Coloca o cursor de volta no campo de input - - Local onde vai inserir nova tarefa
    inputTarefa.focus();

}

// =====================================================================
//                       FUNÇÃO: SALVAR NO LOCALSTORAGE
// =====================================================================
function salvarTarefa() {
    // localStorage só aceita texto, por isso usamos JSON.stringify
    localStorage.setItem("tarefas", JSON.stringify(tarefas)); // setItem = gravar (neste caso, sakvando no localStorage)
}

// =====================================================================
//                       FUNÇÃO: RENDERIZAR (MOSTRAR) AS TAREFAS
// =====================================================================
function renderizarTarefas() {
    // Limpa o conteúdo atual da tabela (evita duplicar)
    listaTarefas.innerHTML = "";

    tarefas.forEach(function (tarefa, indice) {
        const linha = document.createElement("tr"); // Inserir uma linha
        const colunaNumero = document.createElement("td"); // Inserir coluna (número da tarefa)
            colunaNumero.textContent = indice + 1; // número da tarefa (1, 2, 3...)

        const colunaTexto = document.createElement("td"); // Inserir outra coluna p/ informar tarefa
            colunaTexto.textContent = tarefa.texto; // texto da tarefa
                if (tarefa.concluido) { // tarefa.concluido === true | Não precisa informar, subtende-se como true
                    colunaTexto.classList.add(
                        "text-decoration-line-throught",
                        "text-muted"
                    );
                }

        const colunaStatus = document.createElement("td"); // APLICAR O STATUS de Tarefa: CONCLUÍDA OU PENDENTE
                if (tarefa.concluido) {
                    colunaStatus.innerHTML = '<span class="badge text-bg-success"> Concluída </span>';
                } else {
                    colunaStatus.innerHTML = '<span class="badge text-bg-warning"> Pendente </span>';
                }

        const colunaAcoes = document.createElement("td");
            colunaAcoes.classList.add( // .classList = aplicar estilos através do bootstrap
                "text-center"
            );

            const btnConcluir = document.createElement("button"); //abre um botão "<button></button>", abaixo as funções atribuidas ao botão.
                btnConcluir.textContent = tarefa.concluido ? "Reabrir" : "Concluir"; // expressão ternária (-) ? true : false  >>>>>>   true        false
                btnConcluir.classList.add(
                    "btn",
                    tarefa.concluido ? "btn-warning" : "btn-success",
                    "btn-sm", // buttom small (botão menor)
                    "me-2" // aplicar margem
                );
                btnConcluir.addEventListener(
                    "click",
                    function() {
                        alterarStatus(tarefa.id);
                    }
                );
                
                
                // ====================================== OUTRA FORMA
                // colunaAcoes.innerHTML = `
                //     <button class="btn btn-success btn-sm me-2" onclick="concluirTarefa(${tarefa.id})">Concluir</button>
                //     <button class="btn btn-danger btn-sm" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                // `; // botões de ação
                
            const btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.classList.add(
                    "btn",
                    "btn-primary", /// aplicar propriedade de cor primária (azul)
                    "btn-sm", // buttom small (botão menor)
                    "me-2" // aplicar margem
                );
                btnEditar.addEventListener(
                    "click",
                    function() {
                        editarTarefa(tarefa.id);
                    }
                );

        const btnExcluir = document.createElement("button");

        // Incluindo as linhas+colunas a tabela de tarefas
            linha.appendChild(colunaNumero);
            linha.appendChild(colunaTexto);
            linha.appendChild(colunaStatus);
            linha.appendChild(colunaAcoes);
                colunaAcoes.appendChild(btnConcluir); //Inserir o botão na coluna ações
                colunaAcoes.appendChild(btnEditar);
                colunaAcoes.appendChild(btnExcluir);
            
            

            listaTarefas.appendChild(linha); // Renderiza os dados das tarefas inseridas para a região da lista de tarefas
    });
    
function alterarStatus(id) { //parâmetro id, informado na linha 114 - alterarStatus(tarefa,id)
    tarefas.forEach(function (tarefa) {
        if (tarefa.id === id) {
            tarefa.concluido =  !tarefa.concluido;
        }
    });
    salvarTarefa();
    renderizarTarefas();
}

function editarTarefa(id) {
    const tarefa = tarefas.find(function(tarefa) { // Método array para localizar o id da tarefa que será editada.
        return tarefa.id === id;
    });

    do { // Aplicar estrutura de repetição para quando houver erro (digitação em branco) o usuário ser forçado a digitar a informação necessária
        const novoTexto = prompt("Digite a nova tarefa:", tarefa.texto); // Aplica a nova informação no campo correto e faz o ajuste solicitado
            if (novoTexto === null) {
                return;
            }
            texto = novoTexto.trim();

            if (texto === "") {
                alert("A tarefa não pode ficar vazia.");
            }
    } while (texto === "");

    tarefa.texto = texto;
    salvarTarefa();
    renderizarTarefas();

}







                                // // ===== ESTRUTURA DE REPETIÇÃO (LAÇO) =====  FEITO POR IA
                                // // Percorre todas as tarefas do array
                                // for (let i = 0; i < tarefas.length; i++) {
                                //     const tarefa = tarefas[i];

                                //     // Cria uma nova linha da tabela (<tr>)
                                //     const tr = document.createElement("tr");

                                //     // Cria as células (<td>)
                                //     const tdNumero = document.createElement("td");
                                //     const tdTexto = document.createElement("td");
                                //     const tdStatus = document.createElement("td");
                                //     const tdAcoes = document.createElement("td");

                                //     // Preenche o conteúdo das células
                                //     tdNumero.textContent = i + 1;               // número da tarefa (1, 2, 3...)
                                //     tdTexto.textContent = tarefa.texto;         // texto da tarefa

                                //     // ===== ESTRUTURA DE DECISÃO =====
                                //     // Mostra o status de forma amigável
                                //     if (tarefa.concluido === true) {
                                //         tdStatus.textContent = "✅ Concluída";
                                //         tdTexto.style.textDecoration = "line-through"; // risca o texto
                                //         tdTexto.style.color = "#888";
                                //     } else {
                                //         tdStatus.textContent = "⏳ Pendente";
                                //     }

                                //     // ===== BOTÕES DE AÇÃO =====
                                //     // Botão Concluir
                                //     const btnConcluir = document.createElement("button");
                                //     btnConcluir.textContent = "Concluir";
                                //     btnConcluir.style.marginRight = "8px";

                                //     // Quando clicar no botão Concluir
                                //     btnConcluir.addEventListener("click", function () {
                                //         concluirTarefa(tarefa.id);
                                //     });

                                //     // Botão Excluir
                                //     const btnExcluir = document.createElement("button");
                                //     btnExcluir.textContent = "Excluir";

                                //     // Quando clicar no botão Excluir
                                //     btnExcluir.addEventListener("click", function () {
                                //         excluirTarefa(tarefa.id);
                                //     });

                                //     // Coloca os botões dentro da célula de ações
                                //     tdAcoes.appendChild(btnConcluir);
                                //     tdAcoes.appendChild(btnExcluir);

                                //     // Coloca todas as células dentro da linha
                                //     tr.appendChild(tdNumero);
                                //     tr.appendChild(tdTexto);
                                //     tr.appendChild(tdStatus);
                                //     tr.appendChild(tdAcoes);

                                //     // Coloca a linha dentro da tabela
                                //     listaTarefas.appendChild(tr);
                                // }

                                // // Atualiza o contador de tarefas
                                // atualizarContador();
}

// =====================================================================
//                       FUNÇÃO: CONCLUIR TAREFA
// =====================================================================



                                // ================================== OUTRA FORMA
                                // function concluirTarefa(id) {
                                //     // ===== LAÇO + DECISÃO =====
                                //     // Procura a tarefa que tem o mesmo id
                                //     for (let i = 0; i < tarefas.length; i++) {
                                //         if (tarefas[i].id === id) {
                                //             // Alterna o status (true vira false e vice-versa)
                                //             tarefas[i].concluido = !tarefas[i].concluido;
                                //             break; // já encontrou, não precisa continuar o laço
                                //         }
                                //     }

                                //     salvarNoLocalStorage();
                                //     renderizarTarefas(); // atualiza a tela
                                // }

// =====================================================================
//                       FUNÇÃO: EXCLUIR TAREFA
// =====================================================================
                                // ====================================== OUTRA FORMA
                                // function excluirTarefa(id) {
                                //     // ===== LAÇO + DECISÃO =====
                                //     // Cria um novo array só com as tarefas que NÃO têm o id que queremos excluir
                                //     const novasTarefas = [];

                                //     for (let i = 0; i < tarefas.length; i++) {
                                //         if (tarefas[i].id !== id) {
                                //             novasTarefas.push(tarefas[i]);
                                //         }
                                //     }

                                //     // Substitui o array antigo pelo novo
                                //     tarefas = novasTarefas;

                                //     salvarNoLocalStorage();
                                //     renderizarTarefas();
                                // }
// =====================================================================
//                       FUNÇÃO: ATUALIZAR CONTADOR
// =====================================================================
                                // ==================================== OUTRA FORMA
                                // function atualizarContador() {
                                //     const total = tarefas.length;

                                //     // ===== ESTRUTURA DE DECISÃO =====
                                //     if (total === 0) {
                                //         contador.textContent = "0 tarefas";
                                //     } else if (total === 1) {
                                //         contador.textContent = "1 tarefa";
                                //     } else {
                                //         contador.textContent = total + " tarefas";
                                //     }
                                // }

// =====================================================================
//                       INICIALIZAÇÃO
// =====================================================================
// Assim que a página carrega, já mostra as tarefas que estavam salvas
renderizarTarefas();