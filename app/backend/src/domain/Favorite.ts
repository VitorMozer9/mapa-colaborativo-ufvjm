export class Favorite {
  constructor(
    public readonly id: string,           // ID do favorito
    public readonly userId: string,       // ID do usuário
    public readonly poiId: string,        // ID do POI favoritado
    public readonly createdAt: Date = new Date()
  ) {}

  static create(userId: string, poiId: string): Favorite {
    return new Favorite(
      crypto.randomUUID(),
      userId,
      poiId
    );
  }
}