import { IRepositorioMapa } from '../../interfaces/repositories/IMapRepository';

export class ServicoMapa {
  constructor(private readonly repositorioMapa: IRepositorioMapa) {}

  async obterMapaCompleto(): Promise<any> {
    return this.repositorioMapa.obterMapaCompletoGeoJSON();
  }

  async obterConfiguracaoMapa(): Promise<{
    bounds: [[number, number], [number, number]];
  }> {
    return this.repositorioMapa.obterLimitesMapa();
  }
}
