import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
import { HorariosModule } from './horarios/horarios.module';

@Module({
  imports: [FirebaseModule, UsersModule, HorariosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
