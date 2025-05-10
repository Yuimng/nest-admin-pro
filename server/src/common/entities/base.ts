import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

//基础实体信息
@Entity()
export abstract class DeleteStatusEntity {
  //0代表存在 1代表删除
  @Column({
    type: 'char',
    name: 'del',
    default: '0',
    length: 1,
    comment: '删除标志',
  })
  public del: string;
}

//基础实体信息
@Entity()
export abstract class BaseEntity extends DeleteStatusEntity {
  @Column({
    type: 'varchar',
    name: 'create_by',
    length: 64,
    default: '',
    comment: '创建者',
  })
  public createBy: string;

  @CreateDateColumn({
    type: 'datetime',
    name: 'create_time',
    default: null,
    comment: '创建时间',
  })
  public createTime: Date;

  @Column({
    type: 'varchar',
    name: 'update_by',
    length: 64,
    default: '',
    comment: '更新者',
  })
  public updateBy: string;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'update_time',
    default: null,
    comment: '更新时间',
  })
  public updateTime: Date;
}
