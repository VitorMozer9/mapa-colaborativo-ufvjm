import { IRepositorioEvento } from '../../interfaces/repositories/IEventRepository';
import { Evento } from '../../domain/Event';
import { pool } from '../database/connection';
import { Logger } from '../../shared/logger';

interface LinhaEvento {
  event_id: number;
  title: string;
  description: string | null;
  start_at: Date | null;
  end_at: Date | null;
  poi_id: number | null;
}

export class RepositorioEventoPostgres implements IRepositorioEvento {
  private mapearParaDominio(linha: LinhaEvento): Evento {
    return new Evento(
      linha.event_id.toString(),
      linha.title,
      linha.description || '',
      linha.start_at || new Date(),
      linha.end_at || new Date(),
      linha.poi_id ? `POI ${linha.poi_id}` : 'Local não informado',
      linha.poi_id?.toString(),
      undefined,
      undefined,
      linha.start_at || new Date(),
      linha.end_at || new Date()
    );
  }

  async buscarPorId(id: string): Promise<Evento | null> {
    const sql = `
      SELECT event_id, title, description, start_at, end_at, poi_id
      FROM app.events
      WHERE event_id = $1
    `;

    const resultado = await pool.query<LinhaEvento>(sql, [parseInt(id, 10)]);
    const linha = resultado.rows[0];

    if (!linha) return null;

    return this.mapearParaDominio(linha);
  }

  async buscarTodos(): Promise<Evento[]> {
    const sql = `
      SELECT event_id, title, description, start_at, end_at, poi_id
      FROM app.events
      ORDER BY start_at DESC NULLS LAST
    `;

    const resultado = await pool.query<LinhaEvento>(sql);
    return resultado.rows.map((linha) => this.mapearParaDominio(linha));
  }

  async buscarAtivos(): Promise<Evento[]> {
    const sql = `
      SELECT event_id, title, description, start_at, end_at, poi_id
      FROM app.events
      WHERE start_at <= NOW() AND (end_at IS NULL OR end_at >= NOW())
      ORDER BY start_at ASC
    `;

    const resultado = await pool.query<LinhaEvento>(sql);
    return resultado.rows.map((linha) => this.mapearParaDominio(linha));
  }

  async buscarProximos(): Promise<Evento[]> {
    const sql = `
      SELECT event_id, title, description, start_at, end_at, poi_id
      FROM app.events
      WHERE start_at > NOW()
      ORDER BY start_at ASC
    `;

    const resultado = await pool.query<LinhaEvento>(sql);
    return resultado.rows.map((linha) => this.mapearParaDominio(linha));
  }

  async buscarPorPOI(idPOI: string): Promise<Evento[]> {
    const sql = `
      SELECT event_id, title, description, start_at, end_at, poi_id
      FROM app.events
      WHERE poi_id = $1
      ORDER BY start_at DESC NULLS LAST
    `;

    const resultado = await pool.query<LinhaEvento>(sql, [parseInt(idPOI, 10)]);
    return resultado.rows.map((linha) => this.mapearParaDominio(linha));
  }

  async criar(evento: Evento): Promise<Evento> {
    const sql = `
      INSERT INTO app.events (title, description, start_at, end_at, poi_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING event_id, title, description, start_at, end_at, poi_id
    `;

    const resultado = await pool.query<LinhaEvento>(sql, [
      evento.titulo,
      evento.descricao,
      evento.dataInicio,
      evento.dataFim,
      evento.idPOI ? parseInt(evento.idPOI, 10) : null,
    ]);

    Logger.info(`Evento criado: ${evento.titulo}`);
    return this.mapearParaDominio(resultado.rows[0]);
  }

  async atualizar(evento: Evento): Promise<Evento> {
    const sql = `
      UPDATE app.events
      SET title = $1,
          description = $2,
          start_at = $3,
          end_at = $4,
          poi_id = $5
      WHERE event_id = $6
      RETURNING event_id, title, description, start_at, end_at, poi_id
    `;

    const resultado = await pool.query<LinhaEvento>(sql, [
      evento.titulo,
      evento.descricao,
      evento.dataInicio,
      evento.dataFim,
      evento.idPOI ? parseInt(evento.idPOI, 10) : null,
      parseInt(evento.id, 10),
    ]);

    Logger.info(`Evento atualizado: ${evento.id}`);
    return this.mapearParaDominio(resultado.rows[0]);
  }

  async deletar(id: string): Promise<void> {
    const sql = `DELETE FROM app.events WHERE event_id = $1`;
    await pool.query(sql, [parseInt(id, 10)]);
    Logger.info(`Evento deletado: ${id}`);
  }
}
