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
	console.log(
		"values being sent to firebase realtime database:location",
		location,
		"email",
		email,
		"name",
		name,
	);
	const writeToRealTimeDb = await set(ref(db, "userProfiles/"), {
		// user_id: id,
		name: name,
		email: email,
		phone_number: contact,
		current_profession: profession,
		job_preference: job_preference,
		location: location,
		Link_to_resume: resume_link,
	});

	if (writeToRealTimeDb)
		console.log("Profile successfully sent to firebase realtime database");
}

// firebase db
import {
	collection,
	addDoc,
	setDoc,
	doc,
	getFirestore,
	getDoc,
	getDocFromCache,
} from "firebase/firestore";

const firebaseConfig1 = {
	apiKey: "AIzaSyCOUFugLKDEMuidZlngC2GUxfB41HNcItw",
	authDomain: "group-5-mobile-app-dev.firebaseapp.com",
	projectId: "group-5-mobile-app-dev",
	storageBucket: "group-5-mobile-app-dev.appspot.com",
	messagingSenderId: "1012118082898",
	appId: "1:1012118082898:web:ce31f5d43a6ec8779cd68b",
	measurementId: "G-VV4JPRQYWH",
};

export const Firestore = async ({
	email,
	job_preference,
	location,
	name,
	contact,
	profession,
	resume_link,
}) => {
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
		if (docRef)
			console.log(
				"Profile successfully stored in google's firestore database:",
				docRef,
			);
		if (docRef) return docRef;
	} catch (e) {
		console.error("Error adding document to google firestore database: ", e);
	}
};

export const FirebaseJobCache = async (data, documentName) => {
	const app = initializeApp(firebaseConfig1);
	const db = getFirestore(app);
	try {
		const docRef = doc(db, "jobDetailsCache", documentName);
		
		await setDoc(docRef, {
			jobDetails: data,
		});
		console.log(
			documentName,
			" successfully stored in google's firestore database",
		);
	} catch (e) {
		console.error("Error adding document to google firestore database: ", e);
	}
};

export const retrieveJobsFromFirestoreCache = async (firebaseDocumentName) => {
	const app = initializeApp(firebaseConfig1);
	const db = getFirestore(app);
	const docRef = doc(db, "jobDetailsCache", `${firebaseDocumentName}`);

	// Get a document, forcing the SDK to fetch from the offline cache.
	try {
		const doc = await getDocFromCache(docRef);
		if (doc && doc !== null) {
			console.log("disintegrated job successfully retrieved from firestore");
			return doc.data();
		}
		// Document was found in the cache. If no cached document exists,
		// an error will be returned to the 'catch' block below.
		//   console.log("Cached document data:", doc.data());
	} catch (e) {
		getDocFromFirestoreDb();
		console.error(
			"Error getting all-the-jobs from firestore offline cache.Currenlty checking online firestore database:",
			e,
		);
	}
};

export const getDocFromFirestoreDb = async (collectionName, documentName) => {
	try {
		console.log("Initializing Firebase app");
		const app = initializeApp(firebaseConfig1);
		const db = getFirestore(app);
		console.log(db)
		const docRef = doc(db, collectionName, documentName);
		console.log(`Fetching document ${documentName} from collection ${collectionName}`);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// console.log(`Found ${documentName} inside firestore database, within ${collectionName}`, docSnap.data());
			return docSnap.data();
		} else {
			console.log(`Document ${documentName} does not exist in collection ${collectionName}`);
			return null;
		}
	} catch (e) {
		console.error("Error getting document from Firestore database:", e);
		return null;
	}
};