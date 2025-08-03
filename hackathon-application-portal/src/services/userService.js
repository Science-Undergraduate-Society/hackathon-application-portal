import { db } from '../lib/firebase';

export async function saveUserProfile(uid, data) {
  return db.collection('profiles').doc(uid).set(data, { merge: true });
}

export async function fetchUserProfile(uid) {
  const doc = await db.collection('profiles').doc(uid).get();
  return doc.exists ? doc.data() : null;
}
