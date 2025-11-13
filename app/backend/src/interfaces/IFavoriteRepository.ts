import { Favorite } from '../domain/Favorite';

export interface IFavoriteRepository {
  findByUserId(userId: string): Promise<Favorite[]>;
  findByUserAndPOI(userId: string, poiId: string): Promise<Favorite | null>;
  create(favorite: Favorite): Promise<Favorite>;
  delete(id: string): Promise<void>;
}