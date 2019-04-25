import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("varchar")
  description: string;

  @Column("varchar")
  href: string;
}
