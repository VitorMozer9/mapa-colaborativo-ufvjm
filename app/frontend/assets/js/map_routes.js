document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.searchbar input');
    const searchBarContainer = document.querySelector('.searchbar');
    let map = null; 
    
    let currentRouteLayer = null;
    let selectedPOI = null;
    let userLocation = null;
    
    const favButton = document.createElement('div');
    favButton.className = 'route-fav-btn';
    favButton.innerHTML = '❤️';
    favButton.style.display = 'none'; 
    document.body.appendChild(favButton); 

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            userLocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
        }, err => console.error("Erro ao pegar localização", err));
    }
    
    const suggestionsList = document.createElement('ul');
    suggestionsList.className = 'search-suggestions';
    searchBarContainer.appendChild(suggestionsList);

    searchInput.addEventListener('input', async (e) => {
        const term = e.target.value;
        if (term.length < 2) {
            suggestionsList.style.display = 'none';
            return;
        }

        try {
            const response = await window.API.searchPOIs(term);
            const pois = response.dados || [];
            
            suggestionsList.innerHTML = '';
            
            if (pois.length > 0) {
                suggestionsList.style.display = 'block';
                pois.forEach(poi => {
                    const li = document.createElement('li');
                    li.textContent = poi.nome; 
                    li.style.padding = '8px';
                    li.style.cursor = 'pointer';
                    li.style.background = '#fff';
                    li.style.borderBottom = '1px solid #eee';

                    li.addEventListener('click', () => {
                        selectPOI(poi);
                        suggestionsList.style.display = 'none';
                        searchInput.value = poi.nome;
                    });
                    suggestionsList.appendChild(li);
                });
            } else {
                suggestionsList.style.display = 'none';
            }
        } catch (err) {
            console.error(err);
        }
    });

    async function selectPOI(poi) {
        selectedPOI = poi;
        
        if (window.map) {
            window.map.setView([poi.coordenadas.latitude, poi.coordenadas.longitude], 18);
            
            L.marker([poi.coordenadas.latitude, poi.coordenadas.longitude])
             .addTo(window.map)
             .bindPopup(`<b>${poi.nome}</b><br>${poi.descricao || ''}`)
             .openPopup();
        }

        if (userLocation) {
            try {
                const geoJsonRota = await window.API.calculateRoute(
                    userLocation.lat, 
                    userLocation.lng, 
                    poi.coordenadas.latitude, 
                    poi.coordenadas.longitude
                );

                if (window.map) {
                    // Remover rota anterior
                    if (currentRouteLayer) {
                        window.map.removeLayer(currentRouteLayer);
                    }

                    // Desenhar nova rota (Linha Azul)
                    currentRouteLayer = L.geoJSON(geoJsonRota, {
                        style: { color: '#00659f', weight: 5, opacity: 0.8 }
                    }).addTo(window.map);

                    // Ajustar zoom para caber a rota
                    window.map.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });
                    
                    // Mostrar botão de favoritar (Feature 3)
                    updateFavoriteButtonState(poi.id);
                }
            } catch (err) {
                console.error("Erro ao traçar rota", err);
                alert("Não foi possível traçar a rota neste momento.");
            }
        } else {
            alert("Ative a localização para traçar a rota.");
        }
    }


    async function updateFavoriteButtonState(poiId) {
        favButton.style.display = 'flex';
        
        // Verificar se ja e favorito
        const favoritos = await window.API.fetchFavorites();
        const isFav = favoritos.dados.some(f => f.idPOI === poiId);

        updateFavIcon(isFav);
        
        // Limpa antigos clonando o nó
        const newBtn = favButton.cloneNode(true);
        favButton.parentNode.replaceChild(newBtn, favButton);
        
        newBtn.addEventListener('click', async () => {
            const currentUser = window.API.getCurrentUser();
            if (!currentUser) {
                alert("Faça login para salvar favoritos.");
                return;
            }

            try {
                if (isFav) {
                    alert("Este local já está nos seus favoritos!");
                } else {
                    await window.API.addFavorite(poiId);
                    updateFavIcon(true);
                    alert("Rota/Local salvo nos favoritos!");
                }
            } catch (err) {
                console.error(err);
            }
        });
        
        favButton = newBtn;
    }

    function updateFavIcon(active) {
        favButton.style.backgroundColor = active ? '#ff4d4d' : '#white';
        favButton.style.color = active ? '#fff' : '#ff4d4d';
        favButton.style.border = active ? 'none' : '2px solid #ff4d4d';
    }
});