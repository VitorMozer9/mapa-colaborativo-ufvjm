document.addEventListener('DOMContentLoaded', async () => {
    const selOrigem = document.getElementById('select-origin');
    const selDest = document.getElementById('select-dest');
    const btnIr = document.getElementById('btn-trace-route');
    const btnLimpar = document.getElementById('btn-clear-route');
    const btnFav = document.getElementById('btn-fav-route');

    let currentRouteLayer = null;
    let currentDestId = null;
    let userLocation = null;
    let dbPOIs = [];

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            userLocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            if (selOrigem) {
                selOrigem.options[0].text = "📍 Minha Localização (Atual)";
                selOrigem.options[0].value = JSON.stringify(userLocation);
            }
        }, err => {
            console.error("Erro GPS:", err);
            if (selOrigem) selOrigem.options[0].text = "📍 Minha Localização (Não permitida)";
        });
    }

    async function initComboboxes() {
        try {
            if (!window.API || !window.API.getAllPOIs) return;
            const response = await window.API.getAllPOIs();
            dbPOIs = response.dados || [];

            dbPOIs.sort((a, b) => a.nome.localeCompare(b.nome));

            dbPOIs.forEach(poi => {
                let opt1 = document.createElement('option');
                opt1.value = JSON.stringify(poi.coordenadas);
                opt1.textContent = poi.nome;
                selOrigem.appendChild(opt1);

                let opt2 = document.createElement('option');
                opt2.value = JSON.stringify(poi.coordenadas);
                opt2.dataset.id = poi.id; 
                opt2.textContent = poi.nome;
                selDest.appendChild(opt2);
            });
        } catch (e) {
            console.error("Erro ao carregar POIs:", e);
        }
    }
    
    initComboboxes();

    btnIr.addEventListener('click', async () => {
        const origemVal = selOrigem.value;
        const destVal = selDest.value;

        if (!origemVal || !destVal) {
            alert("Selecione uma origem e um destino válidos.");
            return;
        }

        if (origemVal === "" && !userLocation) {
            alert("Aguardando localização ou selecione um ponto de partida.");
            return;
        }

        const coordsOrigem = JSON.parse(origemVal || JSON.stringify(userLocation));
        const coordsDest = JSON.parse(destVal);

        currentDestId = selDest.options[selDest.selectedIndex].dataset.id;

        try {
            if (currentRouteLayer && window.map) {
                window.map.removeLayer(currentRouteLayer);
            }

            const geoJson = await window.API.calculateRoute(
                coordsOrigem.latitude || coordsOrigem.lat,
                coordsOrigem.longitude || coordsOrigem.lng,
                coordsDest.latitude,
                coordsDest.longitude
            );

            if (!geoJson || !geoJson.features || geoJson.features.length === 0) {
                alert("Não foi possível traçar uma rota entre estes pontos.");
                return;
            }

            if (window.map) {
                currentRouteLayer = L.geoJSON(geoJson, {
                    style: { color: '#00659f', weight: 6, opacity: 0.8 }
                }).addTo(window.map);

                window.map.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });

                if (btnFav) {
                    btnFav.style.display = 'flex';
                    checkFavoriteStatus(currentDestId);
                }
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao calcular rota. Verifique sua conexão.");
        }
    });

    btnLimpar.addEventListener('click', () => {
        if (currentRouteLayer && window.map) {
            window.map.removeLayer(currentRouteLayer);
        }
        if (btnFav) btnFav.style.display = 'none';
        selOrigem.value = "";
        selDest.value = "";
    });

    async function checkFavoriteStatus(poiId) {
        btnFav.classList.remove('active');
    }

    btnFav.addEventListener('click', async () => {
        if (!currentDestId) return;
        try {
            await window.API.addFavorite(currentDestId);
            btnFav.classList.add('active');
            alert("Destino salvo nos Favoritos!");
        } catch (err) {
            
            
            alert("Atenção: " + err.message);
        }
    });

    if (window.map) {
        window.map.on('popupopen', function(e) {
            const popupContent = e.popup.getContent();
            if (typeof popupContent === 'string') {
                for (let i = 0; i < selDest.options.length; i++) {
                    if (popupContent.includes(selDest.options[i].text)) {
                        selDest.selectedIndex = i;
                        break;
                    }
                }
            }
        });
    }
});