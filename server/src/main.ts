import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);

  // 校验参数
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  //服务端口
  const port = config.get<number>('app.port') || 8080;
  await app.listen(port);
  console.log(`Nest-Admin 服务启动成功\n服务地址`, `http://localhost:${port}`);
}
bootstrap();
