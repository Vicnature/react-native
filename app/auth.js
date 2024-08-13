/** @format */

// auth.js
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
  signInWithRedirect,
	GoogleAuthProvider,
	signOut
} from "firebase/auth";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
	apiKey: "AIzaSyCOUFugLKDEMuidZlngC2GUxfB41HNcItw",
	authDomain: "group-5-mobile-app-dev.firebaseapp.com",
	projectId: "group-5-mobile-app-dev",
	storageBucket: "group-5-mobile-app-dev.appspot.com",
	messagingSenderId: "1012118082898",
	appId: "1:1012118082898:web:ce31f5d43a6ec8779cd68b",
	measurementId: "G-VV4JPRQYWH",
};
    const app = initializeApp(firebaseConfig)
	const auth = getAuth();

const signUpWithEmail = async (email, password) => {
	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed up
			const user = userCredential.user;
			// ...
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			// ..
		});
};

const signInWithEmail = async (email, password) => {
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			// ...
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
		});
};

const signOutFromFirebase = async () => {
	signOut(auth).then(() => {
		console.log("successfully signed out from firebase")
	  }).catch((error) => {
		console.log(error)
	  });
};


export const authenticateWithGoogle=async()=>{
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(error)
    // ...
  });
}


onAuthStateChanged(auth, (user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/auth.user
		const uid = user.uid;
		// ...
	} else {
		// User is signed out
		// ...
	}
});

export { signUpWithEmail, signInWithEmail, onAuthStateChanged,signOutFromFirebase };
