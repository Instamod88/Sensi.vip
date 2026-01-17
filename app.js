// =======================================
// ARQUIVO 4/5: app.js
// Lógica do Gerador de Sensibilidade e Interface
// =======================================

// Variáveis de Estado Global
let ultimoDispositivoPesquisado = null;
let dadosPersistentes = {}; // Armazenará os dados de aprendizado

const DEVICE_DB_MOCK = {
    "iphone 14 pro": { isIos: true, baseConfig: { geral: 175, redDot: 165, scope2x: 160, scope4x: 155 } },
    "samsung a54": { isIos: false, baseConfig: { geral: 180, redDot: 170, scope2x: 168, scope4x: 163 } },
    "xiaomi poco x5": { isIos: false, baseConfig: { geral: 185, redDot: 175, scope2x: 172, scope4x: 168 } },
    "motorola g84": { isIos: false, baseConfig: { geral: 170, redDot: 160, scope2x: 158, scope4x: 150 } },
    "iphone 15": { isIos: true, baseConfig: { geral: 178, redDot: 168, scope2x: 163, scope4x: 158 } },
    // Adicione mais dispositivos para aumentar a "base de dados"
};

function initializeGenerator() {
    setupEventListeners();
    loadPersistentData(); // Carrega dados de 'data_logic.js'
    console.log("Gerador Sensi Xitada Inicializado.");
}

