import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Bookmark } from "./Bookmark";
import { PublicToken } from "./PublicToken";

@Entity()
export class User {
  @Column({ default: false })
  archived: boolean;

  @Index()
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

  @OneToMany(() => Bookmark, bookmark => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => PublicToken, publicToken => publicToken.user)
  publicTokens: PublicToken[];
}
