// src/infrastructure/repositories/UserRepositoryImpl.ts
import { IRepositorioUsuario } from '../../interfaces/repositories/IUserRepository';
import { Usuario } from '../../domain/User';
import { Role } from '../../domain/Role';
import { pool } from '../database/connection';
import { Logger } from '../../shared/logger';

interface LinhaUsuario {
  user_id: number;
  email: string;
  password_hash: string;
  role: string;
  created_at: Date;
}

export class RepositorioUsuarioPostgres
  implements IRepositorioUsuario
{
  async buscarPorId(id: string): Promise<Usuario | null> {
    const sql = `
      SELECT user_id, email, password_hash, role, created_at
      FROM auth.user_account
      WHERE user_id = $1
    `;

    const resultado = await pool.query<LinhaUsuario>(sql, [
      parseInt(id, 10),
    ]);
    const linha = resultado.rows[0];

    if (!linha) return null;

    return this.mapearParaDominio(linha);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const sql = `
      SELECT user_id, email, password_hash, role, created_at
      FROM auth.user_account
      WHERE email = $1
    `;

    const resultado = await pool.query<LinhaUsuario>(sql, [email]);
    const linha = resultado.rows[0];

    if (!linha) return null;

    return this.mapearParaDominio(linha);
  }

  async criar(usuario: Usuario): Promise<Usuario> {
    const sql = `
      INSERT INTO auth.user_account (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING user_id, email, password_hash, role, created_at
    `;

    const valores = [usuario.email, usuario.senhaHash, usuario.papel];

    const resultado = await pool.query<LinhaUsuario>(sql, valores);
    const linha = resultado.rows[0];

    Logger.info(`Usuário criado: ${linha.email}`);

    return this.mapearParaDominio(linha);
  }

  async atualizar(usuario: Usuario): Promise<Usuario> {
    const sql = `
      UPDATE auth.user_account
      SET email = $1,
          password_hash = $2,
          role = $3
      WHERE user_id = $4
      RETURNING user_id, email, password_hash, role, created_at
    `;

    const valores = [
      usuario.email,
      usuario.senhaHash,
      usuario.papel,
      parseInt(usuario.id, 10),
    ];

    const resultado = await pool.query<LinhaUsuario>(sql, valores);
    const linha = resultado.rows[0];

    Logger.info(`Usuário atualizado: ${linha.email}`);

    return this.mapearParaDominio(linha);
  }

  async deletar(id: string): Promise<void> {
    const sql = `
      DELETE FROM auth.user_account
      WHERE user_id = $1
    `;

    await pool.query(sql, [parseInt(id, 10)]);

    Logger.info(`Usuário deletado: ${id}`);
  }

  private mapearParaDominio(linha: LinhaUsuario): Usuario {
    return new Usuario(
      linha.user_id.toString(),
      linha.email,
      linha.email.split('@')[0] || 'Usuário',
      linha.password_hash,
      linha.role as Role,
      linha.created_at,
      linha.created_at
    );
  }
}
