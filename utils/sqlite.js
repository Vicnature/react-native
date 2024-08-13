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
		const dbName = 'jobFinders1.db';
		const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

		await FileSystem.deleteAsync(dbPath);
		console.log('Database deleted successfully');

		// SQLite.deleteDatabaseAsync(jobFinders1.db);
	} catch (error) {
		console.error("Error deleting database:", error);
	}
};

