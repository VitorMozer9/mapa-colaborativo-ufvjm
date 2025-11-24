export class Favorito {
  constructor(
    public readonly id: string,
    public readonly idUsuario: string,
    public readonly idPOI: string,
    public readonly criadoEm: Date = new Date()
  ) {}

  static criar(idUsuario: string, idPOI: string): Favorito {
    return new Favorito(
      crypto.randomUUID(),
      idUsuario,
      idPOI
    );
  }
}