function setupEventListeners() {
    document.getElementById('search-button').addEventListener('click', handleSearch);
    document.getElementById('generate-button').addEventListener('click', handleGenerate);
    
    // Permite ENTER para pesquisar
    document.getElementById('device-search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// --- FUNÇÕES DE PESQUISA E VALIDAÇÃO ---

function handleSearch() {
    const inputElement = document.getElementById('device-search-input');
    const rawQuery = inputElement.value.toLowerCase().trim();
    const resultInfo = document.getElementById('search-result-info');
    const generateBtn = document.getElementById('generate-button');
    
    generateBtn.disabled = true;
    document.getElementById('sensitivity-data').innerHTML = '<p class="loading-text">Analisando dispositivo...</p>';
    document.getElementById('device-display-name').textContent = 'Pesquisando...';
    ultimoDispositivoPesquisado = null;
    
    // SIMULAÇÃO DE PESQUISA: Verifica se a query corresponde a um dispositivo conhecido (Mock DB)
    let foundDeviceKey = null;
    
    for (const key in DEVICE_DB_MOCK) {
        if (key.includes(rawQuery) || rawQuery.includes(key)) {
            foundDeviceKey = key;
            break;
        }
    }
    
    if (foundDeviceKey) {
        // Dispositivo validado como celular real
        ultimoDispositivoPesquisado = foundDeviceKey;
        document.getElementById('device-display-name').textContent = foundDeviceKey.toUpperCase();
        resultInfo.textContent = `Dispositivo encontrado: ${foundDeviceKey.toUpperCase()}. Pronto para gerar configurações.`;
        generateBtn.disabled = false;
        // Gera a primeira vez automaticamente
        handleGenerate(); 
    } else {
        // Não encontrado ou não é um celular (Regra de segurança)
        document.getElementById('device-display-name').textContent = 'INDEFINIDO';
        resultInfo.textContent = `AVISO: Dispositivo "${rawQuery}" não reconhecido ou não é um celular válido. Tente pesquisar um modelo específico (ex: iPhone 14, Samsung A54).`;
        document.getElementById('sensitivity-data').innerHTML = '<p class="info-text">Pesquise um aparelho válido para desbloquear a geração.</p>';
    }
}

// --- FUNÇÕES DE GERAÇÃO INTELIGENTE ---

function generateRandomDPI(min, max) {
    // Gera DPIs aleatórios dentro de uma faixa ampla, conforme solicitado
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSenseValues(baseConfig, isIos) {
    const values = {};
    
    // Média Geral: 170 a 190
    values.Geral = getRandomAdjusted(baseConfig.geral, 170, 190);
    
    // Média Red Dot, 2x, 4x: 150 a 180
    const scopeRange = [150, 180];
    values.RedDot = getRandomAdjusted(baseConfig.redDot, scopeRange[0], scopeRange[1]);
    values.Scope2x = getRandomAdjusted(baseConfig.scope2x, scopeRange[0], scopeRange[1]);
    values.Scope4x = getRandomAdjusted(baseConfig.scope4x, scopeRange[0], scopeRange[1]);

    // Regra de iPhone: Não gera DPI
    if (!isIos) {
        // DPI do Jogo (DP1) / Botão Atirar DPI (DPA) - Faixa 600 a 900
        values.DP1 = generateRandomDPI(600, 900);
        values.DPA = generateRandomDPI(600, 900);
    } else {
        values.DP1 = "N/A (iOS)";
        values.DPA = "N/A (iOS)";
    }
    
    // Botão de Atirar (Porcentagem): 27% até 60%
    values.BotaoAtirarPerc = Math.floor(Math.random() * (60 - 27 + 1)) + 27;
    
    return values;
}

/**
 * Gera um valor ajustado baseado na configuração base, mas com variação
 * para evitar repetições, simulando "inteligência".
 * @param {number} base O valor médio da configuração base.
 * @param {number} min O limite inferior permitido (ex: 150).
 * @param {number} max O limite superior permitido (ex: 190).
 */
function getRandomAdjusted(base, min, max) {
    const dataKey = `last_${base}`; // Chave para rastrear o último valor gerado para este tipo
    let lastValue = dadosPersistentes[dataKey] || base; // Pega o último valor ou usa a base

    let newValue;
    
    // Tenta gerar um valor diferente do último, dentro dos limites
    do {
        // Variação pequena em torno da base (simulando precisão de cálculo)
        const variance = Math.floor(Math.random() * 8) - 4; // Variação de -4 a +3
        newValue = base + variance;
        
        // Garante que o novo valor esteja DENTRO dos limites solicitados (150-190, etc.)
        newValue = Math.max(min, Math.min(max, newValue));
        
    } while (newValue === lastValue && (max - min > 1)); // Loop se for o mesmo, a menos que o range seja muito pequeno

    // Atualiza o dado persistente
    dadosPersistentes[dataKey] = newValue;
    return newValue;
}


// --- FUNÇÕES DE RENDERIZAÇÃO E PERSISTÊNCIA ---

function handleGenerate() {
    if (!ultimoDispositivoPesquisado) return;

    const deviceKey = ultimoDispositivoPesquisado;
    const deviceData = DEVICE_DB_MOCK[deviceKey];
    
    // 1. GERAÇÃO: Cria os novos valores
    const newSense = generateSenseValues(deviceData.baseConfig, deviceData.isIos);
    
    // 2. PERSISTÊNCIA: Salva o histórico de sensibilidades para este dispositivo
    saveDeviceHistory(deviceKey, newSense);

    // 3. RENDERIZAÇÃO: Exibe os novos valores
    renderSensitivity(deviceKey, newSense);
    
    // Animação de sucesso no botão
    const btn = document.getElementById('generate-button');
    btn.textContent = "GERADO! (Clique para refinar)";
    setTimeout(() => {
        btn.textContent = "Gerar Nova Sense";
    }, 800);
}

function renderSensitivity(deviceName, sense) {
    const container = document.getElementById('sensitivity-data');
    let htmlContent = '';

    // Itera sobre os valores gerados e cria os blocos de exibição
    for (const key in sense) {
        let name = key.replace(/([A-Z])/g, ' $1').toUpperCase(); // Formata nomes (Ex: RedDot -> Red Dot)
        let value = sense[key];
        
        // Aplica cores específicas (Vermelho para Headshot)
        let valueClass = 'sense-value';
        if (key === 'RedDot' && sense.RedDot < 160) {
             // Simula cores de feedback
             valueClass += ' color-low'; 
        } else if (key === 'RedDot' && sense.RedDot > 175) {
             valueClass += ' color-high';
        }

        htmlContent += `
            <div class="sense-item">
                <span class="sense-name">${name}:</span>
                <span class="${valueClass}">${value}</span>
            </div>
        `;
    }

    container.innerHTML = htmlContent;
    // Adiciona o CSS de cores de feedback se não estiver no style.css
    // Este trecho seria idealmente em data_logic.js se estivéssemos separando estilização
    // Por enquanto, adicionamos estilos dinamicamente para garantir a visualização:
    const style = document.createElement('style');
    style.textContent = `
        .color-low { color: #ff5722; } /* Laranja/Vermelho baixo */
        .color-high { color: #00ff99; text-shadow: 0 0 10px #00ff99; } /* Neon Alto */
    `;
    document.head.appendChild(style);
}


// --- FUNÇÕES DE ARMAZENAMENTO (Data Logic Bridge) ---

// Estas funções serão substituídas ou complementadas pelo data_logic.js, 
// mas são necessárias para a execução imediata.

function loadPersistentData() {
    // Tenta carregar os dados de aprendizado do localStorage
    const storedData = localStorage.getItem('sensiXitadaData');
    if (storedData) {
        dadosPersistentes = JSON.parse(storedData);
        console.log(`Dados de aprendizado carregados. ${Object.keys(dadosPersistentes).length} entradas.`);
    } else {
        dadosPersistentes = {};
    }
}

function saveDeviceHistory(device, sense) {
    // Estrutura: { "samsung a54": [ {Geral: 175, ...}, {Geral: 176, ...} ] }
    if (!dadosPersistentes.history) {
        dadosPersistentes.history = {};
    }
    
    if (!dadosPersistentes.history[device]) {
        dadosPersistentes.history[device] = [];
    }
    
    // Limita o histórico para evitar que o localStorage fique gigantesco
    if (dadosPersistentes.history[device].length > 50) {
        dadosPersistentes.history[device].shift(); // Remove o mais antigo
    }
    
    dadosPersistentes.history[device].push(sense);
    
    // Salva o estado geral (incluindo as últimas bases de 'last_175', etc.)
    localStorage.setItem('sensiXitadaData', JSON.stringify(dadosPersistentes));
    console.log(`Histórico salvo para ${device}. Tamanho: ${dadosPersistentes.history[device].length}`);
}

// Chama a função principal de inicialização
// É chamada pelo login.js após o sucesso
// initializeGenerator();
