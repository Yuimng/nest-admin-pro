import { IsString, Length, IsOptional, IsNumber, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @IsString()
  @Length(0, 30)
  userName: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于6位',
  })
  @IsString()
  @Length(0, 200)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: '手机号不能为空',
  })
  @IsPhoneNumber('CN', {
    message: '手机号格式不正确',
  })
  phonenumber: string;
}

export class UpdateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  @Length(0, 30)
  userName: string;
}

export class LoginDto {
  @IsNotEmpty({
    message: '手机号码不能为空',
  })
  phonenumber: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于6位',
  })
  password: string;
}
