import { Evento } from '../../domain/Event';

export interface IRepositorioEvento {
  buscarPorId(id: string): Promise<Evento | null>;
  buscarTodos(): Promise<Evento[]>;
  buscarAtivos(): Promise<Evento[]>;
  buscarProximos(): Promise<Evento[]>;
  buscarPorPOI(idPOI: string): Promise<Evento[]>;
  criar(evento: Evento): Promise<Evento>;
  atualizar(evento: Evento): Promise<Evento>;
  deletar(id: string): Promise<void>;
}