// frontend/assets/js/events.js
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('events-grid');
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  const categoryButtons = document.querySelectorAll('.category-tag');

  let todosEventos = [];

  function formatDateRange(startIso, endIso) {
    if (!startIso) return '';
    const start = new Date(startIso);
    const end = endIso ? new Date(endIso) : null;

    const optsData = { day: '2-digit', month: 'short' };
    const optsHora = { hour: '2-digit', minute: '2-digit' };

    const dataStr = start.toLocaleDateString('pt-BR', optsData).toUpperCase();
    const horaIni = start.toLocaleTimeString('pt-BR', optsHora);

    if (end) {
      const horaFim = end.toLocaleTimeString('pt-BR', optsHora);
      return `${dataStr} • ${horaIni} - ${horaFim}`;
    }

    return `${dataStr} • ${horaIni}`;
  }

  function renderEventos(lista) {
    if (!grid) return;

    if (!lista.length) {
      grid.innerHTML = '<p>Nenhum evento encontrado.</p>';
      return;
    }

    grid.innerHTML = '';

    lista.forEach(ev => {
      const card = document.createElement('article');
      card.className = 'event-card';

      const dataTexto = formatDateRange(ev.dataInicio, ev.dataFim);
      const local = ev.local || 'Local a definir'; // campo "local" na entidade Evento:contentReference[oaicite:20]{index=20}

      card.innerHTML = `
        <div class="event-details">
          <p class="event-date">${dataTexto}</p>
          <h3 class="event-title">${ev.titulo}</h3>
          <p class="event-location">📍 ${local}</p>
          ${ev.descricao ? `<p class="event-description">${ev.descricao}</p>` : ''}
          <div class="event-actions">
            ${ev.urlInscricao ? `<a href="${ev.urlInscricao}" class="btn-event" target="_blank" rel="noopener noreferrer">Inscrever-se</a>` : ''}
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function aplicarFiltros() {
    const termo = (searchInput?.value || '').toLowerCase();
    const categoriaAtiva = Array.from(categoryButtons).find(btn =>
      btn.classList.contains('active')
    )?.textContent.trim();

    let filtrados = [...todosEventos];

    if (termo) {
      filtrados = filtrados.filter(ev =>
        (ev.titulo && ev.titulo.toLowerCase().includes(termo)) ||
        (ev.descricao && ev.descricao.toLowerCase().includes(termo)) ||
        (ev.local && ev.local.toLowerCase().includes(termo))
      );
    }

    // Exemplo simples: se quiser categorias reais no futuro, pode ler de ev.categoria
    if (categoriaAtiva && categoriaAtiva !== 'Todos') {
      filtrados = filtrados.filter(ev =>
        ev.titulo?.toLowerCase().includes(categoriaAtiva.toLowerCase()) ||
        ev.descricao?.toLowerCase().includes(categoriaAtiva.toLowerCase())
      );
    }

    renderEventos(filtrados);
  }

  async function carregarEventos() {
    try {
      // você pode trocar por fetchAllEvents() ou fetchActiveEvents()
      const resposta = await window.API.fetchUpcomingEvents();
      // resposta = { total, tipo, dados: Evento[] }
      todosEventos = resposta.dados || [];
      aplicarFiltros();
    } catch (err) {
      console.error(err);
      if (grid) {
        grid.innerHTML = '<p>Erro ao carregar eventos.</p>';
      }
    }
  }

  // Eventos de UI
  if (searchButton && searchInput) {
    searchButton.addEventListener('click', () => {
      aplicarFiltros();
    });

    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        aplicarFiltros();
      }
    });
  }

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      aplicarFiltros();
    });
  });

  carregarEventos();
});
