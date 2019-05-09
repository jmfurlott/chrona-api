import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from "typeorm";

import { Bookmark } from "./Bookmark";

@Entity()
export class User {
  @Column({ default: false })
  archived: boolean;

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  encryptedPassword: string;

  @Column({ unique: true, nullable: true })
  githubId: string;

  @OneToMany(type => Bookmark, bookmark => bookmark.user)
  bookmarks: Bookmark[];
}
