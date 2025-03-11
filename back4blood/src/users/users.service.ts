import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private collection= 'users';
    private firestore;
    private readonly saltRounds = 10;

    constructor(private readonly firebaseService: FirebaseService){
        this.firestore = firebaseService.getFirestore();
    }

    async getAllUsers(){
        const snapshot = await this.firestore.collection(this.collection).get();
        return snapshot.docs.map(doc=> ({ id: doc.id, ...doc.data() }));
    }

    async createuser(email: string, password: string,role: string){ {

      const lowerEmail = email.toLowerCase();

      const snapshot = await this.firestore.collection(this.collection)
      .where('email', '==', lowerEmail)
      .limit(1) // Optimiza la consulta, ya que solo necesitas saber si existe
      .get();


      if(snapshot.empty){
        // Guardar solo los campos necesarios
        const hashedpassword = await bcrypt.hash(password, this.saltRounds);
        const newUser = {
          email: lowerEmail,
          password: hashedpassword,
          role: role
        };

        const docRef = await this.firestore.collection(this.collection).add(newUser);
        return { id: docRef.id, ...newUser };
      }else{
        return 'Email already in use'
      }

    
  }

}

async validateUser(email: string, password: string) {
  const lowerEmail = email.toLowerCase();
  const snapshot = await this.firestore.collection(this.collection)
      .where('email', '==', lowerEmail)
      .limit(1)
      .get();

  if (snapshot.empty) {
      return false; 
  }

  const userDoc = snapshot.docs[0]; 
  const hashedPassword = userDoc.get('password'); 

  return bcrypt.compare(password, hashedPassword); 
}


}
