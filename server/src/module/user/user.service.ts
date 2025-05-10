import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto, UpdateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { ResultData } from 'src/common/utils/result';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) // 注入用户实体仓库
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      const checkPhoneUnique = await this.userRepository.findOne({
        where: {
          phonenumber: createUserDto.phonenumber,
          del: '0',
        },
        select: ['phonenumber'],
      });
      if (checkPhoneUnique) {
        return ResultData.fail(500, '注册用户失败，注册手机账号已存在');
      }
      const salt = bcrypt.genSaltSync(10);
      if (newUser.password) {
        newUser.password = bcrypt.hashSync(newUser.password, salt);
      }
      await this.userRepository.save(newUser);
      return ResultData.ok(null, '注册用户成功');
    } catch (error) {
      return ResultData.fail(500, error);
    }
  }

  async login(loginDto: LoginDto) {
    const res = await this.userRepository.findOne({
      where: { phonenumber: loginDto.phonenumber, del: '0' },
    });
    if (res) {
      if (bcrypt.compareSync(loginDto.password, res.password)) {
        const payload = { id: res.id, userName: res.userName };
        const token = await this.jwtService.signAsync(payload);
        return ResultData.ok(token, '登录成功');
      } else {
        return ResultData.fail(500, '登录失败，密码错误');
      }
    } else {
      return ResultData.fail(500, '登录失败，用户不存在');
    }
  }

  async findOne(id: number) {
    const res = await this.userRepository.findOne({ where: { id, del: '0' } });
    if (res) {
      const { password, del, ...rest } = res;
      return ResultData.ok(rest);
    } else {
      return ResultData.fail(500, '查询用户失败，用户不存在');
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.update(updateUserDto.id, updateUserDto);
      return ResultData.ok(null, '更新用户成功');
    } catch (error) {
      return ResultData.fail(500, error);
    }
  }

  async remove(id: number) {
    try {
      const delUser = await this.userRepository.findOne({
        where: { id, del: '0' },
      });
      if (delUser) {
        delUser.del = '1';
        await this.userRepository.save(delUser);
        return ResultData.ok(null, '删除用户成功');
      } else {
        return ResultData.fail(500, '删除用户失败，用户不存在');
      }
    } catch (error) {
      return ResultData.fail(500, error);
    }
  }
}
