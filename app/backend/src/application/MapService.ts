import { IRepositorioMapa } from '../interfaces/IMapRepository';

export class ServicoMapa {
  constructor(
    private readonly repositorioMapa: IRepositorioMapa
  ) {}

  async obterMapaCompleto(): Promise<any> {
    return this.repositorioMapa.obterMapaCompletoGeoJSON();
  }
}
