import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UsersService {
    private collection= 'users';
    private firestore;

    constructor(private readonly firebaseService: FirebaseService){
        this.firestore = firebaseService.getFirestore();
    }

    async getAllUsers(){
        const snapshot = await this.firestore.collection(this.collection).get();
        return snapshot.docs.map(doc=> ({ id: doc.id, ...doc.data() }));
    }


}
