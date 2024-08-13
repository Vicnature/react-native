/** @format */

import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to cache location data
export const cacheLocationData = async (cacheTitle, data) => {
	try {
		console.log("attempting to cache", cacheTitle);
		// await AsyncStorage.setItem("locationData", JSON.stringify(data));
		cacheTitle == "userCountry"
			? await AsyncStorage.setItem("userCountry", JSON.stringify(data))
			: await AsyncStorage.setItem("locationData", JSON.stringify(data));
		console.log(cacheTitle, "cached successfully");
	} catch (error) {
		console.error("Error caching location data:", error);
	}
};

// Function to retrieve cached location data
export const getCachedLocationData = async (cacheTitle) => {
	try {
		console.log("Attempting to retrieve", cacheTitle, "from the cache");

		// Retrieve data from AsyncStorage using the provided cacheTitle
		const cachedData = await AsyncStorage.getItem(cacheTitle);
		console.log(cacheTitle,":", cachedData);
		return cachedData ? JSON.parse(cachedData) : null;
	} catch (error) {
		console.error("Error retrieving cached location data:", error);
		return null;
	}
};
