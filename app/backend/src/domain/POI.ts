export interface Coordinates {
  latitude: number;   // Ex: -18.2389
  longitude: number;  // Exo: -43.6005
}

export enum POICategory {
  ACADEMIC = 'academic',              // Acadêmico (salas, departamentos)
  ADMINISTRATIVE = 'administrative',  // Administrativo (reitoria, secretarias)
  RESTAURANT = 'restaurant',          // Restaurante universitário
  LIBRARY = 'library',                // Biblioteca
  LABORATORY = 'laboratory',          // Laboratórios
  AUDITORIUM = 'auditorium',          // Auditórios
  SPORTS = 'sports',                  // Esportes (quadras, ginásio)
  PARKING = 'parking',                // Estacionamento
  ENTRANCE = 'entrance',              // Entradas do campus
  BATHROOM = 'bathroom',              // Banheiros
  ACCESSIBILITY = 'accessibility',    // Recursos de acessibilidade
  OTHER = 'other'                     // Outros
}

export class POI {
  constructor(
    public readonly id: string,                    // ID único
    public readonly name: string,                  // Nome (ex: "Biblioteca Central")
    public readonly description: string,           // Descrição detalhada
    public readonly category: POICategory,         // Categoria
    public readonly coordinates: Coordinates,      // Lat/Lng
    public readonly buildingName: string,          // Nome do prédio
    public readonly floor?: string,                // Andar (opcional)
    public readonly roomNumber?: string,           // Número da sala (opcional)
    public readonly imageUrl?: string,             // URL da imagem (opcional)
    public readonly isAccessible: boolean = false, // Tem acessibilidade?
    public readonly createdAt: Date = new Date(),  // Data de criação
    public readonly updatedAt: Date = new Date()   // Data de atualização
  ) {

  }

  static create(
    name: string,
    description: string,
    category: POICategory,
    coordinates: Coordinates,
    buildingName: string,

    options?: {
      floor?: string;
      roomNumber?: string;
      imageUrl?: string;
      isAccessible?: boolean;
    }
  ): POI {
    return new POI(
      crypto.randomUUID(),
      name,
      description,
      category,
      coordinates,
      buildingName,
      options?.floor,           
      options?.roomNumber,
      options?.imageUrl,
      options?.isAccessible ?? false 
    );
  }
}
