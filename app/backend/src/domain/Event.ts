export class Event {
  constructor(
    public readonly id: string,                    // ID único
    public readonly title: string,                 // Título do evento
    public readonly description: string,           // Descrição
    public readonly startDate: Date,               // Data/hora início
    public readonly endDate: Date,                 // Data/hora fim
    public readonly location: string,              // Local (texto)
    public readonly poiId?: string,                // ID do POI (opcional)
    public readonly imageUrl?: string,             // Imagem do evento
    public readonly registrationUrl?: string,      // Link para inscrição
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  static create(
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    location: string,
    options?: {
      poiId?: string;
      imageUrl?: string;
      registrationUrl?: string;
    }
  ): Event {
    return new Event(
      crypto.randomUUID(),
      title,
      description,
      startDate,
      endDate,
      location,
      options?.poiId,
      options?.imageUrl,
      options?.registrationUrl
    );
  }
  
  // Verifica se o evento está acontecendo AGORA
  isActive(): boolean {
    const now = new Date();
    // Está entre data de início e fim?
    return now >= this.startDate && now <= this.endDate;
  }

  // Verifica se o evento ainda VAI acontecer
  isUpcoming(): boolean {
    return new Date() < this.startDate;
  }
}
