import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadFile = async (file, userId, fileType) => {
  if (!file) return null;
  
  const storage = getStorage();
  const timestamp = Date.now();
  const fileName = `${fileType}_${timestamp}_${file.name}`;
  const storageRef = ref(storage, `users/${userId}/${fileName}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};