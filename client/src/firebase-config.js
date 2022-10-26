import { initializeApp } from "firebase/app";
import { getAuth, OAuthProvider, signInWithPopup } from "firebase/auth";
import env from "react-dotenv";

const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGING_SENDER_ID,
  appId: env.APP_ID,
  measurementId: env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new OAuthProvider("microsoft.com");

export const signInWithMicrosoft = () =>
  signInWithPopup(
    auth,
    provider.setCustomParameters({
      prompt: "consent",
      login_hint: "",
      tenant: env.TENANT,
    })
  );

// export const signInWithMicrosoft = () => {
//   signInWithRedirect(
//     auth,
//     provider.setCustomParameters({
//       prompt: "consent",
//       login_hint: "",
//       tenant: "c83f55a7-7fe8-4934-b759-09926430aef0",
//     })
//   )
//     .then((result) => {
//       console.log(result);
//       localStorage.setItem("name", result.user.displayName);
//       localStorage.setItem("email", result.user.email);
//       localStorage.setItem("photoUrl", result.user.photoURL);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
