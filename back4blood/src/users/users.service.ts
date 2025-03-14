import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    private collection= 'users';
    private firestore;
    private readonly saltRounds = 10;

    constructor(private readonly firebaseService: FirebaseService,
      private jwtService: JwtService
    ){
        this.firestore = firebaseService.getFirestore();
    }
//Obtener a todos los usuarios y listo
    async getAllUsers(){
        const snapshot = await this.firestore.collection(this.collection).get();
        return snapshot.docs.map(doc=> ({ id: doc.id, ...doc.data() }));
    }
//Crear a los usuarios con nombre, email, contraseña y rol
//Se encripta la contraseña con bcrypt
    async createuser(name:string,email: string, password: string,role: string){ {

      const lowerEmail = email.toLowerCase();

      const snapshot = await this.firestore.collection(this.collection)
      .where('email', '==', lowerEmail)
      .limit(1) // Optimiza la consulta, ya que solo necesitas saber si existe
      .get();


      if(snapshot.empty){
        // Guardar solo los campos necesarios
        const hashedpassword = await bcrypt.hash(password, this.saltRounds);
        const newUser = {
          name: name,
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
//Esto no lo puso el nomar, pero es el login basicamente compara la contraseña con la que esta en la base de datos
async validateUser(email: string, password: string) {
  const lowerEmail = email.toLowerCase();
  const snapshot = await this.firestore.collection(this.collection)
      .where('email', '==', lowerEmail)
      .limit(1)
      .get();

  if (snapshot.empty) {
      //return false;
      return {success: false, message: 'User not found'}; 
  }

  const userDoc = snapshot.docs[0]; 
  const hashedPassword = userDoc.get('password'); 

  //Originalmente no iba pero para validar la contraseña
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  if (isPasswordValid) {


    const payload = { id: userDoc.id, role: userDoc.get('role') };

    // Devolver el token en un objeto
    return { access_token: this.jwtService.sign(payload) };
  }
  else{
      return {success: false, message: 'Contraseña incorrecta'};
  }

  //return bcrypt.compare(password, hashedPassword); 
}

//Para borrar usuarios ya te la sabes nomar
async deleteUser(email:string){
  const lowerEmail = email.toLowerCase();
  const snapshot = await this.firestore.collection(this.collection)
    .where('email', '==', lowerEmail)
    .limit(1) // Optimiza la consulta, ya que solo necesitas saber si existe
    .get();

  if(snapshot.empty){
    return {success: false, message: 'User not found'};
  }
  const userDoc = snapshot.docs[0];
  await this.firestore.collection(this.collection).doc(userDoc.id).delete();

  return {success: true, message: 'User deleted'};


}
//Actualizar usuario en caso de error al registrarlo
async updateUser(email: string, updates: { name?: string, newEmail?: string, password?: string, role?: string }) {
  const lowerEmail = email.toLowerCase();
  const snapshot = await this.firestore.collection(this.collection)
      .where('email', '==', lowerEmail)
      .limit(1)
      .get();

  if (snapshot.empty) {
      return { success: false, message: 'Usuario no encontrado' };
  }

  const userDoc = snapshot.docs[0];
  const userRef = this.firestore.collection(this.collection).doc(userDoc.id);

  const updatedData: any = {};
  if (updates.name) updatedData.name = updates.name;
  if (updates.newEmail) updatedData.email = updates.newEmail.toLowerCase();
  if (updates.password) updatedData.password = await bcrypt.hash(updates.password, this.saltRounds);
  if (updates.role) updatedData.role = updates.role;

  await userRef.update(updatedData);

  return { success: true, message: 'Usuario actualizado exitosamente' };
}

}
