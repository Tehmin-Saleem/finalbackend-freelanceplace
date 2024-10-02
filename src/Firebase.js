import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
// import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-getFirestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvTOBMsnMgp7042RIoHmxHo1cpAa9IViU",
  authDomain: "freelanceapplication-46e14.firebaseapp.com",
  projectId: "freelanceapplication-46e14",
  storageBucket: "freelanceapplication-46e14.appspot.com",
  messagingSenderId: "805256736733",
  appId: "1:805256736733:web:2293716a3f6a57bae91034"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// const db = getFirestore(app);
export const signInWithGoogle = () => {
    return signInWithPopup(auth, provider);
  };

// export const signInWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;

//     // Create user document in Firestore (with user's UID as the document ID)
//     const userRef = doc(db, "users", user.uid);

//     // Store user data in Firestore
//     await setDoc(userRef, {
//       name: user.displayName,
//       email: user.email,
//       photoURL: user.photoURL,
//       uid: user.uid,
//       role: "User", // You can assign a default role here
//       createdAt: new Date(),
//     });

//     return user;
//   } catch (error) {
//     console.error("Error during Google sign-in or storing user data: ", error);
//   }
// };




// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // const auth = getAuth(app);
// // auth.languageCode = "en";
// // const provider = new GoogleAuthProvider();

// // // Function for Google Sign-in
// // const signInWithGoogle = () => {
// //   return signInWithPopup(auth, provider)
// //     .then((result) => {
// //       // Successful sign-in
// //       const credential = GoogleAuthProvider.credentialFromResult(result);
// //       const user = result.user;
// //       console.log(user);
      
// //       // Redirect after sign-in
// //       window.location.href = "/signin"; // Correct the redirect URL as needed
// //     })
// //     .catch((error) => {
// //       // Handle errors
// //       const errorCode = error.code;
// //       const errorMessage = error.message;
// //       console.error(errorCode, errorMessage);
// //     });
// // };

// // // Add event listener to the Google login button
// // document.getElementById("google-login").addEventListener("click", () => {
// //   signInWithGoogle();
// // });
