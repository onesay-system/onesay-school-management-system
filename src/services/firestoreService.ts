
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";

import { db } from "../config/firebase";

/**
 * ONESAY FIRESTORE SERVICE
 * Layanan database bersama untuk seluruh modul ONESAY.
 */

/**
 * Membuat dokumen baru dengan ID otomatis.
 */
export async function createRecord(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  const collectionRef = collection(db, collectionName);

  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Mengambil satu dokumen berdasarkan ID.
 */
export async function getRecord<T extends DocumentData = DocumentData>(
  collectionName: string,
  documentId: string
): Promise<(T & { id: string }) | null> {
  const docRef = doc(db, collectionName, documentId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as T & { id: string };
}

/**
 * Mengambil seluruh dokumen dalam koleksi.
 * Dapat menerima filter, pengurutan, dan batas data.
 */
export async function getRecords<T extends DocumentData = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<(T & { id: string })[]> {
  const collectionRef = collection(db, collectionName);

  const firestoreQuery =
    constraints.length > 0
      ? query(collectionRef, ...constraints)
      : collectionRef;

  const snapshot = await getDocs(firestoreQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as (T & { id: string })[];
}

/**
 * Menyimpan dokumen menggunakan ID yang ditentukan.
 * Cocok untuk sinkronisasi data dengan ID sumber eksternal.
 */
export async function setRecord(
  collectionName: string,
  documentId: string,
  data: DocumentData,
  merge = true
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);

  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge }
  );
}

/**
 * Memperbarui dokumen yang sudah tersedia.
 */
export async function updateRecord(
  collectionName: string,
  documentId: string,
  data: DocumentData
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);

  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Menghapus dokumen berdasarkan ID.
 */
export async function deleteRecord(
  collectionName: string,
  documentId: string
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);

  await deleteDoc(docRef);
}
