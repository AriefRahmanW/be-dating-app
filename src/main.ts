import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { PrismaService } from './prisma/prisma.service';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false
    })
  );
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app)

  const PORT = process.env.PORT || 8080
  const HOST = process.env.HOST || "localhost"
  await app.listen(PORT, HOST, (err, address) => {
      if(!err){
        console.log("Aplication run at ",address)
      }
    }
  );
  
}
bootstrap();
