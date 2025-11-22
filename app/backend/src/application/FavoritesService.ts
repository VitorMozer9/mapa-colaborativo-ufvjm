import { IRepositorioFavorito } from '../interfaces/repositories/IFavoriteRepository';
import { Favorito } from '../domain/Favorite';
import { NotFoundError } from '../shared/errors';

export class ServicoFavoritos {
  constructor(private readonly repositorioFavorito: IRepositorioFavorito) {}

  // Lista todos os favoritos de um usuário
  async listarPorUsuario(idUsuario: string): Promise<Favorito[]> {
    return this.repositorioFavorito.buscarPorUsuario(idUsuario);
  }

  // Adiciona um POI aos favoritos do usuário
  async adicionar(idUsuario: string, idPOI: string): Promise<Favorito> {
    const favoritoExistente = await this.repositorioFavorito.buscarPorUsuarioEPOI(idUsuario, idPOI);
    if (favoritoExistente) {
      return favoritoExistente;
    }
    const favorito = Favorito.criar(idUsuario, idPOI);
    return this.repositorioFavorito.criar(favorito);
  }

  // Remove um POI dos favoritos
  async remover(idFavorito: string): Promise<void> {
    await this.repositorioFavorito.deletar(idFavorito);
  }
}