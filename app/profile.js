/** @format */

import React from "react";
import {
	StyleSheet,
	Button,
	TextInput,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { Formik, connect } from "formik";
import { COLORS, icons, images, SIZES } from "../constants";
import { connectToDatabase, insertProfile, getProfile } from "../utils/sqlite";
// import { Picker } from "@react-native-picker/picker";
import { Picker } from "@react-native-picker/picker";
import { getCachedLocationData } from "../utils/cache";
import { useEffect, useState, useCallback } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { writeUserData } from "./db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Firestore } from "./db";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileForm() {
	const navigation = useNavigation();
	const params = useRoute().params;
	const [countries, setCountries] = useState([]);
	const [userCountry, setUserCountry] = useState("");
	const [user, setUser] = useState([]);
	const [email, setEmail] = useState("");
	// const email = (params && params.email) || user.email ||" ";
	useEffect(() => {
		locationDropDown();
	}, []);

	useFocusEffect(
		useCallback(() => {
			authenticate();
		}, []),
	);

	const authenticate = async () => {
		try {
			console.log("checking for user session");
			const userSession = await AsyncStorage.getItem("userSession");
			if (userSession !== null) {
				const user = JSON.parse(userSession);
				if (user) setEmail(user.email);
				if (user) console.log("Email retrieved from the session in local storage.Email set to:", user.email);
			} else if (
				params &&
				params.email !== undefined &&
				params.email !== null
			) {
				setEmail(params.email);
				console.log(
					"Email retrieved from the params.Email set to:",
					params.email,
				);
			} else {
				navigation.navigate("form");
				console.log(
					"User has no session and no email has been found within the params.Redirecting back to authentication page",
				);
				alert(
					"Kindly Sign up a new account or Sign in with an existing one to continue.",
				);
			}
		} catch (error) {
			console.error("Error retrieving session: ", error);
		}
	};

	const saveProfile = async (values) => {
		try {
			await AsyncStorage.setItem(
				"userSession",
				JSON.stringify({ ...values, email }),
			);
			await Firestore({ ...values, email });
			await writeUserData({ ...values, email });
			navigation.navigate("index");
			// const db = await connectToDatabase();
			// insertProfile(db, { ...values, email });
		} catch (error) {
			// backupProfileSaver(values);
			console.error(
				"Could not insert profile into our databases using saveProfile function in profile.js",
				error,
			);
		}
	};

	const backupProfileSaver = async (values) => {
		try {
			const db = await connectToDatabase();
			await writeUserData({ ...values, email });
			await Firestore({ ...values, email });
			await AsyncStorage.setItem(
				"userSession",
				JSON.stringify({ ...values, email }),
			);
			insertProfile(db, { ...values, email });
			navigation.navigate("index");
		} catch (error) {
			console.error(error);
		}
	};

	const locationDropDown = async () => {
		try {
			const userCountry = await getCachedLocationData("userCountry");
			if (userCountry) {
				console.log(
					"there is a country for the user",
					userCountry,
					"it has a type of",
					typeof userCountry,
				);
				setUserCountry(userCountry);
			}
			const countries = await getCachedLocationData("locationData");
			const countriesArray = Object.entries(countries.sort());
			setCountries(countriesArray);
		} catch (error) {
			console.error(error);
		}
	};
	if (userCountry === "") {
		return (
			<View>
				<Text>Loading the profile form...</Text>
			</View>
		); // or some loading spinner
	}

	return (
		<View>
			<Formik
				initialValues={{
					// name: "Btech IT Student",
					// contact: "07",
					// profession: "Student",
					location: userCountry,
					// job_preference: "Full Time",
					// resume_link:"My cv is a total lie.And yours is too!!"
				}} // Add location here
				onSubmit={(values) => {
					console.log(values);
					saveProfile(values);
				}}
			>
				{(props) => (
					<ScrollView style={globalStyles.container}>
						<TextInput
							autocompleteType="name"
							style={globalStyles.input}
							placeholder="Your Full Name"
							onChangeText={props.handleChange("name")}
							value={props.values.name}
						/>
						<TextInput
							autocompleteType="tel"
							multiline
							style={globalStyles.input}
							placeholder="Phone Number"
							onChangeText={props.handleChange("contact")}
							value={props.values.contact}
							keyboardType="numeric"
						/>
						<TextInput
							autocompleteType="off"
							multiline
							style={globalStyles.input}
							placeholder="Your Profession"
							onChangeText={props.handleChange("profession")}
							value={props.values.profession}
						/>

						<TextInput
							autocompleteType="url"
							multiline
							style={globalStyles.input}
							placeholder="Provide a link to your resume/CV"
							onChangeText={props.handleChange("resume_link")}
							value={props.values.resume_link}
						/>

						{/* <TouchableOpacity style={globalStyles.input}> */}
						<Picker
							style={globalStyles.pickers}
							selectedValue={props.values.location}
							// selectedValue={userCountry}
							onValueChange={(itemValue) => {
								// setUserCountry(itemValue)
								props.setFieldValue("location", itemValue);
							}}
						>
							<Picker.Item label="Select Your Current Location" value=" " />
							{countries.map(([_, country]) => (
								<Picker.Item key={country} label={country} value={country} />
							))}
						</Picker>
						{/* </TouchableOpacity> */}

						{/* <TouchableOpacity style={globalStyles.input}> */}
						<Picker
							style={globalStyles.pickers}
							selectedValue={props.values.job_preference}
							onValueChange={(itemValue) =>
								props.setFieldValue("job_preference", itemValue)
							}
						>
							<Picker.Item label="Select Your Job Preference" value="" />
							<Picker.Item label="Full Time" value="FULLTIME" />
							<Picker.Item label="Part Time" value="PARTTIME" />
							<Picker.Item label="Contractual Jobs" value="CONTRACTOR" />
							<Picker.Item label="Intern" value="INTERN" />
						</Picker>
						{/* </TouchableOpacity> */}
						<View style={globalStyles.submitBtn}>
							<Button
								title="submit profile"
								color={COLORS.tertiary}
								onPress={props.handleSubmit}
							/>
						</View>
					</ScrollView>
				)}
			</Formik>
		</View>
	);
}

const globalStyles = StyleSheet.create({
	container: {
		padding: 10,
	},
	input: {
		padding: 20,
		borderWidth: 1,
		borderColor: COLORS.tertiary,
		marginVertical: 5,
		fontSize: SIZES.large,
		fontWeight: "bold",
		borderRadius: 10,
	},
	submitBtn: {
		paddingVertical: 25,
		fontSize: 30,
		borderRadius: 10,
	},
	pickers: {
		padding: 25,
		borderWidth: 1,
		borderBottomColor: "pink",
		borderColor: COLORS.tertiary,
		marginVertical: 5,
		fontSize: SIZES.xLarge,
		fontWeight: "extra-bold",
		borderRadius: 10,
		color: COLORS.tertiary,
	},
});
