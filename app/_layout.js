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
// Create a context
export const UserContext = createContext();

export const unstable_settings = {
	initialRouteName: "index",
};

const Layout = () => {
	const [user, setUser] = useState({});
	const [firebaseUserId, setFirebaseUserId] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const navigation = useNavigation();

	useEffect(() => {
		authenticate();
	}, [firebaseUserId]);


	useFocusEffect(
		useCallback(() => {
			authenticate();
		}, []),
	);

	const authenticate = async () => {
		try {
			console.log("looking for user session");
			const userSession = await AsyncStorage.getItem("userSession");
			if (userSession !== null) {
				const user = JSON.parse(userSession);
				console.log("found user session",user)
				setUser(user);
				return;
			}
			if (firebaseUserId) {
				console.log("looking for user on firestore");
				const doc = await getDocFromFirestoreDb("userProfiles", firebaseUserId);
				if (doc && doc !== null) {
					console.log("found user on firestore", doc);
					AsyncStorage.setItem("userSession", JSON.stringify(doc));
					setUser(doc);
					navigation.navigate("index");
				}

			}
		} catch (error) {
			console.error("Error retrieving session: ", error);
		}
	};

	const signOut = async () => {
		alert("You have signed out.Please log back in to view jobs.");
		signOutFromFirebase();
		AsyncStorage.removeItem("userSession");
		setUser({});
		navigation.navigate("profile/form");
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
				JOB FINDERS APPLICATION
			</Text>
		</TouchableOpacity>
	);

	return (
		<UserContext.Provider
			value={{ user, signOut, authenticate, setFirebaseUserId }}
		>
			<SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
				<Stack initialRouteName="index">
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
								if (!user)
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
												ACCOUNT REGISTRATION AND LOGIN PAGE
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
											onPress={() => navigation.navigate("profile/display")}
											style={{
												color: "green",
												fontSize: 18,
												fontWeight: "bold",
											}}
										>
											GO BACK TO PROFILE PAGE
										</Text>
									</View>
								);
							},
							// headerRight:user ? (<Text>Back</Text>): HeaderRight
							// headerRight:(()=>{
							// 	return user?<Text>back</Text>:HeaderRight
							// })
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
					{/* Other Stack.Screen components */}
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
