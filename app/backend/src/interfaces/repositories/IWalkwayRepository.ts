import { Caminho } from '../../domain/Walkway';

export interface IWalkwayRepository {
  buscarPorId(id: string): Promise<Caminho | null>;
  buscarTodos(): Promise<Caminho[]>;
  criar(caminho: Caminho): Promise<Caminho>;
  atualizar(caminho: Caminho): Promise<Caminho>;
  deletar(id: string): Promise<void>;
}