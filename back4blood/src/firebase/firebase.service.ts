import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FirebaseService {
  private firestore: admin.firestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      const serviceAccountPath = join(__dirname, '../../config/serviceAccountKey.json');
      console.log('🔍 Service Account Path:', serviceAccountPath); // Verifica la ruta del JSON

      try {
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
        console.log('✅ Service Account Loaded:', serviceAccount.project_id); // Verifica que se carga el JSON

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          //storageBucket: 'herman-app-2dbae.appspot.com',
        });

        console.log('🔥 Firebase Initialized Successfully!');
      } catch (error) {
        console.error('❌ Error loading service account:', error);
      }
    }
    this.firestore = admin.firestore();
  }

  getFirestore() {
    return this.firestore;
  }
}
