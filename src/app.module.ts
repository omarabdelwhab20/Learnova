import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (confgiService: ConfigService) => ({
        type: 'postgres',
        port: Number(confgiService.get('PG_PORT')),
        host: confgiService.get('PG_HOST'),
        username: confgiService.get('PG_USER'),
        password: confgiService.get('PG_PASS'),
        database: confgiService.get('PG_DBNAME'),
        synchronize: true,
      }),
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
