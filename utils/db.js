/** @format */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, runTransaction } from "firebase/database";
import {
	collection,
	addDoc,
	deleteDoc,
	setDoc,
	doc,
	getFirestore,
	getDoc,
	getDocFromCache,
} from "firebase/firestore";
import {
	getAuth,
	deleteUser,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from "firebase/auth";

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
		profession: profession,
		job_preference: job_preference || "Full Time",
		location: location,
		Link_to_resume: resume_link || "None Provided",
	});

	if (writeToRealTimeDb)
		console.log("Profile successfully sent to firebase realtime database");
}

// firebase db
// Ensure this import is correct

const firebaseConfig1 = {
	apiKey: "AIzaSyCOUFugLKDEMuidZlngC2GUxfB41HNcItw",
	authDomain: "group-5-mobile-app-dev.firebaseapp.com",
	projectId: "group-5-mobile-app-dev",
	storageBucket: "group-5-mobile-app-dev.appspot.com",
	messagingSenderId: "1012118082898",
	appId: "1:1012118082898:web:ce31f5d43a6ec8779cd68b",
	measurementId: "G-VV4JPRQYWH",
};

export const Firestore = async (
	{ email, job_preference, location, name, contact, profession, resume_link },
	collectionName,
	documentName,
) => {
	console.log(
		"attempting to write to firebase storage,collection: " +
			collectionName +
			" for " +
			documentName,
	);
	const app = initializeApp(firebaseConfig1);
	const db = getFirestore(app);
	try {
		const docData = {
			name: name,
			email: email,
			phone_number: contact,
			profession: profession,
			job_preference: job_preference || "Full Time",
			location: location,
			Link_to_resume: resume_link || "none provided",
		};
		const sentToFirebase = await setDoc(
			doc(db, collectionName, documentName),
			docData,
		);
		if (sentToFirebase) {
			console.log(
				"User profile for",
				documentName,
				" Sent to",
				collectionName,
				"Firestore dbase succesfully",
			);
			return sentToFirebase;
		}
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
		const app = initializeApp(firebaseConfig1);
		const db = getFirestore(app);

		if (!collectionName || !documentName) {
			throw new Error("Collection name and document name must be provided");
		}

		// Create a document reference
		const docRef = doc(db, collectionName, documentName);

		console.log(
			`Fetching document ${documentName} from collection ${collectionName}`,
		);

		// Fetch the document snapshot
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log(
				`Found ${documentName} inside Firestore database, within ${collectionName}`,
			);
			return docSnap.data();
		} else {
			console.log(
				`Document ${documentName} does not exist in collection ${collectionName}`,
			);
			return null;
		}
	} catch (e) {
		console.error("Error getting document from Firestore database:", e);
		return null;
	}
};

export const deleteDocFromFirestore = async (documentName) => {
	try {
		const app = initializeApp(firebaseConfig1);
		const db = getFirestore(app);
		const auth = getAuth(app);
		const user = auth.currentUser;
		console.log("user being deleted is", user);
		// Reauthenticate the user
		const credential = EmailAuthProvider.credential(user.email, userPassword); // Replace userPassword with the user's actual password
		await reauthenticateWithCredential(user, credential);
		console.log("User reauthenticated");

		// Delete the Firestore document
		await deleteDoc(doc(db, "userProfiles", documentName));
		console.log(documentName, "'s account successfully deleted from firebase!");

		// Delete the user from Firebase Auth
		await deleteUser(user);
		console.log("User deleted from Firebase Auth database");

		return true; // Indicate success
	} catch (e) {
		console.error("Error deleting document: ", e);
		return false; // Indicate failure
	}
};

export async function LikedJobs(collectionName, likedJob) {
	console.log("Liking the job on google realtime database");
	const db = getDatabase();
	const writeToRealTimeDb = await set(
		ref(db, `${collectionName}/${likedJob}`),
		{
			numberOfLikes: 1,
		},
	);

	if (writeToRealTimeDb) {
		const NewNumberOfLikes = ref(db, `${collectionName}/${likedJob}`);
		onValue(NewNumberOfLikes, (snapshot) => {
			const data = snapshot.val();
			updateStarCount(postElement, data);
		});
	}
}

export const FirebaseAppliedJobs = async (alreadyApplied, documentName) => {
	const db = getDatabase();
	const jobRef = ref(db, documentName);

	try {
		await runTransaction(jobRef, (job) => {
			if (job) {
				if (!alreadyApplied) {
					// User has not clicked the the job application link yet, so add the application
					job.likeCount = (job.likeCount || 0) + 1;
				}
				return job;
			}
			return { likeCount: 1 }; // Initialize likeCount if job does not exist
		});
	} catch (e) {
		console.error("Error updating like count in Realtime Database: ", e);
	}
};
