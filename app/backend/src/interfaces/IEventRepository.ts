import { Event } from '../domain/Event';

export interface IEventRepository {
  findById(id: string): Promise<Event | null>;
  findAll(): Promise<Event[]>;
  findActive(): Promise<Event[]>;
  findUpcoming(): Promise<Event[]>;
  findByPOI(poiId: string): Promise<Event[]>;
  create(event: Event): Promise<Event>;
  update(event: Event): Promise<Event>;
  delete(id: string): Promise<void>;
}