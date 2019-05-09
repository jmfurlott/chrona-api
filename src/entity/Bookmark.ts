import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./User";

@Entity()
export class Bookmark {
  @Column({ default: false })
  archived: boolean;

  @Index()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  title: string;

  @Column("varchar")
  description: string;

  @Column("varchar")
  href: string;

  @Index()
  @ManyToOne(() => User, user => user.bookmarks)
  user: User;
}
