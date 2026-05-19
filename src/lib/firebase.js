import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC5-49Rk0pM3gAHU9c4o2gNbRI2JP8dROk",
  authDomain: "x-51fa5.firebaseapp.com",
  projectId: "x-51fa5",
  storageBucket: "x-51fa5.firebasestorage.app",
  messagingSenderId: "795266434676",
  appId: "1:795266434676:web:a5d4d13860b9cc2dc3f321",
  measurementId: "G-ZWER946MWQ"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
