/** @format */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
	// ...
	// The value of `databaseURL` depends on the location of the database
	databaseURL: "https://group-5-mobile-app-dev-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
// const database = getDatabase(app);

export async function writeUserData({
	email,
	id,
	job_preference,
	location,
	name,
	contact,
	profession,
	resume_link,
}) {
	console.log("writing to firebase realtime database");
	const db = getDatabase();
	set(ref(db, "userProfiles/"), {
		// user_id: id,
		name: name,
		email: email,
		phone_number: contact,
		current_profession: profession,
		job_preference: job_preference,
		location: location,
		Link_to_resume: resume_link,
	});
}

// firebase db
import { collection, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig1 = {
	apiKey: "AIzaSyCOUFugLKDEMuidZlngC2GUxfB41HNcItw",
	authDomain: "group-5-mobile-app-dev.firebaseapp.com",
	projectId: "group-5-mobile-app-dev",
	storageBucket: "group-5-mobile-app-dev.appspot.com",
	messagingSenderId: "1012118082898",
	appId: "1:1012118082898:web:ce31f5d43a6ec8779cd68b",
	measurementId: "G-VV4JPRQYWH",
};

export const Firestore = async ({email,
	job_preference,
	location,
	name,
	contact,
	profession,
	resume_link,}) => {
	const app = initializeApp(firebaseConfig1);
	const db = getFirestore(app);
	try {
		const docRef = await addDoc(collection(db, "userProfiles"), {
			name: name,
			email: email,
			phone_number: contact,
			current_profession: profession,
			job_preference: job_preference,
			location: location,
			Link_to_resume: resume_link,
		});
		console.log("Profile successfully stored in google's firestore database");
	} catch (e) {
		console.error("Error adding document to google firestore database: ", e);
	}
};
