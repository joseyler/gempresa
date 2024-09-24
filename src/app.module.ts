import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { GenDataService } from './services/gendata.cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3316,
      username: 'root',
      password: 'cotizaempresas',
      database: 'cotizaciones',
      synchronize: true,
      entities: ['dist/**/*.entity.js'],
      logging: 'all',
    }),ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, GenDataService],
})
export class AppModule {}
