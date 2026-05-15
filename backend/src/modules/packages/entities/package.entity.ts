import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Feature } from '../../features/entities/feature.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  credits: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Feature)
  @JoinTable({
    name: 'package_features',
    joinColumn: { name: 'package_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'feature_id', referencedColumnName: 'id' },
  })
  features: Feature[];

  @OneToMany(() => Transaction, (transaction) => transaction.package)
  transactions: Transaction[];
}
