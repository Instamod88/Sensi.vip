 // =======================================
 // ARQUIVO 4/5: app.js (ATUALIZADO E EXPANDIDO)
 // =======================================
 
 // Variáveis de Estado Global
 let ultimoDispositivoPesquisado = null;
 let dadosPersistentes = {}; 
 
 // EXPANSÃO MASSIVA DO MOCK DB para suportar a regra de "inteligência" e volume
 const DEVICE_DB_MOCK = {
 // CONFIGURAÇÕES BASE PARA CÁLCULOS (Simulando diferentes perfis de hardware)
 // Geral: 170-190 (Base próxima de 180)
 // Scopes: 150-180 (Base próxima de 165)
 
 // --- Apple (isIos: true, Sem DPI/Botão %) ---
 "iphone 14 pro max": { isIos: true, baseConfig: { geral: 176, redDot: 162, scope2x: 165, scope4x: 158 } },
 "iphone 13 mini": { isIos: true, baseConfig: { geral: 182, redDot: 170, scope2x: 171, scope4x: 169 } },
 "iphone se 2022": { isIos: true, baseConfig: { geral: 188, redDot: 178, scope2x: 178, scope4x: 175 } },
 "iphone 15 pro": { isIos: true, baseConfig: { geral: 174, redDot: 160, scope2x: 163, scope4x: 155 } },
 "iphone 12": { isIos: true, baseConfig: { geral: 180, redDot: 168, scope2x: 168, scope4x: 165 } },
 "iphone 11": { isIos: true, baseConfig: { geral: 185, redDot: 172, scope2x: 170, scope4x: 168 } },
 "iphone xr": { isIos: true, baseConfig: { geral: 190, redDot: 180, scope2x: 179, scope4x: 177 } },
 "iphone x": { isIos: true, baseConfig: { geral: 187, redDot: 177, scope2x: 175, scope4x: 172 } },
 
 // --- Samsung (isIos: false, Com DPI/Botão %) ---
 "samsung galaxy s23 ultra": { isIos: false, baseConfig: { geral: 175, redDot: 165, scope2x: 160, scope4x: 155 } },
 "samsung a54": { isIos: false, baseConfig: { geral: 180, redDot: 170, scope2x: 168, scope4x: 163 } },
 "samsung a34": { isIos: false, baseConfig: { geral: 184, redDot: 174, scope2x: 171, scope4x: 169 } },
 "samsung s21 fe": { isIos: false, baseConfig: { geral: 178, redDot: 168, scope2x: 165, scope4x: 162 } },
 "samsung m53": { isIos: false, baseConfig: { geral: 190, redDot: 180, scope2x: 178, scope4x: 175 } },
 
 // --- Xiaomi/Poco/Redmi (isIos: false, Com DPI/Botão %) ---
 "xiaomi 13 pro": { isIos: false, baseConfig: { geral: 170, redDot: 155, scope2x: 152, scope4x: 150 } },
 "xiaomi poco x5 pro": { isIos: false, baseConfig: { geral: 185, redDot: 175, scope2x: 172, scope4x: 168 } },
 "redmi note 12": { isIos: false, baseConfig: { geral: 188, redDot: 178, scope2x: 175, scope4x: 172 } },
 "poco f5": { isIos: false, baseConfig: { geral: 172, redDot: 160, scope2x: 158, scope4x: 155 } },
 
 // --- Motorola (isIos: false, Com DPI/Botão %) ---
 "motorola g84": { isIos: false, baseConfig: { geral: 170, redDot: 160, scope2x: 158, scope4x: 150 } },
 "motorola edge 40": { isIos: false, baseConfig: { geral: 177, redDot: 167, scope2x: 164, scope4x: 160 } },
 
 // Mais variações para testar a pesquisa
 "samsung a14": { isIos: false, baseConfig: { geral: 190, redDot: 180, scope2x: 175, scope4x: 170 } },
 "iphone 14": { isIos: true, baseConfig: { geral: 178, redDot: 168, scope2x: 163, scope4x: 158 } },
 "poco m5": { isIos: false, baseConfig: { geral: 186, redDot: 176, scope2x: 173, scope4x: 170 } },
 "samsung s24": { isIos: false, baseConfig: { geral: 171, redDot: 161, scope2x: 159, scope4x: 154 } },
 };
 
 // --- (O restante de setupEventListeners e handleSearch permanece o mesmo) ---
 
 // --- FUNÇÕES DE GERAÇÃO INTELIGENTE (LÓGICA REVISADA) ---
 
 function generateRandomDPI(min, max) {
 // DPI e DPA: Aleatório entre 600 e 900
 return Math.floor(Math.random() * (max - min + 1)) + min;
 }
 
 function generateSenseValues(baseConfig, isIos) {
 const values = {};
 
 // 1. Sensibilidades Principais (Range conforme regras)
 values.Geral = getRandomAdjusted(baseConfig.geral, 170, 190);
 
 const scopeRange = [150, 180]; // Média 150 até 180 para Scopes
 values.RedDot = getRandomAdjusted(baseConfig.redDot, scopeRange[0], scopeRange[1]);
 values.Scope2x = getRandomAdjusted(baseConfig.scope2x, scopeRange[0], scopeRange[1]);
 values.Scope4x = getRandomAdjusted(baseConfig.scope4x, scopeRange[0], scopeRange[1]);
 
 // 2. DPI e Botão (Só se NÃO for iOS)
 if (!isIos) {
 // DPI (DP1 e DPA): Aleatório entre 600 e 900
 const DPI_MIN = 600;
 const DPI_MAX = 900;
 values.DP1 = generateRandomDPI(DPI_MIN, DPI_MAX);
 values.DPA = generateRandomDPI(DPI_MIN, DPI_MAX);
 } else {
 values.DP1 = "N/A (iOS)";
 values.DPA = "N/A (iOS)";
 }
 
 // Botão de Atirar (%): Aleatório entre 27% até 60%
 const BUTTON_MIN = 27;
 const BUTTON_MAX = 60
 values.BotaoAtirarPerc = Math.floor(Math.random() * (BUTTON_MAX - BUTTON_MIN + 1)) + BUTTON_MIN;
 
 return values
 }
 // --- (A função getRandomAdjusted permanece a mesma, crucial para o aprendizado) --- 
 // --- (As funções saveDeviceHistory e renderSensitivity permanecem as mesmas) --- 