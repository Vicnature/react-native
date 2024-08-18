/** @format */

import React,{useContext} from "react";
import {
	StyleSheet,
	Button,
	TextInput,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator
} from "react-native";
import { Formik, connect } from "formik";
import { COLORS, icons, images, SIZES } from "../../constants";
import { connectToDatabase, insertProfile, getProfile } from "../../utils/sqlite";
// import { Picker } from "@react-native-picker/picker";
import { Picker } from "@react-native-picker/picker";
import { getCachedLocationData } from "../../utils/cache";
import { useEffect, useState, useCallback } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { writeUserData } from "../../utils/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Firestore } from "../../utils/db";
import { useFocusEffect } from "@react-navigation/native";
import LoaderKit from "react-native-loader-kit";
import { Platform } from 'react-native';
import { UserContext } from "../_layout";
export default function ProfilePage() {
	const navigation = useNavigation();
	const params = useRoute().params;
	const [countries, setCountries] = useState([]);
	const [userCountry, setUserCountry] = useState("");
	// const [user, setUser] = useState([]);
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("")
	const{user,authenticate}=useContext(UserContext)
	useEffect(() => {
		// authenticate()
		locationDropDown();
	}, []);

	useFocusEffect(
		useCallback(() => {
			// authenticate()
			addEmail()
		}, []),
	);

	const addEmail = async () => {
		try {
			console.log("checking for user session");
			const userSession = await AsyncStorage.getItem("userSession");
			if (userSession !== null) {
				const user = JSON.parse(userSession);
				if (user) setEmail(user.email);
				if (user)
					console.log(
						"Email retrieved from the session in local storage.Email set to:",
						user.email,
					);
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
			setLoading(true)
			setMessage("Creating your profile")
			setEmail(params.email)
			AsyncStorage.setItem(
				"userSession",
				JSON.stringify({ ...values, email }),
			);
			await Firestore({ ...values, email },"userProfiles",email);
			await writeUserData({ ...values, email });
			navigation.navigate("index");
			// const db = await connectToDatabase();
			// insertProfile(db, { ...values, email });
		} catch (error) {
			backupProfileSaver(values);
			setLoading(false)
			setMessage("Failed to create Profile.Try again with correct details.")
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
			await Firestore({ ...values, email },"userProfiles",email);
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
					<View style={globalStyles.container}>
					<ScrollView   contentContainerStyle={globalStyles.scrollContainer}>
					{loading && <ActivityIndicator size="large" color={COLORS.tertiary} />}
						<Text style={globalStyles.formMessage}>{message}</Text>
						<View style={globalStyles.Header}>
							<Text style={globalStyles.HeaderText}>JOB FINDERS APPLICATION</Text>
							<Text style={globalStyles.FormInstructions}>
								Create your profile in order to view jobs.
							</Text>
						</View>
						<TextInput
							autocompleteType="name"
							style={globalStyles.input}
							placeholder="Your Full Name"
							onChangeText={props.handleChange("name")}
							value={props.values.name}
							placeholderTextColor="black"
						/>
						<TextInput
							placeholderTextColor="black"
							autocompleteType="tel"
							multiline
							style={globalStyles.input}
							placeholder="Phone Number"
							onChangeText={props.handleChange("contact")}
							value={props.values.contact}
							keyboardType="numeric"
						/>
						<TextInput
							placeholderTextColor="black"
							autocompleteType="off"
							multiline
							style={globalStyles.input}
							placeholder="Your Profession"
							onChangeText={props.handleChange("profession")}
							value={props.values.profession}
						/>

						<TextInput
							placeholderTextColor="black"
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
						<TouchableOpacity style={globalStyles.submitBtn} onPress={props.handleSubmit}>
							<Text style={globalStyles.buttonText}>Submit Profile</Text>
						</TouchableOpacity>
						<View style={globalStyles.Footer}>
							<Text>MOBILE APP DEVELOPMENT. GROUP 5.</Text>
						</View>
					</ScrollView>
					</View>
				)}
			</Formik>
		</View>
	);
}

const globalStyles = StyleSheet.create({
	container: {
		// flex: 1,  // Ensure the container fills the available space
		// justifyContent: 'center',
		// alignItems: 'center',
		width:'100%',
		height: '100%',
	},
	scrollContainer: {
		flexGrow: 1,
		width: '100%',
		padding:10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	formMessage: {
		fontSize: SIZES.small,
		color: 'black',
		fontWeight: "bold",
	},
	Header: {
		padding: 10,
		fontWeight: "bold",
		fontStyle: "italic",
		// position: "absolute",
		// top: 0,
		// backgroundColor: COLORS.lightWhite,
		width: "100%",
		marginBottom: 20,
		// height:"10%",
		justifyContent: "center",
		alignItems: "center",
	},
	HeaderText: {
		fontSize: 25,
		fontWeight: "bold",
		color: COLORS.tertiary,
	},
	FormInstructions: {
		// width:"80%",
		color: "gray",
	},
	input: {
		padding: 5,
		borderWidth: 1,
		borderColor: COLORS.tertiary,
		marginVertical: 5,
		fontSize: SIZES.large,
		borderRadius: 10,
		color: "black",
		width: "90%",
	},
	submitBtn: {
		paddingVertical: 15,
		paddingLeft: 10,
		marginVertical: 5,
		backgroundColor: COLORS.tertiary,
		borderRadius: 10,
		width: "90%",
		alignItems:"center"
		// backgroundColor:"black"
	},
	buttonText: {
		fontSize: 18,
		color: "white",
		fontWeight: "bold",
	},
	pickers: {
		borderWidth: 1,
		marginVertical: Platform.OS === 'ios' ? 20 : 1,
		padding:1,
		borderColor: Platform.OS === 'ios' ?"transparent":"black",
		borderWidth:1,
		fontSize: SIZES.xLarge,
		borderRadius: 10,
		color: COLORS.tertiary,
		width: '90%',
		height: Platform.OS === 'ios' ? 150 : 1, // Adjust for iOS specifically
		// height:100,
	},
	Footer: {
		position: "absolute",
		bottom: "1%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		padding: 1,
		zIndex:-1,
	},
});
