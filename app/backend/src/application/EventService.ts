import { IRepositorioEvento } from '../../interfaces/repositories/IEventRepository';
import { Evento } from '../../domain/Event';
import { ErroNaoEncontrado } from '../../shared/errors/NotFoundError';
import { ErroValidacao } from '../../shared/errors/ValidationError';
import { Logger } from '../../shared/logger';

export class ServicoEventos {
  constructor(private readonly repositorioEvento: IRepositorioEvento) {}

  // Busca um evento específico por ID
  async buscarPorId(idEvento: string): Promise<Evento> {
    const evento = await this.repositorioEvento.buscarPorId(idEvento);
    if (!evento) {
      throw new ErroNaoEncontrado('Evento');
    }
    return evento;
  }

  // Lista todos os eventos
  async buscarTodos(): Promise<Evento[]> {
    return this.repositorioEvento.buscarTodos();
  }

  // Lista apenas eventos que estão acontecendo agora
  async buscarAtivos(): Promise<Evento[]> {
    return this.repositorioEvento.buscarAtivos();
  }

  // Lista eventos que ainda vão acontecer
  async buscarProximos(): Promise<Evento[]> {
    return this.repositorioEvento.buscarProximos();
  }

  // Lista eventos de um POI específico
  async buscarPorPOI(idPOI: string): Promise<Evento[]> {
    return this.repositorioEvento.buscarPorPOI(idPOI);
  }

  // Cria um novo evento
  async criar(
    titulo: string,
    descricao: string,
    dataInicio: Date,
    dataFim: Date,
    local: string,
    opcoes?: {
      idPOI?: string;
      urlImagem?: string;
      urlInscricao?: string;
    }
  ): Promise<Evento> {
    this.validarDatas(dataInicio, dataFim);
    
    const evento = Evento.criar(
      titulo,
      descricao,
      dataInicio,
      dataFim,
      local,
      opcoes
    );

    const eventoSalvo = await this.repositorioEvento.criar(evento);
    Logger.info(`Evento criado: ${titulo}`);
    
    return eventoSalvo;
  }

  // Atualiza um evento existente
  async atualizar(
    idEvento: string,
    dados: Partial<Omit<Evento, 'id'>>
  ): Promise<Evento> {
    const eventoExistente = await this.buscarPorId(idEvento);

    if (dados.dataInicio && dados.dataFim) {
      this.validarDatas(dados.dataInicio, dados.dataFim);
    }

    const eventoAtualizado = new Evento(
      eventoExistente.id,
      dados.titulo ?? eventoExistente.titulo,
      dados.descricao ?? eventoExistente.descricao,
      dados.dataInicio ?? eventoExistente.dataInicio,
      dados.dataFim ?? eventoExistente.dataFim,
      dados.local ?? eventoExistente.local,
      dados.idPOI ?? eventoExistente.idPOI,
      dados.urlImagem ?? eventoExistente.urlImagem,
      dados.urlInscricao ?? eventoExistente.urlInscricao,
      eventoExistente.criadoEm,
      new Date()
    );

    return this.repositorioEvento.atualizar(eventoAtualizado);
  }

  // Remove um evento
  async deletar(idEvento: string): Promise<void> {
    await this.buscarPorId(idEvento);
    await this.repositorioEvento.deletar(idEvento);
    Logger.info(`Evento deletado: ${idEvento}`);
  }

  // Valida se data de fim é após data de início
  private validarDatas(dataInicio: Date, dataFim: Date): void {
    if (dataInicio >= dataFim) {
      throw new ErroValidacao('Data de fim deve ser após data de início');
    }

    if (dataInicio < new Date()) {
      throw new ErroValidacao('Data de início não pode ser no passado');
    }
  }
}