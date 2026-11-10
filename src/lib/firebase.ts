import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// 1. Firebase configuration from provisioned project or environment variables
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let provider: GoogleAuthProvider | null = null;

export function getFirebaseInstance() {
  if (!app) {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(app);
      provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account'
      });
    } catch (error) {
      console.warn('Firebase initialization notice:', error);
    }
  }
  return { app, auth, provider };
}

// 2. Função de login real com Google via Firebase signInWithPopup
export async function loginComGoogle(): Promise<FirebaseUser | null> {
  const { auth: currentAuth, provider: currentProvider } = getFirebaseInstance();
  
  if (!currentAuth || !currentProvider) {
    throw new Error('Firebase Auth não inicializado.');
  }

  try {
    const result = await signInWithPopup(currentAuth, currentProvider);
    const user = result.user;
    console.log("Firebase Login OK:", user.displayName, user.email, user.photoURL);
    return user;
  } catch (error: any) {
    console.error("Erro no login Firebase:", error?.code, error?.message);
    throw error;
  }
}

export async function loginWithFirebaseGoogle(): Promise<{
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
} | null> {
  const user = await loginComGoogle();
  if (!user) return null;
  return {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    uid: user.uid
  };
}

// 3. Logout
export async function logoutFromFirebase(): Promise<void> {
  try {
    const { auth: currentAuth } = getFirebaseInstance();
    if (currentAuth) {
      await firebaseSignOut(currentAuth);
    }
  } catch (error) {
    console.error("Erro ao deslogar do Firebase:", error);
  }
}

// 4. Observer de estado de autenticação
export function subscribeToFirebaseAuthState(
  callback: (user: FirebaseUser | null) => void
): () => void {
  try {
    const { auth: currentAuth } = getFirebaseInstance();
    if (currentAuth) {
      return onAuthStateChanged(currentAuth, (user) => {
        if (user) {
          console.log("Firebase Auth: Usuário ativo ->", user.email);
        } else {
          console.log("Firebase Auth: Nenhum usuário autenticado");
        }
        callback(user);
      });
    }
  } catch (error) {
    console.warn("Erro ao registrar observador de autenticação Firebase:", error);
  }
  return () => {};
}

export { auth, provider };
