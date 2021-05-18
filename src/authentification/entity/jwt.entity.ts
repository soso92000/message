import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
export interface JwtEntity extends InMemoryDBEntity {
    id: string;
    email: string;
  }