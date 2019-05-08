import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from "typeorm";

@Entity()
export class User {
  @Column({ default: false })
  archived: boolean;

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  encrypted_password: string;

  @Column({ unique: true })
  github_id: string;
}
