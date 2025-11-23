import { ServicoPOI } from '../services/POIService';
import { POI, CategoriaPOI } from '../../domain/POI';
import { Coordenadas } from '../../domain/Coordinate';

export class CriarPOIUseCase {
  constructor(private readonly servicoPOI: ServicoPOI) {}

  async executar(
    nome: string,
    descricao: string,
    categoria: CategoriaPOI,
    coordenadas: Coordenadas,
    nomePredio: string,
    opcoes?: any
  ): Promise<POI> {
    return this.servicoPOI.criar(
      nome,
      descricao,
      categoria,
      coordenadas,
      nomePredio,
      opcoes
    );
  }
}

export class BuscarPOIsProximosUseCase {
  constructor(private readonly servicoPOI: ServicoPOI) {}

  async executar(coordenadas: Coordenadas, raioMetros: number): Promise<POI[]> {
    return this.servicoPOI.buscarProximos(coordenadas, raioMetros);
  }
}
