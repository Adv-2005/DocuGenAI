'use client';
import { doc, setDoc, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type RepositoryConnectionData = {
  platform: 'github';
  accessToken: string;
  userId?: string;
};

export async function setRepositoryConnection(
  firestore: Firestore,
  userId: string,
  data: RepositoryConnectionData
) {
  const repoConnectionRef = doc(
    firestore,
    'users',
    userId,
    'repositoryConnections',
    'github'
  );

  const payload = { ...data, userId };

  try {
    await setDoc(repoConnectionRef, payload, { merge: true });
  } catch (error) {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: repoConnectionRef.path,
        operation: 'write',
        requestResourceData: payload,
      })
    );
    throw error;
  }
}
