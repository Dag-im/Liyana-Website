import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cms_quality_policies')
@Unique(['lang'])
export class QualityPolicy {
  private static readonly goalsTransformer = {
    to: (value?: string[]) => JSON.stringify(value ?? []),
    from: (value: string | null): string[] => {
      if (!value) return [];

      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    },
  };

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  lang: string;

  @Column({ type: 'text', transformer: QualityPolicy.goalsTransformer })
  goals: string[];

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
