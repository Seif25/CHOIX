import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const logger = new Logger("Main (main.ts)");
  const app = await NestFactory.create(AppModule);

  // ENVIRONMENT VARIABLES
  const configService = app.get(ConfigService);
  const clientURL = configService.get("CLIENT_URL");
  const port = parseInt(configService.get("PORT"));
  const clientPort = parseInt(configService.get("CLIENT_PORT"));

  app.enableCors({
    origin: [
      `${clientURL}`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
    ],
  });
  
  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}
bootstrap();
