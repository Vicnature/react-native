/** @format */

import { AsyncStorage } from "react-native";

export const storeData = async (job_id) => {
    try {
        const favoriteJobs = [];
        const storedJobs = await AsyncStorage.getItem("favoriteJobs");
        favoriteJobs = [...storedJobs];
        favoriteJobs.push(job_id);
        await AsyncStorage.setItem("job_id", job_id);
    } catch (error) {
        console.error(
            "failed to add this job to favorite jobs in local storage at storeData function in favorites.js",
            error,
        );
    }
};

export const retrieveData = async () => {
    try {
        const favoriteJobs = await AsyncStorage.getItem("favoriteJobs");
        if (favoriteJobs !== null) {
            // We have data!!
            console.log(favoriteJobs);
            return favoriteJobs;
        }
    } catch (error) {
        console.error(
            "failed to retrieve favorite jobs from local storage at retrieveData function in favorites.js",
            error,
        );
    }
};

export const removeJob = async (job_id) => {
    try {
        const storedJobs = await AsyncStorage.getItem("favoriteJobs");
        if (storedJobs !== null) {
            let favoriteJobs = JSON.parse(storedJobs);
            favoriteJobs = favoriteJobs.filter((id) => id !== job_id); // Filter out the job_id to be removed
            await AsyncStorage.setItem("favoriteJobs", JSON.stringify(favoriteJobs));
            // await removeItem(job_id)
            console.log("Job removed from favorites:", job_id);
        }
    } catch (error) {
        console.error(
            "Failed to remove job from favorite jobs in local storage at removeJob function in favorites.js",
            error,
        );
    }
};
