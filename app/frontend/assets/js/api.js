(function () {
  const API_BASE_URL = 'http://localhost:3000/api';

  function getToken() {
    return localStorage.getItem('authToken');
  }

  function setAuth(token, usuario) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(usuario));
  }

  function clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }

  function getCurrentUser() {
    const raw = localStorage.getItem('authUser');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async function apiFetch(path, options = {}) {
    const headers = options.headers ? { ...options.headers } : {};

    // JSON por padrão
    if (!headers['Content-Type'] && options.body) {
      headers['Content-Type'] = 'application/json';
    }

    const token = getToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      let message = 'Erro na requisição';
      try {
        const data = await response.json();
        if (data.mensagem) message = data.mensagem; 
      } catch {

      }
      throw new Error(message);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // ---------- Autenticação ----------
  async function registerUser({ nome, email, senha, papel = 'user', ...outrosDados }) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha, papel, ...outrosDados })
    });
    // data = { usuario, token }:contentReference[oaicite:16]{index=16}
    setAuth(data.token, data.usuario);
    return data;
  }

  async function loginUser({ email, senha }) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });
    setAuth(data.token, data.usuario);
    return data;
  }

  // ---------- Eventos ----------
  async function fetchUpcomingEvents() {
    return apiFetch('/events/proximos');
  }

  async function fetchActiveEvents() {
    return apiFetch('/events/ativos');
  }

  async function fetchAllEvents() {
    return apiFetch('/events');
  }

  // ---------- Favoritos ----------
  async function fetchFavorites() {
    return apiFetch('/favorites');
  }

  async function addFavorite(idPOI) {
    return apiFetch('/favorites', {
      method: 'POST',
      body: JSON.stringify({ idPOI })
    });
  }

  async function removeFavorite(idFavorito) {
    return apiFetch(`/favorites/${encodeURIComponent(idFavorito)}`, {
      method: 'DELETE'
    });
  }

  // ---------- POIs ----------
  async function searchPOIs(termo) {
    return apiFetch(`/pois/busca?termo=${encodeURIComponent(termo)}`);
  }

  async function getAllPOIs() {
    return apiFetch('/pois');
  }

// ---------- Caminhos / Rotas ----------
  async function calculateRoute(latOrigem, lonOrigem, latDestino, lonDestino) {
    return apiFetch(`/paths/rota/calcular?latOrigem=${latOrigem}&lonOrigem=${lonOrigem}&latDestino=${latDestino}&lonDestino=${lonDestino}`);
  }

  // Expor no escopo global
  window.API = {
    apiFetch,
    registerUser,
    loginUser,
    fetchUpcomingEvents,
    fetchActiveEvents,
    fetchAllEvents,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    searchPOIs,
    getToken,
    setAuth,
    clearAuth,
    getAllPOIs,
    calculateRoute,
    getCurrentUser
  };
})();
