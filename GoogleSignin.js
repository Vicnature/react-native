// import {
// 	getAuth,
// 	signInWithPopup,
// 	signInWithRedirect,
// 	GoogleAuthProvider,
// } from "firebase/auth";
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
// 	apiKey: "AIzaSyCOUFugLKDEMuidZlngC2GUxfB41HNcItw",
// 	authDomain: "group-5-mobile-app-dev.firebaseapp.com",
// 	projectId: "group-5-mobile-app-dev",
// 	storageBucket: "group-5-mobile-app-dev.appspot.com",
// 	messagingSenderId: "1012118082898",
// 	appId: "1:1012118082898:web:ce31f5d43a6ec8779cd68b",
// 	measurementId: "G-VV4JPRQYWH",
// };

// export const signInWithGoogle = () => {
// 	const app = initializeApp(firebaseConfig);
//     initializeApp(firebaseConfig);
//     const provider = new GoogleAuthProvider(app);
// 	const auth = getAuth();

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
// 			// ...
// 		});
// };
