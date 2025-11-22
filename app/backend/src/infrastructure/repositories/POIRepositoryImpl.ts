import { IPOIRepository } from '../../interfaces/repositories/IPOIRepository';
import { POI, CategoriaPOI } from '../../dominio/POI';
import { Coordenadas } from '../../domain/Coordinate';
import { pool } from '../database/connection';
import { Logger } from '../../compartilhado/logger';

export class RepositorioPOIPostgres implements IPOIRepository {
  async buscarPorId(id: string): Promise<POI | null> {
    const sql = `
      SELECT 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude,
        created_at,
        updated_at
      FROM geo.poi 
      WHERE poi_id = $1
    `;
    
    try {
      const resultado = await pool.query(sql, [id]);
      return resultado.rows.length > 0 ? this.mapearParaDominio(resultado.rows[0]) : null;
    } catch (erro) {
      Logger.erro('Erro ao buscar POI por ID', erro as Error);
      throw erro;
    }
  }

  async buscarTodos(): Promise<POI[]> {
    const sql = `
      SELECT 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude,
        created_at,
        updated_at
      FROM geo.poi 
      ORDER BY name
    `;

    try {
      const resultado = await pool.query(sql);
      return resultado.rows.map(linha => this.mapearParaDominio(linha));
    } catch (erro) {
      Logger.erro('Erro ao buscar todos os POIs', erro as Error);
      throw erro;
    }
  }

  async buscarPorCategoria(categoria: CategoriaPOI): Promise<POI[]> {
    const sql = `
      SELECT 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude,
        created_at,
        updated_at
      FROM geo.poi 
      WHERE category = $1 
      ORDER BY name
    `;

    try {
      const resultado = await pool.query(sql, [categoria]);
      return resultado.rows.map(linha => this.mapearParaDominio(linha));
    } catch (erro) {
      Logger.erro('Erro ao buscar POIs por categoria', erro as Error);
      throw erro;
    }
  }

  // Busca POIs próximos usando distância geométrica do PostGIS
  async buscarProximos(coordenadas: Coordenadas, raioMetros: number): Promise<POI[]> {
    const sql = `
      SELECT 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude,
        created_at,
        updated_at
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

    try {
      const resultado = await pool.query(sql, [
        coordenadas.longitude,
        coordenadas.latitude,
        raioMetros
      ]);

      return resultado.rows.map(linha => this.mapearParaDominio(linha));
    } catch (erro) {
      Logger.erro('Erro ao buscar POIs próximos', erro as Error);
      throw erro;
    }
  }

  // Busca POIs por termo (nome ou descrição)
  async buscar(termo: string): Promise<POI[]> {
    const sql = `
      SELECT 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude,
        created_at,
        updated_at
      FROM geo.poi 
      WHERE name ILIKE $1 OR description ILIKE $1
      ORDER BY name
    `;

    try {
      const resultado = await pool.query(sql, [`%${termo}%`]);
      return resultado.rows.map(linha => this.mapearParaDominio(linha));
    } catch (erro) {
      Logger.erro('Erro ao buscar POIs por termo', erro as Error);
      throw erro;
    }
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
        ST_X(geom) as longitude,
        created_at,
        updated_at
    `;

    try {
      const resultado = await pool.query(sql, [
        poi.nome,
        poi.descricao,
        poi.categoria,
        poi.coordenadas.longitude,
        poi.coordenadas.latitude
      ]);

      Logger.info(`POI criado: ${poi.nome}`);
      return this.mapearParaDominio(resultado.rows[0]);
    } catch (erro) {
      Logger.erro('Erro ao criar POI', erro as Error);
      throw erro;
    }
  }

  async atualizar(poi: POI): Promise<POI> {
    const sql = `
      UPDATE geo.poi 
      SET name = $1, description = $2, category = $3
      WHERE poi_id = $4
      RETURNING 
        poi_id,
        name,
        description,
        category,
        ST_Y(geom) as latitude,
        ST_X(geom) as longitude,
        created_at,
        updated_at
    `;

    try {
      const resultado = await pool.query(sql, [
        poi.nome,
        poi.descricao,
        poi.categoria,
        poi.id
      ]);

      Logger.info(`POI atualizado: ${poi.id}`);
      return this.mapearParaDominio(resultado.rows[0]);
    } catch (erro) {
      Logger.erro('Erro ao atualizar POI', erro as Error);
      throw erro;
    }
  }

  async deletar(id: string): Promise<void> {
    const sql = `DELETE FROM geo.poi WHERE poi_id = $1`;

    try {
      await pool.query(sql, [id]);
      Logger.info(`POI deletado: ${id}`);
    } catch (erro) {
      Logger.erro('Erro ao deletar POI', erro as Error);
      throw erro;
    }
  }

  // Converte linha do banco para entidade de domínio
  private mapearParaDominio(linha: any): POI {
    return new POI(
      linha.poi_id.toString(),
      linha.name,
      linha.description || '',
      linha.category as CategoriaPOI,
      {
        latitude: linha.latitude,
        longitude: linha.longitude
      },
      '', // nomePredio não está no banco
      undefined,
      undefined,
      undefined,
      false,
      linha.created_at,
      linha.updated_at
    );
  }
}