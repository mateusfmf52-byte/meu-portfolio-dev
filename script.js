/* --- 1. FUNÇÃO PARA CARREGAR WALLPAPERS (JSON) --- */
async function carregarWallpapers() {
    const container = document.getElementById('lista-wallpapers');
    
    // Se não existir o container na tela, para por aqui para não dar erro
    if (!container) return;

    try {
        const resposta = await fetch('wallpapers.json');
        const wallpapers = await resposta.json();
        
        container.innerHTML = ''; // Limpa o "Carregando..."

        wallpapers.forEach((wall, index) => {
            // Cria o Card
            const card = document.createElement('div');
            card.className = 'wall-card';

            // Pega o primeiro link para ser o padrão
            let primeiroLink = Object.values(wall.downloads)[0]; 
            let opcoesHtml = '';

            for (const [qualidade, link] of Object.entries(wall.downloads)) {
                opcoesHtml += `<option value="${link}">${qualidade}</option>`;
            }

            card.innerHTML = `
                <img src="${wall.miniatura}" alt="${wall.titulo}" class="wall-thumb">
                <div class="wall-info">
                    <div class="wall-title">${wall.titulo}</div>
                    <select class="qualidade-select" id="select-${index}" onchange="atualizarLinkDownload(${index})">
                        ${opcoesHtml}
                    </select>
                    <a href="${primeiroLink}" id="btn-${index}" class="btn-baixar-wall" download target="_blank">
                        <i class="ph ph-download-simple"></i> Baixar
                    </a>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao carregar wallpapers:", erro);
        container.innerHTML = '<p style="text-align:center; padding:20px;">Erro ao carregar galeria.</p>';
    }
}

/* --- 2. FUNÇÃO AUXILIAR DE DOWNLOAD --- */
function atualizarLinkDownload(id) {
    const select = document.getElementById(`select-${id}`);
    const botao = document.getElementById(`btn-${id}`);
    if (select && botao) {
        botao.href = select.value;
    }
}

/* --- 3. LÓGICA DE INICIALIZAÇÃO E EVENTOS --- */
document.addEventListener("DOMContentLoaded", () => {
    
    // A) Inicia a Galeria
    carregarWallpapers();

    // B) Efeito Scroll (Aparecer ao rolar)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.card, .produto-card').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // C) Lógica do Menu Lateral
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    if (menuIcon && sidebar && overlay && closeBtn) {
        function openMenu() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        }
        function closeMenu() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }

        menuIcon.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
        
        menuItems.forEach(item => {
            item.addEventListener('click', closeMenu);
        });
    }

    // D) Lógica do Modo Claro/Escuro (Blindada contra erros)
    const botaoTema = document.getElementById('theme-toggle');
    const corpoSite = document.body;

    if (botaoTema) {
        if (localStorage.getItem('tema') === 'claro') {
            corpoSite.classList.add('light-mode');
        }

        botaoTema.addEventListener('click', () => {
            corpoSite.classList.toggle('light-mode');
            if (corpoSite.classList.contains('light-mode')) {
                localStorage.setItem('tema', 'claro');
            } else {
                localStorage.setItem('tema', 'escuro');
            }
        });
    }
});

/* --- 4. FUNÇÕES GLOBAIS PARA MODAIS (HTML chama direto) --- */
function abrirModal(idModal) {
    // Fecha o menu lateral se estiver aberto
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');

    const modal = document.getElementById(idModal);
    if (modal) modal.classList.add('active');
}

function fecharModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.classList.remove('active');
}

// Fechar modal ao clicar fora ou no X (Configuração Global)
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.modal-container').forEach(container => {
        container.addEventListener('click', (evento) => {
            if (evento.target === container) {
                container.classList.remove('active');
            }
        });
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
             const modal = btn.closest('.modal-container');
             if (modal) modal.classList.remove('active');
        });
    });
});