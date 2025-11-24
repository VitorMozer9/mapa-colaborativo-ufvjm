import { POI, CategoriaPOI } from '../../domain/POI';
import { Coordenadas } from '../../domain/Coordinate';

export interface IRepositorioPOI {
  buscarPorId(id: string): Promise<POI | null>;
  buscarTodos(): Promise<POI[]>;
  buscarPorCategoria(categoria: CategoriaPOI): Promise<POI[]>;
  buscarProximos(coordenadas: Coordenadas, raioMetros: number): Promise<POI[]>;
  buscar(termo: string): Promise<POI[]>;
  criar(poi: POI): Promise<POI>;
  atualizar(poi: POI): Promise<POI>;
  deletar(id: string): Promise<void>;
}