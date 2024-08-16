/** @format */

// /** @format */

import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
export const connectToDatabase = async () => {
	try {
		console.log("Attempting to open database...");
		const db = SQLite.openDatabaseSync("jobFinders1.db");
		console.log("Database opened successfully");
		return db;
	} catch (error) {
		console.log("Database connection error :", error);
	}
};

export const insertProfile = async (
	db,
	{ name, profession, contact, email, resume_link, location, job_preference },
) => {
	try {
		// Create table if it doesn't exist
		await db.execAsync(`
    DROP TABLE IF EXISTS myProfile1;
      CREATE TABLE IF NOT EXISTS myProfile1 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        profession TEXT,
        phone_number TEXT,
        email TEXT,
        resume TEXT,
        location TEXT,
        job_preference TEXT
      );
    `);

		// Insert the profile data using parameterized query
		const insertQuery = `
    INSERT INTO myProfile1 (name, profession, phone_number,email,resume,location,job_preference)
    VALUES ('${name}', '${profession}', '${contact}','${email}','${resume_link}','${location}','${job_preference}');
  `;
		// await db.execAsync(insertQuery, [name, profession, contact]);
		await db.execAsync(insertQuery);

		console.log("Profile inserted successfully");
	} catch (error) {
		console.error("Error inserting profile:", error);
	}
};

export const getProfile = async (db) => {
	try {
		const allRows = await db.getAllAsync("SELECT * FROM myProfile1");
		// for (const row of allRows) {
		//   console.log(row);
		// }
		return allRows;
	} catch (error) {
		console.error("Error fetching profiles:", error);
	}
};

export const deleteDatabase = async () => {
	try {
		const dbName = "jobFinders1.db";
		const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

		await FileSystem.deleteAsync(dbPath);
		console.log("Database deleted successfully");

		// SQLite.deleteDatabaseAsync(jobFinders1.db);
	} catch (error) {
		console.error("Error deleting database:", error);
	}
};

export const localJobDetailsStorage = async (disintegratedJobDetails) => {
	try {
		console.log(
			"Attempting to store disintegrated job details into local SQLite storage",
		);
		const db = await connectToDatabase();

		// Drop the table if it exists and recreate it
		await db.execAsync(`
			DROP TABLE IF EXISTS disintegratedJobDetails;
			CREATE TABLE IF NOT EXISTS disintegratedJobDetails (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				jobDetails TEXT
			);
		`);

		// Insert the profile data using a parameterized query
		const insertQuery = `
			INSERT INTO disintegratedJobDetails (jobDetails)
			VALUES (?);
		`;
		const inserted = await db.execAsync(insertQuery, [disintegratedJobDetails]);

		if (inserted)
			console.log(
				"disintegratedJobDetails successfully inserted into local SQLite database",
			);
	} catch (error) {
		console.error(
			"Error storing the disintegrated job details into local storage:",
			error,
		);
	}
};

export const getDisintegratedJobDetails = async () => {
	try {
		// deleteDatabase()
		console.log(
			"attempting to get disintegrated job details from local sqlite storage",
		);
		const db = await connectToDatabase();
		const allRows = await db.getFirstAsync(
			"SELECT * FROM disintegratedJobDetails",
		);
		// for (const row of allRows) {
		//   console.log(row);
		// }
		const result = JSON.parse(allRows);
		console.log("the job details from local sqlite storage are:", result);
		return result;
	} catch (error) {
		console.error(
			"Error fetching disintegrated job details from the local sqlite storage:",
			error,
		);
	}
};

// file system storage
export const saveData = async (data, filename) => {
	const fileUri = `${FileSystem.documentDirectory}${filename}`;

	try {
		await FileSystem.writeAsStringAsync(fileUri, data);
		console.log(`Data successfully saved to ${fileUri}`);
	} catch (error) {
		console.error("Error saving data:", error);
	}
};

export const readData = async (filename) => {
	console.log("Reading data from file: " + filename);
	const fileUri = `${FileSystem.documentDirectory}${filename}`;

	try {
		const data = await FileSystem.readAsStringAsync(fileUri);
		// if (data) console.log("Data read from file:", data);
		return JSON.parse(data);
	} catch (error) {
		console.error("Error reading data:", error);
	}
};

export const deleteFile = async (filename) => {
	const fileUri = `${FileSystem.documentDirectory}${filename}`;
	try {
		await FileSystem.deleteAsync(fileUri);
		console.log(`File ${filename} deleted`);
	} catch (error) {
		console.error("Error deleting file:", error);
	}
};
