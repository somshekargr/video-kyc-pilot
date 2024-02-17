import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appConfig } from './config/app-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '6mb' }));

  app.enableCors({
    allowedHeaders: '*',
    credentials: true,
    methods: '*',
    origin: '*',
  });

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  //Swagger version >5.0 is not working with the Nest JS. Hennce Lets use version 4.x.x
  const config = new DocumentBuilder()
    .setTitle('videokyc-pilot')
    .setDescription('videokyc-pilot APIs')
    .setVersion('1.0')
    .addTag('videokyc-pilot')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = appConfig.applicationAPIEndPointPort;

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}
bootstrap();
