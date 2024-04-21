import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  collection,
  getDocs,
  getFirestore as getFireStore,
} from 'firebase/firestore/lite';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { firebaseConfig } from '../../config/firebase/firebase.config';
import { BookModel } from '../models/book-cover.model';

@Injectable({
  providedIn: 'root',
})
export class FireStoreService {
  private readonly app = initializeApp(firebaseConfig);
  private readonly fireStoreDb = getFireStore(this.app);
  private readonly collectionName = 'book-cover';
  private readonly storage = getStorage(this.app, firebaseConfig.storageBucket);

  async getData(): Promise<BookModel[]> {
    const col = collection(this.fireStoreDb, this.collectionName);
    const snapshot = await getDocs(col);
    const list = snapshot.docs.map((d) => d.data());
    return list as BookModel[];
  }

  async getCoverUrl(id?: string): Promise<string> {
    const gsReference = ref(
      this.storage,
      `gs://${firebaseConfig.storageBucket}/cover/${id}.jpg`
    );
    const url = await getDownloadURL(gsReference);
    return url;
  }
}
