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
import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { writeUserData } from "./db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Firestore } from "./db";
export default function ProfileForm() {
	useEffect(() => {
		locationDropDown();
	}, []);

	const navigation = useNavigation();
	const params = useRoute().params;
	const [countries, setCountries] = useState([]);
	const [userCountry, setUserCountry] = useState("");
	const [job, setJob] = useState("");
	const email = (params && params.email) || " ";
	const saveProfile = async (values) => {
		try {
			console.log("Creating a user session");
			await Firestore({ ...values, email });
			AsyncStorage.setItem("userSession", JSON.stringify({ ...values, email }));
			navigation.navigate("index");
			await writeUserData({ ...values, email });
			const db = await connectToDatabase();
			insertProfile(db, { ...values, email });
		} catch (error) {
			backupProfileSaver(values);
			console.error(error);
		}
	};

	const backupProfileSaver = async (values) => {
		try {
			const db = await connectToDatabase();
			insertProfile(db, { ...values, email });
			await Firestore({ ...values, email });
			console.log("Creating a user session");
			AsyncStorage.setItem("userSession", JSON.stringify({ ...values, email }));
			navigation.navigate("index");
			await writeUserData({ ...values, email });
			await Firestore({ ...values, email });
		} catch (error) {
			console.error(error);
		}
	};

	const locationDropDown = async () => {
		try {
			const countries = await getCachedLocationData("locationData");
			const userCountry = await getCachedLocationData("userCountry");
			const countriesArray = Object.entries(countries.sort());
			setCountries(countriesArray);

			if (userCountry) {
				setUserCountry(userCountry);
			}
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<View>
			<Formik
				initialValues={{ name: "", contact: "", profession: "" }}
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
							// selectedValue={props.values.location}
							selectedValue={userCountry}
							onValueChange={(itemValue) => {
								setUserCountry(itemValue);
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
							<Picker.Item label="Full Time" value="Full Time" />
							<Picker.Item label="Part Time" value="Part Time" />
							<Picker.Item label="Remote" value="Remote" />
							<Picker.Item label="Freelance" value="Freelance" />
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
