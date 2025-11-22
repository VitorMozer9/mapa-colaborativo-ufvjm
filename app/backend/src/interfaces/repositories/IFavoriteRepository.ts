import { Favorito } from '../../domain/Favorite';

export interface IRepositorioFavorito {
  buscarPorUsuario(idUsuario: string): Promise<Favorito[]>;
  buscarPorUsuarioEPOI(idUsuario: string, idPOI: string): Promise<Favorito | null>;
  criar(favorito: Favorito): Promise<Favorito>;
  deletar(id: string): Promise<void>;
}