let contNormal = 0;
let contPref = 0;
let senhaAtualObj = { numero: "---", tipo: "" };

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
        console.log("Áudio bloqueado pelo navegador. Interaja com a página primeiro.");
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
        
        adicionarHistorico(senhaAtualObj.numero, g);
    }, 300);
});

function adicionarHistorico(s, g) {
    const li = document.createElement("li");
    li.className = "hist-item";
    
    const corDestaque = s.startsWith("P") ? "#ffcc00" : "#00d4ff";

    li.innerHTML = `
        <strong style="color: ${corDestaque}">${s}</strong>
        <span style="font-size: 0.8rem; opacity: 0.8;">Guichê ${g}</span>
    `;

    listaHistorico.prepend(li);

    if (listaHistorico.children.length > 50) {
        listaHistorico.removeChild(listaHistorico.lastChild);
    }
}

document.getElementById("btnZerar").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja zerar todos os contadores e o histórico?")) {
        contNormal = 0;
        contPref = 0;
        senhaAtualObj = { numero: "---", tipo: "" };
        displaySenha.innerText = "---";
        displayTipo.innerText = "Senha:";
        boxSenha.className = "senhaBox";
        listaHistorico.innerHTML = ""; 
    }
});