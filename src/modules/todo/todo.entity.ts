import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Activity } from '../activity/activity.entity';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  activity_group_id: number;

  @ManyToOne(() => Activity, (activity) => activity.todo_items)
  @JoinColumn({ name: 'activity_group_id' })
  activity: Activity;

  @Column({
    default: true,
  })
  is_active: boolean;

  @Column({
    default: 'very-high',
  })
  priority: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({
    nullable: true,
  })
  deleted_at: Date;
}
