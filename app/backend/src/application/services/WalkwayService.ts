import { IWalkwayRepository } from '../../interfaces/repositories/IWalkwayRepository';
import { Caminho } from '../../domain/Walkway';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { ValidationError } from '../../shared/errors/ValidationError';

export class ServicoCaminhos {
  constructor(private readonly repositorioCaminho: IWalkwayRepository) {}

  async buscarTodos(): Promise<Caminho[]> {
    return this.repositorioCaminho.buscarTodos();
  }

  async buscarPorId(id: string): Promise<Caminho> {
    const caminho = await this.repositorioCaminho.buscarPorId(id);
    if (!caminho) {
      throw new NotFoundError('Caminho');
    }
    return caminho;
  }

  async criar(
    nome: string,
    coordenadas: Array<[number, number]>,
    ehAcessivel: boolean = true
  ): Promise<Caminho> {
    this.validarCoordenadas(coordenadas);
    const caminho = Caminho.criar(nome, coordenadas, ehAcessivel);
    return this.repositorioCaminho.criar(caminho);
  }

  async atualizar(
    id: string,
    dados: Partial<Omit<Caminho, 'id'>>
  ): Promise<Caminho> {
    const existente = await this.buscarPorId(id);

    const caminhoAtualizado = new Caminho(
      existente.id,
      dados.nome ?? existente.nome,
      dados.coordenadas ?? existente.coordenadas,
      dados.ehAcessivel ?? existente.ehAcessivel,
      existente.criadoEm,
      new Date()
    );

    this.validarCoordenadas(caminhoAtualizado.coordenadas);

    return this.repositorioCaminho.atualizar(caminhoAtualizado);
  }

  async deletar(id: string): Promise<void> {
    await this.buscarPorId(id);
    await this.repositorioCaminho.deletar(id);
  }

  private validarCoordenadas(
    coordenadas: Array<[number, number]>
  ): void {
    if (!coordenadas || coordenadas.length < 2) {
      throw new ValidationError(
        'Um caminho deve ter pelo menos dois pontos'
      );
    }
  }
}
