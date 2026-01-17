// =======================================
// ARQUIVO 3/5: login.js
// Lógica de Autenticação e Controle de Acesso
// =======================================

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const generatorContainer = document.getElementById('generator-container');
    const loginMessage = document.getElementById('login-message');

    // Credenciais Fixas Conforme Solicitado
    const USUARIO_CORRETO = "Oliveira.2ss";
    const SENHA_CORRETA = "hs70%";

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        loginMessage.textContent = ''; // Limpa mensagens anteriores

        // 1. Verificação de Credenciais
        if (username === USUARIO_CORRETO && password === SENHA_CORRETA) {
            
            // 2. Animação de Login bem-sucedido
            // A mensagem de sucesso será mostrada brevemente
            loginMessage.textContent = "Login OK! Iniciando o sistema Sensi Xitada...";
            loginMessage.style.color = '#00ff99';
            
            // Simula a animação de transição (esconder login, mostrar gerador)
            setTimeout(() => {
                loginContainer.style.animation = 'fadeOutScale 0.5s ease-in forwards';
                
                setTimeout(() => {
                    loginContainer.style.display = 'none';
                    generatorContainer.style.display = 'block';
                    
                    // Inicializa a lógica do gerador (que está no app.js)
                    if (typeof initializeGenerator === 'function') {
                        initializeGenerator(); // Chama a função definida no app.js
                    }
                }, 500); // Tempo da animação de saída
                
            }, 1000);
            
        } else {
            // 3. Credenciais Inválidas
            loginMessage.textContent = "ERRO: Usuário ou senha incorretos. Acesso negado.";
            // Efeito de tremor/erro no formulário (simulado)
            loginContainer.classList.add('shake-animation');
            setTimeout(() => {
                loginContainer.classList.remove('shake-animation');
            }, 500);
        }
    });
    
    // Adicionando o estilo de shake no CSS (Adicione isso ao style.css no final)
    // @keyframes shake-animation { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); } }
    // .shake-animation { animation: shake-animation 0.5s cubic-bezier(.36,.07,.19,.97) both; transform: translate3d(0, 0, 0); backface-visibility: hidden; perspective: 1000px; }

});
