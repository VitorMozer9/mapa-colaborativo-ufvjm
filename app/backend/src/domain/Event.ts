export class Evento {
  constructor(
    public readonly id: string,
    public readonly titulo: string,
    public readonly descricao: string,
    public readonly dataInicio: Date,
    public readonly dataFim: Date,
    public readonly local: string,
    public readonly idPOI?: string,
    public readonly urlImagem?: string,
    public readonly urlInscricao?: string,
    public readonly criadoEm: Date = new Date(),
    public readonly atualizadoEm: Date = new Date()
  ) {}

  static criar(
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
  ): Evento {
    return new Evento(
      crypto.randomUUID(),
      titulo,
      descricao,
      dataInicio,
      dataFim,
      local,
      opcoes?.idPOI,
      opcoes?.urlImagem,
      opcoes?.urlInscricao
    );
  }

  estaAtivo(): boolean {
    const agora = new Date();
    return agora >= this.dataInicio && agora <= this.dataFim;
  }

  isProximo(): boolean {
    return new Date() < this.dataInicio;
  }
}