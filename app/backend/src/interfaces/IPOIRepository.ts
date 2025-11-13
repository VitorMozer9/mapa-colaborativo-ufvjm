import { POI, POICategory, Coordinates } from '../domain/POI';

export interface IPOIRepository {
  findById(id: string): Promise<POI | null>;
  findAll(): Promise<POI[]>;
  findByCategory(category: POICategory): Promise<POI[]>;
  findNearby(coordinates: Coordinates, radiusMeters: number): Promise<POI[]>;
  search(query: string): Promise<POI[]>;
  create(poi: POI): Promise<POI>;
  update(poi: POI): Promise<POI>;
  delete(id: string): Promise<void>;
}