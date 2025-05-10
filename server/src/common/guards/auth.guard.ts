import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

type WhiteList = {
  path: string;
  method: string;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private globalWhiteList: WhiteList[] = [];
  constructor(
    private jwtService: JwtService, // JWT服务，用于验证和解析JWT token
    private configService: ConfigService, // 配置服务，用于获取JWT_SECRET
  ) {
    this.globalWhiteList = [].concat(
      this.configService.get('perm.router.whitelist') || [],
    );
  }

  /**
   * 判断请求是否通过身份验证
   * @param context 执行上下文
   * @returns 是否通过身份验证
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // 获取请求对象

    // 白名单放行
    if (this.checkWhiteList(request)) {
      return true;
    }

    const token = this.extractTokenFromHeader(request); // 从请求头中提取token
    if (!token) {
      throw new HttpException('验证不通过', HttpStatus.FORBIDDEN); // 如果没有token，抛出验证不通过异常
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'), // 使用JWT_SECRET解析token
      });
      request['user'] = payload; // 将解析后的用户信息存储在请求对象中
    } catch {
      throw new HttpException('token验证失败', HttpStatus.FORBIDDEN); // 如果没有token，抛出验证不通过异常
    }

    return true; // 身份验证通过
  }

  /**
   * 从请求头中提取token
   * @param request 请求对象
   * @returns 提取到的token
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []; // 从Authorization头中提取token
    return type === 'Bearer' ? token : undefined; // 如果是Bearer类型的token，返回token；否则返回undefined
  }

  /**
   * 检查白名单路由
   * @param request 请求对象
   * @returns 是否存在在白名单中
   */
  private checkWhiteList(request: Request): boolean {
    const path = request.route.path;
    const method = request.method;
    const whiteList = this.globalWhiteList;
    const i = whiteList.findIndex(
      (item) => item.method === method && item.path === path,
    );
    return i > -1;
  }
}
