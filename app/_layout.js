/** @format */

// /** @format */

// // /** @format */

// // export default Layout;
// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// import { Stack, useNavigation } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { signOutFromFirebase } from "./auth";
// // import * as SplashScreen from "expo-splash-screen";

// // SplashScreen.preventAutoHideAsync();

// export const unstable_settings = {
// 	// Ensure any route can link back to `/`
// 	initialRouteName: "profile",
// };

// const Layout = () => {
// 	const navigation = useNavigation();

// 	const signOut = async () => {
//     alert(
//       "You have signed out of the application.Kindly sign in to continue using our services.Thankyou",
//       );
//       navigation.navigate("form")
//       signOutFromFirebase();
//       AsyncStorage.removeItem("userSession");
//       console.log("User signed out and session cleared!");
// 	};
// 	return (
// 		<Stack initialRouteName="display">
// 			<Stack.Screen
// 				name="index"
// 				options={{
// 					title: "JOB FINDERS",
// 					headerStyle: { backgroundColor: "white" },
// 					headerTintColor: "black",
// 					headerRight: () => (
// 						<View style={style.header_navigation}>
// 							<Text
// 								style={style.header_links}
// 								onPress={() => navigation.navigate("display")}
// 							>
// 								PROFILE
// 							</Text>
// 							<Text style={style.header_links} onPress={signOut}>SIGN OUT</Text>
// 						</View>
// 					),
// 				}}
// 			/>
// 			<Stack.Screen
// 				name="profile"
// 				options={{
// 					title: "profile",
// 					headerStyle: { backgroundColor: "white" },
// 					headerTintColor: "black",
// 				}}
// 			/>
// 			<Stack.Screen
// 				name="form"
// 				options={{
// 					title: "Account Page",
// 					headerStyle: { backgroundColor: "white" },
// 					headerTintColor: "black",
// 				}}
// 			/>
// 		</Stack>
// 	);
// };

// export default Layout;

// const style = StyleSheet.create({
// 	header_navigation: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		paddingHorizontal: 20,
// 		// paddingVertical:20,
// 		// width:200,
// 	},
// 	header_links: {
// 		fontSize: 16,
// 		color: "black",
// 		marginHorizontal: 10,
// 	},
// });

/** @format */

/** @format */

/** @format */
/** @format */
import React, { createContext, useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOutFromFirebase } from "../utils/auth";
import { ListOfAllCountries } from "../hook/useFetch";
import { cacheLocationData } from "../utils/cache";
import GetUserCountry from "../utils/sensors";

// Create a context
export const UserContext = createContext();

export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: "index",
};

const Layout = () => {
	const [user, setUser] = useState({});
	const [profession, setProfession] = useState("");
	const [preferredJob, setPreferredJob] = useState("");
	const navigation = useNavigation();

	useEffect(() => {
		authenticate();
		retrieveListOfCountries();
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
				console.log("User session found: ", user);
				setUser(user);
				setProfession(user?.profession);
				setPreferredJob(user?.job_preference);
			} else {
				navigation.navigate("form");
				console.log(
					"No user session found! Redirecting to authentication page",
				);
				alert(
					"Kindly Sign up a new account or Sign in with an existing one to continue.",
				);
			}
		} catch (error) {
			console.error("Error retrieving session: ", error);
		}
	};

	const retrieveListOfCountries = async () => {
		try {
			const countries = await ListOfAllCountries();
			await cacheLocationData("locationData", countries);
			const userCountry = await GetUserCountry();
			await cacheLocationData("userCountry", userCountry);
		} catch (error) {
			console.error("Error when caching the location:", error);
		}
	};

	const signOut = async () => {
		alert(
			"You have signed out of the application. Kindly sign in to continue using our services. Thank you.",
		);
		signOutFromFirebase();
		AsyncStorage.removeItem("userSession");
		setUser({});
		console.log("User signed out and session cleared!");
		navigation.navigate("profile/form");
	};

	return (
		<UserContext.Provider
			value={{ user, profession, preferredJob, signOut, authenticate }}
		>
			<SafeAreaView style={{ flex: 1 }}>
				<Stack initialRouteName="display">
					<Stack.Screen
						name="index"
						options={{
							title: "JOB FINDERS",
							headerStyle: { backgroundColor: "white" },
							headerTintColor: "black",
							headerRight: () => (
								<View style={style.header_navigation}>
									<Text
										style={style.header_links}
										onPress={() => navigation.navigate("profile/display")}
									>
										PROFILE
									</Text>
									<Text style={style.header_links} onPress={signOut}>
										SIGN OUT
									</Text>
								</View>
							),
						}}
					/>
					<Stack.Screen
						name="profile"
						options={{
							title: "Profile",
							headerStyle: { backgroundColor: "white" },
							headerTintColor: "black",
						}}
					/>
					<Stack.Screen
						name="form"
						options={{
							title: "Account Page",
							headerStyle: { backgroundColor: "white" },
							headerTintColor: "black",
						}}
					/>
					<Stack.Screen
						name="display"
						options={{
							title: "Your Profile",
							headerStyle: { backgroundColor: "white" },
							headerTintColor: "black",
						}}
					/>
				</Stack>
			</SafeAreaView>
		</UserContext.Provider>
	);
};

export default Layout;

const style = StyleSheet.create({
	header_navigation: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 20,
	},
	header_links: {
		fontSize: 16,
		color: "black",
		marginHorizontal: 10,
	},
});
