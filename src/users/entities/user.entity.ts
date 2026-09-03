import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
}

export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
  })
  lastName: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  resetPasswordCode: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  resetpasswordCodeExpiryDate: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  verificationLink: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  veriicationLinkExpiryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
