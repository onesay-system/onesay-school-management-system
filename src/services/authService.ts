
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential,
  type Unsubscribe,
} from "firebase/auth";

import { auth } from "../config/firebase";

/**
 * ONESAY AUTH SERVICE
 * Mengelola autentikasi pengguna melalui Firebase Authentication.
 */

/**
 * Login pengguna.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<UserCredential> {
  return await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
}

/**
 * Logout pengguna.
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Membuat akun pengguna.
 *
 * Catatan:
 * Fungsi ini hanya boleh dipanggil melalui proses
 * administrasi yang tepercaya.
 */
export async function createUserAccount(
  email: string,
  password: string
): Promise<UserCredential> {
  return await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
}

/**
 * Mengambil pengguna yang sedang login.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Memantau perubahan status autentikasi.
 */
export function observeAuthState(
  callback: (user: User | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}
