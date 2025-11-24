import { CategoriaPOI } from '../../domain/POI';
import { Coordenadas } from '../../domain/Coordinate';

export interface CriarPOIDTO {
  nome: string;
  descricao: string;
  categoria: CategoriaPOI;
  coordenadas: Coordenadas;
  nomePredio: string;
  andar?: string;
  numeroSala?: string;
  urlImagem?: string;
  ehAcessivel?: boolean;
}
