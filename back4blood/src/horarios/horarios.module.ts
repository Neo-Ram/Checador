import { Module } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { HorariosController } from './horarios.controller';
import { FirebaseService } from '../firebase/firebase.service';
@Module({
  providers: [HorariosService, FirebaseService],
  controllers: [HorariosController],
  exports: [FirebaseService]
})
export class HorariosModule {}
