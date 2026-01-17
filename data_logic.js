// =======================================
// ARQUIVO 5/5: data_logic.js
// Lógica Avançada de Armazenamento e Refinamento
// =======================================

// NOTA: Este arquivo interage com a variável global 'dadosPersistentes'
// que é inicializada e carregada em app.js.

/**
 * Função para refinar os parâmetros de geração com base no histórico.
 * Em um sistema real, aqui ocorreria um cálculo estatístico complexo (ex: regressão linear, filtragem de Kalman).
 * Aqui, simulamos "aprendizado" ajustando as bases de geração.
 */
function refineGenerationBase(deviceKey) {
    if (!dadosPersistentes.history || !dadosPersistentes.history[deviceKey]) {
        return; // Não há histórico para refinar
    }

    const history = dadosPersistentes.history[deviceKey];
    const baseData = DEVICE_DB_MOCK[deviceKey].baseConfig;
    
    let totalGeral = 0;
    let countGeral = 0;
    
    // Exemplo: Focar em refinar a média da sensibilidade 'Geral'
    history.forEach(senseEntry => {
        if (senseEntry.Geral && typeof senseEntry.Geral === 'number') {
            totalGeral += senseEntry.Geral;
            countGeral++;
        }
    });

    if (countGeral > 5) { // Espera pelo menos 5 gerações para começar a ajustar
        const newAverage = totalGeral / countGeral;
        
        // Ajusta a base que será usada na próxima chamada a getRandomAdjusted.
        // O sistema aprendeu que para este aparelho, a média ideal está em 'newAverage'.
        
        // Para simular o aprendizado, atualizamos a 'chave' que o getRandomAdjusted usa
        const baseKey = `last_175`; // Usamos a base '175' (a base original de um Samsung/iPhone) como âncora

        // Se a nova média estiver muito longe da base antiga, o sistema se ajusta
        if (Math.abs(newAverage - baseData.geral) > 2) {
             dadosPersistentes[baseKey] = Math.round(newAverage);
             console.warn(`[Aprendizado] Base ajustada para ${deviceKey}: Geral agora usa ${Math.round(newAverage)} como ponto de partida.`);
        }
    }
}

// Sobrescreve ou estende a função de geração principal para incluir o refinamento
const originalHandleGenerate = handleGenerate;

window.handleGenerate = function() {
    if (!ultimoDispositivoPesquisado) return;
    
    // 1. Refinamento da Base (O cérebro do sistema)
    refineGenerationBase(ultimoDispositivoPesquisado);
    
    // 2. Salvamento imediato do estado atualizado
    localStorage.setItem('sensiXitadaData', JSON.stringify(dadosPersistentes));
    
    // 3. Execução da Geração (agora usando bases potencialmente refinadas)
    originalHandleGenerate(); 
}


// Nota sobre DPA e Botão de Atirar (Simulação de Cálculo Perfeito)
// A regra solicitada é: DPI alto (600-900) e Botão (27-60%).
// A "perfeição" é simulada pelo getRandomAdjusted, que garante que os valores principais (Geral, Scope)
// não fiquem repetitivos nem excedam os limites definidos pelo usuário (ex: não passar da cabeça).
// A lógica complexa para o DPI/Botão seria implementada aqui através de correlações
// que só o histórico completo poderia gerar.

