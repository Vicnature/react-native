/** @format */

// App.js
import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import {
	signUpWithEmail,
	signInWithEmail,
	authenticateWithGoogle,
} from "./auth";
import { openDatabase } from "react-native-sqlite-storage";
import { useNavigation } from "@react-navigation/native";
import { COLORS, icons, images, SIZES } from "../constants";


const App = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigation();

	const handleSignUp = async () => {
		try {
			await signUpWithEmail(email, password);
			setMessage("attempting to sign you up...");
			navigate.navigate("profile", { email: email });
			alert(
				"Congratulations !! You have successfully registered an account with us!!Kindly create your profile to help you connect with employers.",
			);
		} catch (error) {
			setMessage(error.message);
			console.error("Error while attempting to sign up with an email:", error);
		}
	};

	const handleSignIn = async () => {
		try {
			await signInWithEmail(email, password);
			console.log("signing in")
			// await AsyncStorage.setItem("userSession", JSON.stringify(user));
			setMessage("attempting to sign you in...");
		} catch (error) {
			console.log(error);
		}
	};
	const handleGoogleAuthentication = async () => {
		try {
			authenticateWithGoogle();
			// setMessage("attempting to sign you in...");
		} catch (error) {
			setMessage(error.message);
		}
	};

	return (
		<View style={globalStyles.container}>
			<TextInput
				style={globalStyles.input}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				style={globalStyles.input}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			<View style={globalStyles.submitBtn}>
				<Button
					color={COLORS.tertiary}
					title="Sign Up"
					onPress={handleSignUp}
				/>
			</View>
			<View style={globalStyles.submitBtn}>
				<Button
					color={COLORS.tertiary}
					title="Sign In"
					onPress={handleSignIn}
				/>
			</View>
			<View style={globalStyles.submitBtn}>
				<Button
					color={COLORS.tertiary}
					title="Sign In with  Google"
					onPress={handleGoogleAuthentication}
				/>
			</View>
			<Text>{message}</Text>
		</View>
	);
};

export default App;

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
		paddingVertical: 10,
		fontSize: 30,
		borderRadius: 10,
	},
});
