/** @format */

import * as Location from "expo-location";

const GetUserCountry = async () => {
	try {
		// Request location permissions
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			return { error: "Permission to access location was denied" };
		}

		// Get the current location
		let location = await Location.getCurrentPositionAsync({});

		// Use reverse geocoding to get the address
		let reverseGeocode = await Location.reverseGeocodeAsync({
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
		});

		// Extract the country from the reverse geocoding result
		if (reverseGeocode.length > 0) {
			let country = reverseGeocode[0].country;
            console.log("user's location is:",country)
			return country;
		} else {
			return { error: "Could not determine the country from the location" };
		}
	} catch (error) {
		// Return the error if something goes wrong
		return { error: error.message };
	}
};

export default GetUserCountry;
