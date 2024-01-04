import { Types } from 'mongoose';

export type PaginatedResult<T> = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  items: T[];
};

export type PaginationParams = {
  query: { [key: string]: string };
  page: number;
  skip: number;
  limit: number;
};

export default interface IRepository<T> {
  getAll(): Promise<T[]>;
  getPaginated(pagination: PaginationParams): Promise<PaginatedResult<T> | null>;
  getById(id: string | Types.ObjectId): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string | Types.ObjectId, item: T): Promise<T | null>;
  delete(id: string | Types.ObjectId): Promise<boolean>;
}
