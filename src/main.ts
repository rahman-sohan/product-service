import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true });
  app.setGlobalPrefix('api/v1/product');

  await app.listen(process.env.PORT ?? 3000);
  console.log(`''''''''''Product Service is running on port ${process.env.PORT ?? 3001}'''''''''`);
}

bootstrap();
