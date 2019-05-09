import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne
} from "typeorm";

import { User } from "./User";

@Entity()
export class Bookmark {
  @Column({ default: false })
  archived: boolean;

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

  @ManyToOne(type => User, user => user.bookmarks)
  user: User;
}
