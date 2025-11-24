// src/infrastructure/repositories/PathRepositoryImpl.ts
import { IWalkwayRepository } from '../../interfaces/repositories/IWalkwayRepository';
import { Caminho } from '../../domain/Walkway';
import { pool } from '../database/connection';
import { Logger } from '../../shared/logger';

interface LinhaCaminho {
  walkway_id: number;
  name: string | null;
  geom_json: any;
  is_accessible: boolean;
}

export class RepositorioCaminhoPostgres implements IWalkwayRepository {
  private mapearCoordenadas(geomJson: any): Array<[number, number]> {
    if (!geomJson || geomJson.type !== 'LineString') return [];
    return geomJson.coordinates as Array<[number, number]>;
  }

  private mapearParaDominio(linha: LinhaCaminho): Caminho {
    const coordenadas = this.mapearCoordenadas(linha.geom_json);
    return new Caminho(
      linha.walkway_id.toString(),
      linha.name || `Caminho ${linha.walkway_id}`,
      coordenadas,
      linha.is_accessible,
      new Date(),
      new Date()
    );
  }

  async buscarPorId(id: string): Promise<Caminho | null> {
    const sql = `
      SELECT 
        walkway_id,
        name,
        ST_AsGeoJSON(geom)::json AS geom_json,
        is_accessible
      FROM geo.walkway
      WHERE walkway_id = $1
    `;

    const resultado = await pool.query<LinhaCaminho>(sql, [parseInt(id, 10)]);
    const linha = resultado.rows[0];
    if (!linha) return null;

    return this.mapearParaDominio(linha);
  }

  async buscarTodos(): Promise<Caminho[]> {
    const sql = `
      SELECT 
        walkway_id,
        name,
        ST_AsGeoJSON(geom)::json AS geom_json,
        is_accessible
      FROM geo.walkway
      ORDER BY walkway_id
    `;

    const resultado = await pool.query<LinhaCaminho>(sql);
    return resultado.rows.map((linha) => this.mapearParaDominio(linha));
  }

  async buscarAcessiveis(): Promise<Caminho[]> {
    const sql = `
      SELECT 
        walkway_id,
        name,
        ST_AsGeoJSON(geom)::json AS geom_json,
        is_accessible
      FROM geo.walkway
      WHERE is_accessible = true
      ORDER BY walkway_id
    `;

    const resultado = await pool.query<LinhaCaminho>(sql);
    return resultado.rows.map((linha) => this.mapearParaDominio(linha));
  }

  async criar(caminho: Caminho): Promise<Caminho> {
    const sql = `
      INSERT INTO geo.walkway (name, geom, is_accessible)
      VALUES (
        $1,
        ST_SetSRID(
          ST_MakeLine(
            ARRAY(
              SELECT ST_SetSRID(ST_Point(p[1], p[2]), 4326)
              FROM jsonb_array_elements($2::jsonb) AS p_elem(p)
            )
          ),
          4326
        ),
        $3
      )
      RETURNING 
        walkway_id,
        name,
        ST_AsGeoJSON(geom)::json AS geom_json,
        is_accessible
    `;

    // Transformar coordenadas em JSON de pares [lon, lat]
    const coordenadasJson = JSON.stringify(
      caminho.coordenadas.map(([lon, lat]) => [lon, lat])
    );

    const resultado = await pool.query<LinhaCaminho>(sql, [
      caminho.nome,
      coordenadasJson,
      caminho.ehAcessivel,
    ]);

    Logger.info(`Caminho criado: ${caminho.nome}`);
    return this.mapearParaDominio(resultado.rows[0]);
  }

  async atualizar(caminho: Caminho): Promise<Caminho> {
    const sql = `
      UPDATE geo.walkway
      SET 
        name = $1,
        geom = ST_SetSRID(
          ST_MakeLine(
            ARRAY(
              SELECT ST_SetSRID(ST_Point(p[1], p[2]), 4326)
              FROM jsonb_array_elements($2::jsonb) AS p_elem(p)
            )
          ),
          4326
        ),
        is_accessible = $3
      WHERE walkway_id = $4
      RETURNING 
        walkway_id,
        name,
        ST_AsGeoJSON(geom)::json AS geom_json,
        is_accessible
    `;

    const coordenadasJson = JSON.stringify(
      caminho.coordenadas.map(([lon, lat]) => [lon, lat])
    );

    const resultado = await pool.query<LinhaCaminho>(sql, [
      caminho.nome,
      coordenadasJson,
      caminho.ehAcessivel,
      parseInt(caminho.id, 10),
    ]);

    Logger.info(`Caminho atualizado: ${caminho.id}`);
    return this.mapearParaDominio(resultado.rows[0]);
  }

  async deletar(id: string): Promise<void> {
    const sql = `DELETE FROM geo.walkway WHERE walkway_id = $1`;
    await pool.query(sql, [parseInt(id, 10)]);
    Logger.info(`Caminho deletado: ${id}`);
  }
}
