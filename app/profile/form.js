/** @format */

// App.js
import React, { useState } from "react";
import {
	View,
	TextInput,
	Button,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import {
	signUpWithEmail,
	signInWithEmail,
	authenticateWithGoogle,
} from "../../utils/auth";
import { openDatabase } from "react-native-sqlite-storage";
import { useNavigation } from "@react-navigation/native";
import { COLORS, icons, images, SIZES } from "../../constants";
import LoaderKit from "react-native-loader-kit";

const AuthenticationPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigation();
	const [loading, setLoading] = useState(false);

	const handleSignUp = async () => {
		try {
			setLoading(true);
			setMessage("Attempting to Create your new account");
			const signUp = await signUpWithEmail(email, password);
			if (signUp && signUp !== null)
				navigate.navigate("profile/index", { email: email });
			alert(
				"Congratulations !! You have successfully registered an account with us!!Kindly create your profile to help you connect with employers.",
			);
		} catch (error) {
			setLoading(false);
			console.error("Error while attempting to sign up with an email:", error);
			setMessage(
				"Error signing up.Please provide the correct credentials and try again",
			);
		}
	};

	const handleSignIn = async () => {
		try {
			setLoading(true);
			setMessage("Attempting to sign you in");
			const signIn = await signInWithEmail(email, password);
			console.log("signing in");
			if (signIn && signIn !== null)
				navigate.navigate("profile", { email: email });
			// await AsyncStorage.setItem("userSession", JSON.stringify(user));
			setMessage("attempting to sign you in...");
		} catch (error) {
			setLoading(false);
			console.log("Error while attempting to sign in with an email:", error);
			setMessage(
				"Failed to sign you in.Please try again with the correct credentials.",
				error,
			);
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
			{loading && <ActivityIndicator size="large" color={COLORS.tertiary} />}
			<Text style={globalStyles.formMessage}>{message}</Text>
			<View style={globalStyles.Header}>
				<Text style={globalStyles.HeaderText}>JOB FINDERS APPLICATION</Text>
				<Text style={globalStyles.FormInstructions}>
					Create new Account or Login to an existing one
				</Text>
			</View>
			{/* <View>
				<Text  style={globalStyles.FormInstructions}>JOB FINDERS APPLICATION</Text>
			</View> */}
			<TextInput
				autoComplete="email"
				style={globalStyles.input}
				placeholder="Email"
				placeholderTextColor="gray"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
			/>
			<TextInput
				// autoComplete
				style={globalStyles.input}
				placeholder="Password (min 6 characters)"
				placeholderTextColor="gray"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				keyboardType="visible-password"
			/>
			<TouchableOpacity style={globalStyles.submitBtn} onPress={handleSignUp}>
				<Text style={globalStyles.buttonText}>Create an Account(sign up)</Text>
			</TouchableOpacity>

			<TouchableOpacity style={globalStyles.submitBtn} onPress={handleSignIn}>
				<Text style={globalStyles.buttonText}>
					Login to an existing account(sign in)
				</Text>
			</TouchableOpacity>
			<View style={globalStyles.separating_line}></View>
			<View style={globalStyles.Footer}>
				<Text>MOBILE APP DEVELOPMENT. GROUP 5.</Text>
			</View>
		</View>
	);
};

export default AuthenticationPage;
const height = Dimensions.get("window");
const globalStyles = StyleSheet.create({
	container: {
		paddingHorizontal: 10,
		height: height,
		flex: 1,
		// backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
	},
	formMessage: {
		fontSize: SIZES.small,
		color: "black",
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
		padding: 10,
		borderWidth: 1,
		borderColor: COLORS.tertiary,
		marginVertical: 5,
		fontSize: SIZES.large,
		// fontWeight: "bold",
		borderRadius: 10,
		color: "black",
		width: "90%",
	},
	submitBtn: {
		paddingVertical: 15,
		paddingLeft: 10,
		marginTop: 15,
		backgroundColor: COLORS.tertiary,
		borderRadius: 10,
		width: "90%",
		// backgroundColor:"black"
	},
	buttonText: {
		fontSize: 18,
		color: "white",
		fontWeight: "bold",
	},
	separating_line: {
		borderBottomColor: COLORS.tertiary,
		width: "100%",
		// borderBottomWidth: StyleSheet.hairlineWidth,
		position: "absolute",
		bottom: "8%",
	},
	Footer: {
		position: "absolute",
		bottom: "1%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		padding: 1,
	},
});
