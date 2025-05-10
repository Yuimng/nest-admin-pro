import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base';
import { Exclude } from 'class-transformer';

@Entity('user', {
  comment: '用户信息表',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', comment: '用户ID' }) // 自增主键
  public id: number;

  @Column({
    type: 'varchar',
    name: 'user_name',
    length: 30,
    nullable: false,
    comment: '用户名称',
  }) // 字符串列，长度限制50
  public userName: string;

  @Exclude({ toPlainOnly: true }) // 输出屏蔽密码
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    default: '',
    comment: '用户登录密码',
  })
  public password: string;

  @Column({
    type: 'varchar',
    name: 'phonenumber',
    nullable: false,
    default: '',
    length: 11,
    // unique: true,
    comment: '手机账号',
  })
  phonenumber: string;
}
