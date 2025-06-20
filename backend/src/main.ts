import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Em produção, especifique a origem do frontend
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
