let contNormal = 0;
let contPref = 0;
let senhaAtualObj = { numero: "---", tipo: "" };

// ARRAY PARA O HISTÓRICO
let historicoChamadas = []; 

const displaySenha = document.getElementById("senha");
const displayTipo = document.getElementById("tipoSenha");
const boxSenha = document.getElementById("boxUltimaSenha");
const listaHistorico = document.getElementById("listaHistorico");
const selectGuiche = document.getElementById("guiche");

function atualizarDataHora() {
    const agora = new Date();
    document.getElementById("data").innerText = agora.toLocaleDateString('pt-BR');
    document.getElementById("hora").innerText = agora.toLocaleTimeString('pt-BR');
}
setInterval(atualizarDataHora, 1000);
atualizarDataHora();

function atualizarVisualSenha(num, tipo, classe) {
    senhaAtualObj = { numero: num, tipo: tipo };
    displaySenha.innerText = num;
    displayTipo.innerText = tipo + ":";
    boxSenha.className = `senhaBox ${classe}`;
}

document.getElementById("btnGerar").addEventListener("click", () => {
    contNormal++;
    const s = "N" + contNormal.toString().padStart(3, "0");
    atualizarVisualSenha(s, "Normal", "box-normal");
});

document.getElementById("btnPreferencial").addEventListener("click", () => {
    contPref++;
    const s = "P" + contPref.toString().padStart(3, "0");
    atualizarVisualSenha(s, "Preferencial", "box-pref");
});

function tocarBip() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.value = 660; 
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5); 
    } catch (e) {
        console.log("Som bloqueado.");
    }
}

document.getElementById("btnChamar").addEventListener("click", () => {
    if (senhaAtualObj.numero === "---") {
        alert("Por favor, gere uma senha primeiro!");
        return;
    }

    const g = selectGuiche.value;
    tocarBip();

    setTimeout(() => {
        const mensagem = new SpeechSynthesisUtterance(`Senha ${senhaAtualObj.numero}, dirigir-se ao guichê ${g}`);
        mensagem.lang = "pt-BR";
        mensagem.rate = 1.1;
        window.speechSynthesis.speak(mensagem);
        
        // CHAMADA DA FUNÇÃO ATUALIZADA
        gerenciarArrayHistorico(senhaAtualObj.numero, g);
    }, 300);
});

// FUNÇÃO QUE GERENCIA O ARRAY E RENDERIZA A TELA
function gerenciarArrayHistorico(s, g) {
    // 1. Verifica se a senha já existe no array
    const indiceExistente = historicoChamadas.findIndex(item => item.senha === s);

    if (indiceExistente !== -1) {
        // Se já existe, remove do lugar antigo para mover para o topo
        historicoChamadas.splice(indiceExistente, 1);
    }

    // 2. Adiciona no início do array
    historicoChamadas.unshift({ senha: s, guiche: g });

    // 3. Limita o array a 15 itens (opcional, para não crescer infinito)
    if (historicoChamadas.length > 15) {
        historicoChamadas.pop();
    }

    // 4. Renderiza a lista na tela
    renderizarHistorico();
}

function renderizarHistorico() {
    listaHistorico.innerHTML = ""; // Limpa a lista visual

    historicoChamadas.forEach(item => {
        const li = document.createElement("li");
        li.className = "hist-item";
        const corDestaque = item.senha.startsWith("P") ? "#ffcc00" : "#00d4ff";

        li.innerHTML = `
            <strong style="color: ${corDestaque}">${item.senha}</strong>
            <span style="font-size: 0.8rem; opacity: 0.8;">Guichê ${item.guiche}</span>
        `;
        listaHistorico.appendChild(li);
    });
}

document.getElementById("btnZerar").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja zerar tudo?")) {
        contNormal = 0;
        contPref = 0;
        senhaAtualObj = { numero: "---", tipo: "" };
        historicoChamadas = []; // LIMPA O ARRAY
        displaySenha.innerText = "---";
        displayTipo.innerText = "Senha:";
        boxSenha.className = "senhaBox";
        listaHistorico.innerHTML = ""; 
    }
});