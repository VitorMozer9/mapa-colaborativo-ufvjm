import { IRepositorioPOI } from '../interfaces/repositories/IPOIRepository';
import { POI, CategoriaPOI } from '../domain/POI';
import { Coordenadas } from '../domain/Coordinate';
import { NotFoundError } from '../shared/errors';
import { ValidationError } from '../shared/errors';

export class ServicoPOI {
  constructor(private readonly repositorioPOI: IRepositorioPOI) {}

  // Retorna um POI específico
  async buscarPorId(idPOI: string): Promise<POI> {
    const poi = await this.repositorioPOI.buscarPorId(idPOI);
    if (!poi) {
      throw new NotFoundError('POI');
    }
    return poi;
  }

  // Retorna todos os POIs
  async buscarTodos(): Promise<POI[]> {
    return this.repositorioPOI.buscarTodos();
  }

  // Retorna POIs de uma categoria específica
  async buscarPorCategoria(categoria: CategoriaPOI): Promise<POI[]> {
    return this.repositorioPOI.buscarPorCategoria(categoria);
  }

  // Busca POIs próximos a uma localização (raio em metros)
  async buscarProximos(coordenadas: Coordenadas, raioMetros: number): Promise<POI[]> {
    if (raioMetros <= 0) {
      throw new ValidationError('Raio deve ser maior que zero');
    }
    return this.repositorioPOI.buscarProximos(coordenadas, raioMetros);
  }

  // Busca POIs por texto (nome ou descrição)
  async buscar(termo: string): Promise<POI[]> {
    if (termo.trim().length < 2) {
      throw new ValidationError('Termo de busca deve ter pelo menos 2 caracteres');
    }
    return this.repositorioPOI.buscar(termo);
  }

  // Cria um novo POI
  async criar(
    nome: string,
    descricao: string,
    categoria: CategoriaPOI,
    coordenadas: Coordenadas,
    nomePredio: string,
    opcoes?: { andar?: string; numeroSala?: string; urlImagem?: string; ehAcessivel?: boolean }
  ): Promise<POI> {
    this.validarCoordenadas(coordenadas);
    const poi = POI.criar(nome, descricao, categoria, coordenadas, nomePredio, opcoes);
    return this.repositorioPOI.criar(poi);
  }

  // Atualiza um POI existente
  async atualizar(idPOI: string, dados: Partial<Omit<POI, 'id'>>): Promise<POI> {
    const poiExistente = await this.buscarPorId(idPOI);
    const poiAtualizado = new POI(
      poiExistente.id,
      dados.nome ?? poiExistente.nome,
      dados.descricao ?? poiExistente.descricao,
      dados.categoria ?? poiExistente.categoria,
      dados.coordenadas ?? poiExistente.coordenadas,
      dados.nomePredio ?? poiExistente.nomePredio,
      dados.andar ?? poiExistente.andar,
      dados.numeroSala ?? poiExistente.numeroSala,
      dados.urlImagem ?? poiExistente.urlImagem,
      dados.ehAcessivel ?? poiExistente.ehAcessivel,
      poiExistente.criadoEm,
      new Date()
    );
    return this.repositorioPOI.atualizar(poiAtualizado);
  }

  // Remove um POI
  async deletar(idPOI: string): Promise<void> {
    await this.buscarPorId(idPOI);
    await this.repositorioPOI.deletar(idPOI);
  }

  // Valida coordenadas geograficamente válidas
  private validarCoordenadas(coordenadas: Coordenadas): void {
    if (coordenadas.latitude < -90 || coordenadas.latitude > 90) {
      throw new ValidationError('Latitude deve estar entre -90 e 90');
    }
    if (coordenadas.longitude < -180 || coordenadas.longitude > 180) {
      throw new ValidationError('Longitude deve estar entre -180 e 180');
    }
  }
}