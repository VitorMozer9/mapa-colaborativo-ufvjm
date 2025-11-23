export const GEO_SRID = 4326;

export const SCHEMA_GEO = 'geo';
export const SCHEMA_APP = 'app';
export const SCHEMA_AUTH = 'auth';

export const TABELA_POI = `${SCHEMA_GEO}.poi`;
export const TABELA_CAMINHO = `${SCHEMA_GEO}.walkway`;
export const TABELA_CAMINHO_TOPOLOGIA = `${SCHEMA_GEO}.walkway_topology`;
export const TABELA_PREDIO = `${SCHEMA_GEO}.building`;

export const TABELA_EVENTO = `${SCHEMA_APP}.events`;
export const TABELA_USUARIO = `${SCHEMA_AUTH}.user_account`;

// Função definida no dump: geo.closest_walkway_to_point(lon, lat)
export const FUNCAO_CAMINHO_MAIS_PROXIMO = `${SCHEMA_GEO}.closest_walkway_to_point`;
