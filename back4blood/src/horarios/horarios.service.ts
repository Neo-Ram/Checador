import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Horario } from './horarios.interface';

@Injectable()
export class HorariosService {
  private collection = 'horarios';
  private firestore;

  constructor(private readonly firebaseService: FirebaseService) {
    this.firestore = firebaseService.getFirestore();
  }

  async createHorario(horario: Horario) {
    const docRef = await this.firestore.collection(this.collection).add(horario);
    return { id: docRef.id, ...horario };
  }
}