import { pool } from '../config/db';
import { IRepositorioMapa } from '../../interfaces/IMapRepository';
import { Logger } from '../../shared/logger';

export class RepositorioMapaPostgres implements IRepositorioMapa {
  async obterMapaCompletoGeoJSON(): Promise<any> {
    const sql = `
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(
          json_build_object(
            'type', 'Feature',
            'geometry', elemento.geom_json,
            'properties', elemento.propriedades
          )
        )
      ) AS geojson
      FROM (
        -- Pontos de interesse (POIs)
        SELECT
          ST_AsGeoJSON(p.geom)::json AS geom_json,
          json_build_object(
            'id', p.poi_id,
            'nome', p.name,
            'categoria', p.category,
            'descricao', p.description,
            'camada', 'ponto'
          ) AS propriedades
        FROM geo.poi p

        UNION ALL

        -- Caminhos / passagens (linhas)
        SELECT
          ST_AsGeoJSON(w.geom)::json AS geom_json,
          json_build_object(
            'id', w.walkway_id,
            'nome', w.name,
            'acessivel', w.is_accessible,
            'camada', 'linha'
          ) AS propriedades
        FROM geo.walkway w

        UNION ALL

        -- Prédios (polígonos)
        SELECT
          ST_AsGeoJSON(b.geom)::json AS geom_json,
          json_build_object(
            'id', b.building_id,
            'nome', b.name,
            'camada', 'poligono'
          ) AS propriedades
        FROM geo.building b
      ) AS elemento;
    `;

    try {
      const resultado = await pool.query<{ geojson: any }>(sql);
      const linha = resultado.rows[0];

      if (!linha || !linha.geojson) {
        Logger.warn('RepositórioMapa: nenhuma geometria encontrada');
        return {
          type: 'FeatureCollection',
          features: [],
        };
      }

      return linha.geojson;
    } catch (erro) {
      Logger.error('Erro ao buscar mapa completo GeoJSON', erro as Error);
      throw erro;
    }
  }
}
