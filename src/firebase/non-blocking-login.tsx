'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

type ErrorCallback = (error: any) => void;

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(
  authInstance: Auth,
  onError?: ErrorCallback
): void {
  signInAnonymously(authInstance).catch(onError);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(
  authInstance: Auth,
  email: string,
  password: string,
  displayName: string,
  onError?: ErrorCallback
): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then((userCredential) => {
      if (userCredential.user) {
        updateProfile(userCredential.user, { displayName }).catch(onError);
      }
    })
    .catch(onError);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(
  authInstance: Auth,
  email: string,
  password: string,
  onError?: ErrorCallback
): void {
  signInWithEmailAndPassword(authInstance, email, password).catch(onError);
}

/** Initiate GitHub sign-in (non-blocking). */
export function initiateGitHubSignIn(
  authInstance: Auth,
  onError?: ErrorCallback
): void {
  const provider = new GithubAuthProvider();
  signInWithPopup(authInstance, provider).catch(onError);
}
