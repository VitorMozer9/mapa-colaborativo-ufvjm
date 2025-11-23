import { IRepositorioFavorito } from '../../interfaces/repositories/IFavoriteRepository';
import { Favorito } from '../../domain/Favorite';
import { pool } from '../database/connection';
import { Logger } from '../../shared/logger';

interface LinhaFavorito {
  id: number;
  user_id: number;
  poi_id: number;
  created_at: Date;
}

export class RepositorioFavoritoPostgres implements IRepositorioFavorito {
  async buscarPorUsuario(idUsuario: string): Promise<Favorito[]> {
    const sql = `
      SELECT id, user_id, poi_id, created_at
      FROM app.favorites
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const resultado = await pool.query<LinhaFavorito>(sql, [parseInt(idUsuario, 10)]);
    return resultado.rows.map((linha) => this.mapearParaDominio(linha));
  }

  async buscarPorUsuarioEPOI(idUsuario: string, idPOI: string): Promise<Favorito | null> {
    const sql = `
      SELECT id, user_id, poi_id, created_at
      FROM app.favorites
      WHERE user_id = $1 AND poi_id = $2
      LIMIT 1
    `;

    const resultado = await pool.query<LinhaFavorito>(sql, [
      parseInt(idUsuario, 10),
      parseInt(idPOI, 10),
    ]);
    const linha = resultado.rows[0];

    if (!linha) return null;

    return this.mapearParaDominio(linha);
  }

  async criar(favorito: Favorito): Promise<Favorito> {
    const sql = `
      INSERT INTO app.favorites (user_id, poi_id)
      VALUES ($1, $2)
      RETURNING id, user_id, poi_id, created_at
    `;

    const resultado = await pool.query<LinhaFavorito>(sql, [
      parseInt(favorito.idUsuario, 10),
      parseInt(favorito.idPOI, 10),
    ]);

    Logger.info(`Favorito criado: usuario ${favorito.idUsuario}, poi ${favorito.idPOI}`);
    return this.mapearParaDominio(resultado.rows[0]);
  }

  async deletar(id: string): Promise<void> {
    const sql = `DELETE FROM app.favorites WHERE id = $1`;
    await pool.query(sql, [parseInt(id, 10)]);
    Logger.info(`Favorito deletado: ${id}`);
  }

  private mapearParaDominio(linha: LinhaFavorito): Favorito {
    return new Favorito(
      linha.id.toString(),
      linha.user_id.toString(),
      linha.poi_id.toString(),
      linha.created_at
    );
  }
}
