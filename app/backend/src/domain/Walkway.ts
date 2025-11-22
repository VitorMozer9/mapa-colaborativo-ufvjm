export class Caminho {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly coordenadas: Array<[number, number]>,
    public readonly ehAcessivel: boolean = true,
    public readonly criadoEm: Date = new Date(),
    public readonly atualizadoEm: Date = new Date()
  ) {}

  static criar(
    nome: string,
    coordenadas: Array<[number, number]>,
    ehAcessivel: boolean = true
  ): Caminho {
    return new Caminho(
      crypto.randomUUID(),
      nome,
      coordenadas,
      ehAcessivel
    );
  }
}