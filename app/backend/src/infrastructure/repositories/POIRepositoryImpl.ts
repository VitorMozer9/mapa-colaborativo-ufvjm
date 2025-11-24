import { IRepositorioPOI } from '../../interfaces/repositories/IPOIRepository';
import { POI, CategoriaPOI } from '../../domain/POI';
import { Coordenadas } from '../../domain/Coordinate';
import { pool } from '../database/connection';
import { Logger } from '../../shared/logger';

interface LinhaPOI {
  poi_id: number;
  name: string;
  description: string | null;
  category: string | null;
  latitude: number;
  longitude: number;
  created_at?: Date;
  updated_at?: Date;
}

export class RepositorioPOIPostgres implements IRepositorioPOI {
  async buscarPorId(id: string): Promise<POI | null> {
    const sql = `
      SELECT 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude
      FROM geo.poi
      WHERE poi_id = $1
    `;

    const resultado = await pool.query<LinhaPOI>(sql, [parseInt(id, 10)]);
    const linha = resultado.rows[0];

    if (!linha) return null;

    return this.mapearParaDominio(linha);
  }

  async buscarTodos(): Promise<POI[]> {
    const sql = `
      SELECT 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude
      FROM geo.poi
      ORDER BY name
    `;

    const resultado = await pool.query<LinhaPOI>(sql);
    return resultado.rows.map((linha) => this.mapearParaDominio(linha));
  }

  async buscarPorCategoria(categoria: CategoriaPOI): Promise<POI[]> {
    const sql = `
      SELECT 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude
      FROM geo.poi 
      WHERE category = $1
      ORDER BY name
    `;

    const resultado = await pool.query<LinhaPOI>(sql, [categoria]);
    return resultado.rows.map((linha) => this.mapearParaDominio(linha));
  }

  async buscarProximos(coordenadas: Coordenadas, raioMetros: number): Promise<POI[]> {
    const sql = `
      SELECT 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude
      FROM geo.poi 
      WHERE ST_DWithin(
        geom::geography,
        ST_SetSRID(ST_Point($1, $2), 4326)::geography,
        $3
      )
      ORDER BY ST_Distance(
        geom::geography,
        ST_SetSRID(ST_Point($1, $2), 4326)::geography
      )
    `;

    const resultado = await pool.query<LinhaPOI>(sql, [
      coordenadas.longitude,
      coordenadas.latitude,
      raioMetros,
    ]);

    return resultado.rows.map((linha) => this.mapearParaDominio(linha));
  }

  async buscar(termo: string): Promise<POI[]> {
    const sql = `
      SELECT 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude
      FROM geo.poi 
      WHERE name ILIKE $1 OR description ILIKE $1
      ORDER BY name
    `;

    const resultado = await pool.query<LinhaPOI>(sql, [`%${termo}%`]);
    return resultado.rows.map((linha) => this.mapearParaDominio(linha));
  }

  async criar(poi: POI): Promise<POI> {
    const sql = `
      INSERT INTO geo.poi (name, description, category, geom)
      VALUES ($1, $2, $3, ST_SetSRID(ST_Point($4, $5), 4326))
      RETURNING 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude
    `;

    const resultado = await pool.query<LinhaPOI>(sql, [
      poi.nome,
      poi.descricao,
      poi.categoria,
      poi.coordenadas.longitude,
      poi.coordenadas.latitude,
    ]);

    Logger.info(`POI criado: ${poi.nome}`);
    return this.mapearParaDominio(resultado.rows[0]);
  }

  async atualizar(poi: POI): Promise<POI> {
    const sql = `
      UPDATE geo.poi 
      SET 
        name = $1,
        description = $2,
        category = $3,
        geom = ST_SetSRID(ST_Point($4, $5), 4326)
      WHERE poi_id = $6
      RETURNING 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude
    `;

    const resultado = await pool.query<LinhaPOI>(sql, [
      poi.nome,
      poi.descricao,
      poi.categoria,
      poi.coordenadas.longitude,
      poi.coordenadas.latitude,
      parseInt(poi.id, 10),
    ]);

    Logger.info(`POI atualizado: ${poi.id}`);
    return this.mapearParaDominio(resultado.rows[0]);
  }

  async deletar(id: string): Promise<void> {
    const sql = `DELETE FROM geo.poi WHERE poi_id = $1`;
    await pool.query(sql, [parseInt(id, 10)]);
    Logger.info(`POI deletado: ${id}`);
  }

  private mapearParaDominio(linha: LinhaPOI): POI {
    const coordenadas: Coordenadas = {
      latitude: linha.latitude,
      longitude: linha.longitude,
    };

    return new POI(
      linha.poi_id.toString(),
      linha.name,
      linha.description || '',
      (linha.category as CategoriaPOI) || CategoriaPOI.OUTRO,
      coordenadas,
      'Predio desconhecido'
    );
  }
}
