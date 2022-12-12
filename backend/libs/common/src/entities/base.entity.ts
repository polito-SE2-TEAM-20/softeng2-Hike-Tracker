import { CreateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt!: Date;
}
