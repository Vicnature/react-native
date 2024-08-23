/** @format */

import React, { createContext, useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	Image,
} from "react-native";
import { Stack } from "expo-router";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOutFromFirebase } from "../utils/auth";
import MenuModal from "../components/home/layout/MenuModal"; // Import the MenuModal component
import { COLORS, icons } from "../constants";
import { getDocFromFirestoreDb } from "../utils/db";
import * as SecureStore from "expo-secure-store";
export const UserContext = createContext();

const Layout = () => {
	const [user, setUser] = useState({});
	const [firebaseUserId, setFirebaseUserId] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const navigation = useNavigation();
	const [lastOpenedScreen, setLastOpenedScreen] = useState("");

	useEffect(() => {
		authenticate();
	}, [firebaseUserId]);

	const unstable_settings = {
		initialRouteName: lastOpenedScreen !== null ? lastOpenedScreen : "index",
	};

	const goToLastOpenedScreen = async (lastScreen) => {
		try {
			if (lastScreen) {
				setFirebaseUserId(lastScreen);
				navigation.navigate(lastScreen);
			}
		} catch (e) {
			console.error("failed to navigate to last opened screen", e);
			navigation.navigate("index");
		}
	};

	const authenticate = async () => {
		try {
			console.log("looking for user session");
			const userSession = await AsyncStorage.getItem("userSession");
			const lastScreen = await SecureStore.getItemAsync("lastOpenedScreen");

			// Check if a session exists. Redirect to the home page if it does.
			if (userSession !== null) {
				let user = JSON.parse(userSession);

				// Convert all string values in the user object to uppercase
				user = Object.fromEntries(
					Object.entries(user).map(([key, value]) => {
						if (typeof value === "string") {
							return [key, value.toUpperCase()];
						}
						return [key, value];
					}),
				);

				console.log("found user session", user);
				setUser(user);
			} else if (firebaseUserId) {
				console.log("looking for user on firestore");
				const doc = await getDocFromFirestoreDb("userProfiles", firebaseUserId);
				if (doc && doc !== null) {
					// Convert all string values in the doc object to uppercase
					const upperCaseDoc = Object.fromEntries(
						Object.entries(doc).map(([key, value]) => {
							if (typeof value === "string") {
								return [key, value.toUpperCase()];
							}
							return [key, value];
						}),
					);

					console.log("found user on firestore", upperCaseDoc);
					AsyncStorage.setItem("userSession", JSON.stringify(upperCaseDoc));
					setUser(upperCaseDoc);
					navigation.navigate("index");
				}
			} else {
				console.log("User does not have a session nor a firebaseUserId");
				navigation.navigate("profile/form");
			}

			if (lastScreen) goToLastOpenedScreen(lastScreen);
		} catch (error) {
			console.error("Error retrieving session: ", error);
		}
	};

	const signOut = async () => {
		try {
			alert("You have signed out.Please log back in to view jobs.");
			signOutFromFirebase();
			AsyncStorage.removeItem("userSession");
			setUser({});
			navigation.navigate("profile/form");
		} catch (e) {
			console.log("Failed to sign out the user,", e);
			alert("Failed to sign you out,kindly try again later.");
		}
	};

	const toggleModal = () => {
		setModalVisible(!modalVisible);
	};

	const HeaderLeft = () => (
		<TouchableOpacity onPress={toggleModal} style={{ marginHorizontal: 10 }}>
			<Image source={icons.menu} style={{ width: 35, height: 24 }} />
		</TouchableOpacity>
	);

	const HeaderRight = () => (
		<TouchableOpacity
			onPress={() => navigation.navigate("index")}
			style={{ marginHorizontal: 10 }}
		>
			<Text
				style={{
					fontSize: 18,
					fontWeight: "bold",
					color: COLORS.tertiary,
				}}
			>
				JOB FINDER APPLICATION
			</Text>
		</TouchableOpacity>
	);

	return (
		<UserContext.Provider
			value={{ user, signOut, authenticate, setFirebaseUserId }}
		>
			<SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
				<Stack initialRouteName={lastOpenedScreen || "index"}>
					<Stack.Screen
						name="index"
						options={{
							title: "",
							headerStyle: { backgroundColor: "white" },
							headerTintColor: "black",
							headerLeft: HeaderLeft,
							headerRight: HeaderRight,
						}}
					/>
					<Stack.Screen
						name="profile/index"
						options={{
							title: "",
							headerStyle: { backgroundColor: "white" },
							headerTintColor: "black",
							headerLeft: () => {
								if (Object.keys(user).length === 0)
									return (
										<View
											style={{
												width: "96%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text
												style={{
													color: "gray",
													fontSize: 15,
													fontWeight: "bold",
												}}
											>
												USER PROFILE CREATION PAGE
											</Text>
										</View>
									);
								return (
									<View
										onPress={() => navigation.navigate("profile/display")}
										style={{
											width: "96%",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Text
											onPress={async () => {
												navigation.navigate("profile/display");
												SecureStore.setItemAsync(
													"lastOpenedScreen",
													"profile/display",
												);
											}}
											style={{
												color: COLORS.tertiary,
												fontSize: 18,
												fontWeight: "bold",
											}}
										>
											GO BACK TO PROFILE PAGE
										</Text>
									</View>
								);
							},
						}}
					/>
					<Stack.Screen
						name="profile/form"
						options={{
							title: "",
							headerStyle: { backgroundColor: "white" },
							headerTintColor: "black",
							headerLeft: () => (
								<View
									style={{
										width: "96%",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Text
										style={{ color: "gray", fontSize: 15, fontWeight: "bold" }}
									>
										ACCOUNT REGISTRATION AND LOGIN PAGE
									</Text>
								</View>
							),
						}}
					/>
					<Stack.Screen
						name="profile/display"
						options={{
							title: "",
							headerStyle: { backgroundColor: "white" },
							headerTintColor: "black",
							headerLeft: HeaderLeft,
							// headerRight: HeaderRight,
						}}
					/>
				</Stack>
				<MenuModal visible={modalVisible} onClose={toggleModal} />
			</SafeAreaView>
		</UserContext.Provider>
	);
};

export default Layout;

const style = StyleSheet.create({
	header_links: {
		fontSize: 16,
		color: "black",
		marginHorizontal: 10,
	},
});
