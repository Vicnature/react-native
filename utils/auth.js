/** @format */

// auth.js
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signInWithRedirect,
	signInWithCredential,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	getReactNativePersistence,
	initializeAuth,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
	apiKey: "AIzaSyCOUFugLKDEMuidZlngC2GUxfB41HNcItw",
	authDomain: "group-5-mobile-app-dev.firebaseapp.com",
	projectId: "group-5-mobile-app-dev",
	storageBucket: "group-5-mobile-app-dev.appspot.com",
	messagingSenderId: "1012118082898",
	appId: "1:1012118082898:web:ce31f5d43a6ec8779cd68b",
	measurementId: "G-VV4JPRQYWH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();


const signUpWithEmail = async (email, password) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		);
		const user = userCredential.user;
		if (user && user.email) {
			console.log(
				user.email,
				"successfully signed up using email and password",
			);
			return user;
		}
	} catch (error) {
		console.error("Error encountered when signing up with Firebase:", error);
		throw error; // Rethrow the error so it can be caught in handleSignUp
	}
};


const signInWithEmail = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		);
		const user = userCredential.user;
		if (user && user.email) {
			console.log(
				user.email,
				"successfully signed in using email and password",
			);
			if(user && user.email) return user;
		}
	} catch (error) {
		console.error("Error encountered when signing in to Firebase:", error);
		throw error; // Rethrow the error so it can be handled by the calling function
	}
};


const signOutFromFirebase = async () => {
	try {
		await signOut(auth);
		console.log("Successfully signed out from Firebase");
	} catch (error) {
		console.log("Error encountered while signing out from Firebase:", error);
	}
};

export const authenticateWithGoogle = async () => {
	try {
		const provider = new GoogleAuthProvider();
		// const result = await signInWithPopup(auth, provider);
		// const result = await signInWithRedirect(auth, provider);
		const result = await signInWithCredential(auth, provider);

		// This gives you a Google Access Token. You can use it to access the Google API.
		const credential = GoogleAuthProvider.credentialFromResult(result);
		const token = credential?.accessToken;

		// The signed-in user info.
		const user = result.user;

		// Logging or handling the user and token as needed
		if (user) {
			console.log("Successfully signed in with Google:", user.email);
			// Further actions with user or token can be placed here
		}
	} catch (error) {
		// Handle Errors here.
		const errorCode = error.code;
		const errorMessage = error.message;
		const email = error.customData?.email;
		const credential = GoogleAuthProvider.credentialFromError(error);

		// Logging the error details
		console.error("Error during Google authentication:", errorCode, errorMessage, email, credential);
	}
};


// export const authenticateWithGoogle = async () => {
// 	const provider = new GoogleAuthProvider();
// 	signInWithRedirect(auth, provider)
// 		.then((result) => {
// 			// This gives you a Google Access Token. You can use it to access the Google API.
// 			const credential = GoogleAuthProvider.credentialFromResult(result);
// 			const token = credential.accessToken;
// 			// The signed-in user info.
// 			const user = result.user;
// 			// IdP data available using getAdditionalUserInfo(result)
// 			// ...
// 		})
// 		.catch((error) => {
// 			// Handle Errors here.
// 			const errorCode = error.code;
// 			const errorMessage = error.message;
// 			// The email of the user's account used.
// 			const email = error.customData.email;
// 			// The AuthCredential type that was used.
// 			const credential = GoogleAuthProvider.credentialFromError(error);
// 			console.log(error);
// 			// ...
// 		});
// };

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

export {
	signUpWithEmail,
	signInWithEmail,
	onAuthStateChanged,
	signOutFromFirebase,
};
